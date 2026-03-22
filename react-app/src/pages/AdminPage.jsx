import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useBooking, BASE_SERVICES } from "../context/BookingContext"
import { useAuth } from "../context/AuthContext"

/* ─── Helpers ─── */
const pad = (v) => String(v).padStart(2, "0")
const getDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const readableDate = (key) => {
  if (!key) return ""
  const [y, m, d] = key.split("-")
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  })
}

const buildCalendar = (date) => {
  const year  = date.getFullYear()
  const month = date.getMonth()
  const first = new Date(year, month, 1).getDay()
  const days  = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const WEEK_DAYS    = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAY_NAMES    = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const ALL_POSSIBLE_TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00",
]

/* ─── Admin Panel Views ─── */
const VIEWS = ["dashboard", "calendar", "bookings"]

export default function AdminPage() {
  const {
    shopConfig,
    bookings,
    getDayConfig,
    getDateBookings,
    updateShopConfig,
    setDayConfig,
    resetDayConfig,
    cancelBooking,
  } = useBooking()

  const { logout } = useAuth()
  const navigate   = useNavigate()

  const today    = new Date()
  const todayKey = getDateKey(today)

  const [view,        setView]        = useState("dashboard")
  const [calDate,     setCalDate]     = useState(today)
  const [selectedDay, setSelectedDay] = useState(null)  // YYYY-MM-DD
  const [bookFilter,  setBookFilter]  = useState("")
  const [confirmDel,  setConfirmDel]  = useState(null)  // booking id

  const calendar = buildCalendar(calDate)

  /* Dashboard stats */
  const stats = useMemo(() => {
    const today7  = new Date(today); today7.setDate(today7.getDate() + 7)
    const upcoming = bookings.filter(b => b.date >= todayKey)
    const thisWeek = bookings.filter(b => b.date >= todayKey && b.date <= getDateKey(today7))
    const revenue  = bookings.length * 500  // demo: ₹500 avg per booking
    return { total: bookings.length, upcoming: upcoming.length, thisWeek: thisWeek.length, revenue }
  }, [bookings, todayKey])

  /* Filtered bookings */
  const filteredBookings = useMemo(() => {
    const q = bookFilter.trim().toLowerCase()
    return q
      ? bookings.filter(b =>
          b.name?.toLowerCase().includes(q) ||
          b.date?.includes(q) ||
          b.serviceId?.includes(q) ||
          b.phone?.includes(q)
        )
      : [...bookings]
  }, [bookings, bookFilter])

  /* Day editor helpers */
  const dayConfigForEdit = selectedDay ? getDayConfig(selectedDay) : null
  const dayOverride      = selectedDay ? (shopConfig.dayConfigs[selectedDay] || {}) : {}

  const toggleDayOpen = () => {
    if (!selectedDay) return
    const cfg = getDayConfig(selectedDay)
    setDayConfig(selectedDay, { open: !cfg.isOpen })
  }

  const toggleGlobalDay = (dayIdx) => {
    updateShopConfig(prev => ({
      ...prev,
      openDays: prev.openDays.includes(dayIdx)
        ? prev.openDays.filter(d => d !== dayIdx)
        : [...prev.openDays, dayIdx].sort()
    }))
  }

  const toggleTime = (time) => {
    if (!selectedDay) return
    const cfg = getDayConfig(selectedDay)
    const slots = cfg.timeSlots.includes(time)
      ? cfg.timeSlots.filter(t => t !== time)
      : [...cfg.timeSlots, time].sort()
    setDayConfig(selectedDay, { timeSlots: slots })
  }

  const setServiceCap = (serviceId, cap) => {
    if (!selectedDay) return
    const cfg = getDayConfig(selectedDay)
    const services = { ...((dayOverride.services) || {}) }
    BASE_SERVICES.forEach(s => {
      if (!services[s.id]) services[s.id] = cfg.services.find(sv=>sv.id===s.id)?.capacity ?? s.defaultCapacity
    })
    services[serviceId] = Math.max(0, parseInt(cap,10)||0)
    setDayConfig(selectedDay, { services })
  }

  const resetDay = () => {
    if (!selectedDay) return
    resetDayConfig(selectedDay)
  }

  const toggleGlobalTime = (time) => {
    updateShopConfig(prev => ({
      ...prev,
      defaultTimeSlots: prev.defaultTimeSlots.includes(time)
        ? prev.defaultTimeSlots.filter(t => t !== time).sort()
        : [...prev.defaultTimeSlots, time].sort()
    }))
  }

  return (
    <div className="admin-shell">
      {/* ─────────────── Sidebar ─────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo">💅</span>
          <div>
            <p className="admin-sidebar__name">Leela's Lounge</p>
            <p className="admin-sidebar__role">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {[
            { id:"dashboard", label:"Dashboard",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
            { id:"calendar",  label:"Manage Days", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { id:"bookings",  label:"Bookings",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
          ].map(v => (
            <button
              key={v.id}
              className={`admin-nav-btn${view===v.id?" is-active":""}`}
              onClick={() => { setView(v.id); setSelectedDay(null) }}
            >
              {v.icon}
              <span>{v.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" className="admin-back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Site
          </a>
          <button
            className="admin-logout-btn"
            onClick={() => { logout(); navigate('/admin-login', { replace: true }) }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─────────────── Main ─────────────── */}
      <main className="admin-main">

        {/* ════ DASHBOARD ════ */}
        {view === "dashboard" && (
          <div className="admin-view">
            <div className="admin-view__head">
              <h1 className="admin-view__title">Dashboard</h1>
              <p className="admin-view__sub">Welcome back! Here's your salon at a glance.</p>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid">
              {[
                { label:"Total Bookings",   value:stats.total,         icon:"📋", color:"blue"   },
                { label:"Upcoming",         value:stats.upcoming,      icon:"📅", color:"purple" },
                { label:"This Week",        value:stats.thisWeek,      icon:"🗓️", color:"amber"  },
                { label:"Est. Revenue (₹)", value:`₹${stats.revenue.toLocaleString()}`, icon:"💰", color:"green" },
              ].map(s => (
                <div key={s.label} className={`admin-stat-card admin-stat-card--${s.color}`}>
                  <span className="admin-stat-card__icon">{s.icon}</span>
                  <strong className="admin-stat-card__value">{s.value}</strong>
                  <span className="admin-stat-card__label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Open days global config */}
            <div className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Default Open Days</h2>
                <p className="admin-card__sub">Toggle which days of the week the shop is open by default. You can override per date in "Manage Days".</p>
              </div>
              <div className="admin-day-toggles">
                {DAY_NAMES.map((name, idx) => (
                  <label key={name} className="admin-day-toggle">
                    <input
                      type="checkbox"
                      checked={shopConfig.openDays.includes(idx)}
                      onChange={() => toggleGlobalDay(idx)}
                    />
                    <span>{name.slice(0,3)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Default time slots */}
            <div className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Default Time Slots</h2>
                <p className="admin-card__sub">These slots apply to all dates unless overridden per day.</p>
              </div>
              <div className="admin-time-toggles">
                {ALL_POSSIBLE_TIMES.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`admin-time-toggle${shopConfig.defaultTimeSlots.includes(t)?" is-on":""}`}
                    onClick={() => toggleGlobalTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Recent Bookings</h2>
                <button className="admin-view-all-btn" onClick={() => setView("bookings")}>View All →</button>
              </div>
              {bookings.length === 0
                ? <p className="admin-empty">No bookings yet.</p>
                : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr><th>Name</th><th>Service</th><th>Date</th><th>Time</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {[...bookings].reverse().slice(0,5).map(b => (
                          <tr key={b.id}>
                            <td><strong>{b.name}</strong><br/><small>{b.phone}</small></td>
                            <td>{BASE_SERVICES.find(s=>s.id===b.serviceId)?.icon} {BASE_SERVICES.find(s=>s.id===b.serviceId)?.title}</td>
                            <td>{readableDate(b.date)}</td>
                            <td>{b.time}</td>
                            <td><span className={`admin-badge admin-badge--${b.date>=todayKey?"upcoming":"past"}`}>{b.date>=todayKey?"Upcoming":"Past"}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ════ CALENDAR / MANAGE DAYS ════ */}
        {view === "calendar" && (
          <div className="admin-view">
            <div className="admin-view__head">
              <h1 className="admin-view__title">Manage Days</h1>
              <p className="admin-view__sub">Click any date to set open/closed, customize time slots, and adjust service capacities.</p>
            </div>

            <div className="admin-cal-layout">
              {/* Calendar */}
              <div className="admin-card admin-cal-card">
                <div className="admin-cal-nav">
                  <button className="admin-cal-arrow" onClick={() => {
                    const d = new Date(calDate); d.setMonth(d.getMonth()-1); setCalDate(d)
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <strong className="admin-cal-month">
                    {calDate.toLocaleDateString("en-US", { month:"long", year:"numeric" })}
                  </strong>
                  <button className="admin-cal-arrow" onClick={() => {
                    const d = new Date(calDate); d.setMonth(d.getMonth()+1); setCalDate(d)
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>

                <div className="admin-weekdays">
                  {WEEK_DAYS.map(d => <span key={d}>{d}</span>)}
                </div>

                <div className="admin-cal-grid">
                  {calendar.map((date, i) => {
                    if (!date) return <div key={i} />
                    const key = getDateKey(date)
                    const cfg = getDayConfig(key)
                    const hasOverride = !!shopConfig.dayConfigs[key]
                    const bkMap = getDateBookings(key)
                    const bkCount = Object.values(bkMap).reduce((sum, slotMap) =>
                      sum + Object.values(slotMap).reduce((a,b)=>a+b, 0), 0)
                    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    const isSel = key === selectedDay

                    return (
                      <button
                        key={key}
                        type="button"
                        className={`admin-cal-day${isSel?" is-selected":""}${!cfg.isOpen?" is-closed":""}${isPast?" is-past":""}${hasOverride?" has-override":""}`}
                        onClick={() => setSelectedDay(isSel ? null : key)}
                      >
                        <span className="admin-cal-day__num">{date.getDate()}</span>
                        {cfg.isOpen
                          ? <span className="admin-cal-day__bk">{bkCount > 0 ? `${bkCount} bkd` : "Open"}</span>
                          : <span className="admin-cal-day__closed">Closed</span>
                        }
                        {hasOverride && <span className="admin-cal-day__dot" title="Custom config" />}
                      </button>
                    )
                  })}
                </div>

                <div className="admin-cal-legend">
                  <span><i className="admin-dot admin-dot--open" />Open</span>
                  <span><i className="admin-dot admin-dot--closed" />Closed</span>
                  <span><i className="admin-dot admin-dot--override" />Customized</span>
                </div>
              </div>

              {/* Day Editor */}
              {selectedDay && dayConfigForEdit && (
                <div className="admin-day-editor">
                  <div className="admin-card">
                    <div className="admin-card__head">
                      <h2 className="admin-card__title">{readableDate(selectedDay)}</h2>
                      <div style={{display:"flex",gap:"8px"}}>
                        <button
                          className={`admin-toggle-btn${dayConfigForEdit.isOpen?" is-open":""}`}
                          onClick={toggleDayOpen}
                        >
                          {dayConfigForEdit.isOpen ? "Mark Closed" : "Mark Open"}
                        </button>
                        {shopConfig.dayConfigs[selectedDay] && (
                          <button className="admin-reset-btn" onClick={resetDay} title="Remove all custom overrides for this day">
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`admin-day-open-badge${dayConfigForEdit.isOpen?"":" is-closed"}`}>
                      {dayConfigForEdit.isOpen
                        ? <><span>🟢</span> Shop is Open</>
                        : <><span>🔴</span> Shop is Closed</>
                      }
                    </div>

                    {dayConfigForEdit.isOpen && (
                      <>
                        {/* Time Slots Override */}
                        <div className="admin-editor-section">
                          <h3 className="admin-editor-section__title">Time Slots for This Day</h3>
                          <p className="admin-editor-section__sub">Toggle individual slots on/off.</p>
                          <div className="admin-time-toggles">
                            {ALL_POSSIBLE_TIMES.map(t => (
                              <button
                                key={t}
                                type="button"
                                className={`admin-time-toggle${dayConfigForEdit.timeSlots.includes(t)?" is-on":""}`}
                                onClick={() => toggleTime(t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Service Capacity Override */}
                        <div className="admin-editor-section">
                          <h3 className="admin-editor-section__title">Service Capacities</h3>
                          <p className="admin-editor-section__sub">Override capacity per service for this specific day.</p>
                          <div className="admin-cap-grid">
                            {dayConfigForEdit.services.map(s => {
                              const bkMap  = getDateBookings(selectedDay)
                              const booked = Object.values(bkMap[s.id]||{}).reduce((a,b)=>a+b,0)
                              return (
                                <div key={s.id} className="admin-cap-row">
                                  <div className="admin-cap-row__info">
                                    <span className="admin-cap-row__icon">{s.icon}</span>
                                    <div>
                                      <strong className="admin-cap-row__name">{s.title}</strong>
                                      <span className="admin-cap-row__booked">{booked} already booked</span>
                                    </div>
                                  </div>
                                  <div className="admin-cap-row__ctrl">
                                    <button
                                      className="admin-cap-btn"
                                      onClick={() => setServiceCap(s.id, s.capacity - 1)}
                                      disabled={s.capacity <= 0}
                                    >−</button>
                                    <span className="admin-cap-val">{s.capacity}</span>
                                    <button
                                      className="admin-cap-btn"
                                      onClick={() => setServiceCap(s.id, s.capacity + 1)}
                                    >+</button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {!selectedDay && (
                <div className="admin-select-prompt">
                  <span className="admin-select-prompt__icon">📅</span>
                  <p>Click any date on the calendar to customize it.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ BOOKINGS ════ */}
        {view === "bookings" && (
          <div className="admin-view">
            <div className="admin-view__head">
              <h1 className="admin-view__title">All Bookings</h1>
              <p className="admin-view__sub">{bookings.length} total booking{bookings.length!==1?"s":""}</p>
            </div>

            {/* Confirm delete modal */}
            {confirmDel && (
              <div className="appt-modal-overlay" onClick={() => setConfirmDel(null)}>
                <div className="appt-modal" onClick={e => e.stopPropagation()}>
                  <div className="appt-modal__icon">⚠️</div>
                  <h3 className="appt-modal__title">Cancel Booking?</h3>
                  <p className="appt-modal__body">This will permanently remove the booking. This action cannot be undone.</p>
                  <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
                    <button className="appt-modal__btn appt-modal__btn--secondary" onClick={() => setConfirmDel(null)}>
                      Keep Booking
                    </button>
                    <button className="appt-modal__btn appt-modal__btn--danger" onClick={() => { cancelBooking(confirmDel); setConfirmDel(null) }}>
                      Yes, Cancel It
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-card">
              <div className="admin-card__head">
                <input
                  className="admin-search"
                  placeholder="Search by name, date, service, phone…"
                  value={bookFilter}
                  onChange={e => setBookFilter(e.target.value)}
                />
                <span className="admin-result-count">{filteredBookings.length} result{filteredBookings.length!==1?"s":""}</span>
              </div>

              {filteredBookings.length === 0
                ? <p className="admin-empty">{bookFilter ? "No bookings match your search." : "No bookings yet."}</p>
                : (
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Service</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...filteredBookings].reverse().map(b => {
                          const svc = BASE_SERVICES.find(s => s.id === b.serviceId)
                          const isPast = b.date < todayKey
                          return (
                            <tr key={b.id}>
                              <td>
                                <strong>{b.name}</strong>
                                <br/><small>{b.phone}</small>
                                <br/><small className="admin-email">{b.email}</small>
                              </td>
                              <td>
                                <span className="admin-svc-cell">
                                  <span>{svc?.icon}</span>
                                  <span>{svc?.title}</span>
                                </span>
                              </td>
                              <td>
                                <strong>{readableDate(b.date)}</strong>
                                <br/><span className="admin-time-badge">{b.time}</span>
                              </td>
                              <td>
                                <span className={`admin-badge admin-badge--${isPast?"past":"upcoming"}`}>
                                  {isPast ? "Past" : "Upcoming"}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="admin-cancel-btn"
                                  onClick={() => setConfirmDel(b.id)}
                                  title="Cancel this booking"
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              }
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
