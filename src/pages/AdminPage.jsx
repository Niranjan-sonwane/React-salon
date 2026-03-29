import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useBooking } from "../context/BookingContext"
import { useAuth } from "../context/AuthContext"

/*  Helpers  */
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
const normalizeTime = (value) => {
  if (!value) return ""
  const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)$/)
  return match ? `${match[1]}:${match[2]}` : ""
}

const sortTimeSlots = (slots) => {
  const unique = new Set()
  slots.forEach((slot) => {
    const normalized = normalizeTime(slot)
    if (normalized) unique.add(normalized)
  })
  return Array.from(unique).sort((a, b) => a.localeCompare(b))
}

const formatSlotLabel = (time) => {
  const normalized = normalizeTime(time)
  if (!normalized) return time
  const [hourStr, minuteStr] = normalized.split(":")
  const hour24 = Number(hourStr)
  const meridiem = hour24 >= 12 ? "PM" : "AM"
  const hour12 = hour24 % 12 || 12
  return `${hour12.toString().padStart(2, "0")}:${minuteStr} ${meridiem}`
}

/*  Admin Panel Views  */
const VIEWS = ["dashboard", "calendar", "bookings", "services", "courses"]

export default function AdminPage() {
  const {
    shopConfig,
    bookings,
    BASE_SERVICES,
    getDayConfig,
    getDateBookings,
    updateShopConfig,
    setDayConfig,
    resetDayConfig,
    cancelBooking,
    loadAdminData,
    updateServiceOverride,
    course,
    updateCourse,
  } = useBooking()

  const { logout } = useAuth()
  const navigate   = useNavigate()

  useEffect(() => {
    loadAdminData()
  }, [loadAdminData])

  const today    = new Date()
  const todayKey = getDateKey(today)

  const [view,        setView]        = useState("dashboard")
  const [calDate,     setCalDate]     = useState(today)
  const [selectedDay, setSelectedDay] = useState(null)  // YYYY-MM-DD
  const [bookFilter,  setBookFilter]  = useState("")
  const [confirmDel,  setConfirmDel]  = useState(null)  // booking id
  const [newGlobalSlot, setNewGlobalSlot] = useState("")
  const [newDaySlot, setNewDaySlot] = useState("")

  // Course editing state
  const [editCourse, setEditCourse] = useState(null)
  const [isSavingCourse, setIsSavingCourse] = useState(false)

  useEffect(() => {
    if (course) setEditCourse(course)
  }, [course])

  // Local state for service editing to avoid jumping while typing
  const [editingServices, setEditingServices] = useState({})

  const calendar = buildCalendar(calDate)

  /* Dashboard stats */
  const stats = useMemo(() => {
    const today7  = new Date(today); today7.setDate(today7.getDate() + 7)
    const upcoming = bookings.filter(b => b.date >= todayKey)
    const thisWeek = bookings.filter(b => b.date >= todayKey && b.date <= getDateKey(today7))
    const revenue  = bookings.length * 500  // demo: 500 avg per booking
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
      : sortTimeSlots([...cfg.timeSlots, time])
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
        ? sortTimeSlots(prev.defaultTimeSlots.filter(t => t !== time))
        : sortTimeSlots([...prev.defaultTimeSlots, time])
    }))
  }

  const addGlobalTime = () => {
    const slot = normalizeTime(newGlobalSlot)
    if (!slot) return
    updateShopConfig((prev) => ({
      ...prev,
      defaultTimeSlots: sortTimeSlots([...prev.defaultTimeSlots, slot]),
    }))
    setNewGlobalSlot("")
  }

  const removeGlobalTime = (time) => {
    updateShopConfig((prev) => ({
      ...prev,
      defaultTimeSlots: sortTimeSlots(prev.defaultTimeSlots.filter((slot) => slot !== time)),
    }))
  }

  const addDayTime = () => {
    if (!selectedDay) return
    const slot = normalizeTime(newDaySlot)
    if (!slot) return
    const cfg = getDayConfig(selectedDay)
    setDayConfig(selectedDay, { timeSlots: sortTimeSlots([...cfg.timeSlots, slot]) })
    setNewDaySlot("")
  }

  const handleUpdateService = (s) => {
    const patch = editingServices[s.id] || { 
      defaultCapacity: s.defaultCapacity, 
      duration: s.duration,
      durationMinutes: s.durationMinutes || 60
    }
    updateServiceOverride(s.id, patch)
    // Clear local edit state for this service
    const next = { ...editingServices }
    delete next[s.id]
    setEditingServices(next)
  }

  const daySlotPool = useMemo(() => {
    if (!dayConfigForEdit) return sortTimeSlots(shopConfig.defaultTimeSlots)
    return sortTimeSlots([...shopConfig.defaultTimeSlots, ...dayConfigForEdit.timeSlots])
  }, [shopConfig.defaultTimeSlots, dayConfigForEdit])

  return (
    <div className="admin-shell">
      {/*  Sidebar  */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__logo"></span>
          <div>
            <p className="admin-sidebar__name">Honey Nails & Academy</p>
            <p className="admin-sidebar__role">Admin Panel</p>
          </div>
        </div>

        <nav className="admin-sidebar__nav">
          {[
            { id:"dashboard", label:"Dashboard",  icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
            { id:"calendar",  label:"Manage Days", icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
            { id:"bookings",  label:"Bookings",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
            { id:"services",  label:"Services",    icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> },
            { id:"courses",   label:"Academy",     icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> },
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

      {/*  Main  */}
      <main className="admin-main">

        {/*  DASHBOARD  */}
        {view === "dashboard" && (
          <div className="admin-view">
            <div className="admin-view__head">
              <h1 className="admin-view__title">Dashboard</h1>
              <p className="admin-view__sub">Welcome back! Here's your salon at a glance.</p>
            </div>

            {/* Stats */}
            <div className="admin-stats-grid">
              {[
                { label:"Total Bookings",   value:stats.total,         icon:"", color:"blue"   },
                { label:"Upcoming",         value:stats.upcoming,      icon:"", color:"purple" },
                { label:"This Week",        value:stats.thisWeek,      icon:"", color:"amber"  },
                { label:"Active Services",  value:BASE_SERVICES.length, icon:"", color:"green" },
              ].map(s => (
                <div key={s.label} className={`admin-stat-card admin-stat-card--${s.color}`}>
                  <span className="admin-stat-card__icon">{s.icon}</span>
                  <strong className="admin-stat-card__value">{s.value}</strong>
                  <span className="admin-stat-card__label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Course Overview Section (Dynamic) */}
            <div className="admin-card admin-course-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">📌 Course Overview</h2>
                <div style={{display:"flex",gap:"8px"}}>
                  <span className="admin-badge admin-badge--upcoming">Live</span>
                  <button className="admin-view-all-btn" onClick={() => setView("courses")}>Edit Course </button>
                </div>
              </div>
              {course ? (
                <div className="admin-course-details">
                  <div className="admin-course-row">
                    <strong>Title:</strong> <span>{course.title}</span>
                  </div>
                  <div className="admin-course-row">
                    <strong>Instructor:</strong> <span>{course.instructor}</span>
                  </div>
                  <div className="admin-course-row">
                    <strong>Duration:</strong> <span>{course.duration}</span>
                  </div>
                  
                  <div className="admin-course-section">
                    <h3>📚 Syllabus Highlights</h3>
                    <p className="admin-card__sub">{course.syllabus.slice(0, 3).join(", ")} and {course.syllabus.length - 3} more...</p>
                  </div>

                  <div className="admin-course-section">
                    <h3>💰 Pricing Tiers</h3>
                    <div className="admin-pricing-grid">
                      <div className="admin-pricing-item">
                        <strong>With Kit:</strong> <span>{course.pricing.withKit}</span>
                      </div>
                      <div className="admin-pricing-item">
                        <strong>No Kit:</strong> <span>{course.pricing.withoutKit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="admin-empty">No course data found.</p>
              )}
            </div>

            {/* Daily Occupancy Summary */}
            <div className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Daily Occupancy</h2>
                <p className="admin-card__sub">Filled vs. Empty slots per service for today ({readableDate(todayKey)})</p>
              </div>
              <div className="admin-occupancy-list">
                {BASE_SERVICES.map(s => {
                  const dayCfg = getDayConfig(todayKey);
                  const svcCfg = dayCfg.services.find(a => a.id === s.id);
                  const dateMap = getDateBookings(todayKey);
                  
                  // Calculate total booked across all time slots for this service
                  const booked = Object.values(dateMap[s.id] || {}).reduce((a, b) => a + b, 0);
                  const total = svcCfg?.capacity || 0;
                  const pct = total > 0 ? (booked / total) * 100 : 0;
                  
                  return (
                    <div key={s.id} className="admin-occupancy-row">
                      <div className="admin-occupancy-info">
                        <span className="admin-occupancy-icon">{s.icon}</span>
                        <div className="admin-occupancy-text">
                          <strong>{s.title}</strong>
                          <span>{booked} filled / {Math.max(0, total - booked)} empty</span>
                        </div>
                      </div>
                      <div className="admin-occupancy-bar-wrap">
                        <div className="admin-occupancy-bar-track">
                          <div className="admin-occupancy-bar-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="admin-occupancy-pct">{Math.round(pct)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                <p className="admin-card__sub">Create slots dynamically. These apply to all dates unless overridden per day.</p>
              </div>

              <div className="admin-time-builder">
                <input
                  type="time"
                  className="admin-time-input"
                  value={newGlobalSlot}
                  onChange={(e) => setNewGlobalSlot(e.target.value)}
                />
                <button type="button" className="admin-time-add" onClick={addGlobalTime}>Add Slot</button>
              </div>

              <div className="admin-time-toggles">
                {sortTimeSlots(shopConfig.defaultTimeSlots).map((t) => (
                  <div key={t} className="admin-time-chip">
                    <button
                      type="button"
                      className={`admin-time-toggle${shopConfig.defaultTimeSlots.includes(t)?" is-on":""}`}
                      onClick={() => toggleGlobalTime(t)}
                    >
                      {formatSlotLabel(t)}
                    </button>
                    <button
                      type="button"
                      className="admin-time-remove"
                      onClick={() => removeGlobalTime(t)}
                      aria-label={`Remove ${formatSlotLabel(t)}`}
                      title="Remove slot"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Recent Bookings</h2>
                <button className="admin-view-all-btn" onClick={() => setView("bookings")}>View All </button>
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
                            <td>{formatSlotLabel(b.time)}</td>
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

        {/*  CALENDAR / MANAGE DAYS  */}
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
                        ? <><span></span> Shop is Open</>
                        : <><span></span> Shop is Closed</>
                      }
                    </div>

                    {dayConfigForEdit.isOpen && (
                      <>
                        {/* Time Slots Override */}
                        <div className="admin-editor-section">
                          <h3 className="admin-editor-section__title">Time Slots for This Day</h3>
                          <p className="admin-editor-section__sub">Add or toggle slots for this specific date.</p>

                          <div className="admin-time-builder">
                            <input
                              type="time"
                              className="admin-time-input"
                              value={newDaySlot}
                              onChange={(e) => setNewDaySlot(e.target.value)}
                            />
                            <button type="button" className="admin-time-add" onClick={addDayTime}>Add Slot</button>
                          </div>

                          <div className="admin-time-toggles">
                            {daySlotPool.map(t => (
                              <button
                                key={t}
                                type="button"
                                className={`admin-time-toggle${dayConfigForEdit.timeSlots.includes(t)?" is-on":""}`}
                                onClick={() => toggleTime(t)}
                              >
                                {formatSlotLabel(t)}
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
                                    >-</button>
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
                  <span className="admin-select-prompt__icon"></span>
                  <p>Click any date on the calendar to customize it.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/*  SERVICES MANAGEMENT  */}
        {view === "services" && (
          <div className="admin-view">
            <div className="admin-view__head">
              <h1 className="admin-view__title">Manage Services</h1>
              <p className="admin-view__sub">Set default slot counts and duration labels for each procedure.</p>
            </div>

            <div className="admin-services-grid">
              {BASE_SERVICES.map(s => {
                const draft = editingServices[s.id] || {}
                const currentCap = draft.defaultCapacity ?? s.defaultCapacity
                const currentDur = draft.duration ?? s.duration
                const currentMins = draft.durationMinutes ?? s.durationMinutes
                const hasChanges = draft.defaultCapacity !== undefined || draft.duration !== undefined || draft.durationMinutes !== undefined

                return (
                  <div className="admin-card admin-service-card" key={s.id}>
                    <div className="admin-service-card__head">
                      <span className="admin-service-card__icon">{s.icon}</span>
                      <h3 className="admin-service-card__title">{s.title}</h3>
                    </div>

                    <div className="admin-editor-section">
                      <label className="admin-field-label">Default Slots (Capacity)</label>
                      <div className="admin-cap-row__ctrl">
                        <button
                          className="admin-cap-btn"
                          onClick={() => setEditingServices(prev => ({
                            ...prev,
                            [s.id]: { ...(prev[s.id]||{duration:s.duration}), defaultCapacity: Math.max(1, currentCap - 1) }
                          }))}
                        >-</button>
                        <span className="admin-cap-val">{currentCap}</span>
                        <button
                          className="admin-cap-btn"
                          onClick={() => setEditingServices(prev => ({
                            ...prev,
                            [s.id]: { ...(prev[s.id]||{duration:s.duration}), defaultCapacity: currentCap + 1 }
                          }))}
                        >+</button>
                      </div>
                    </div>

                    <div className="admin-field">
                      <label className="admin-field-label">Duration Label (e.g. 1.5 Hours)</label>
                      <input
                        className="admin-time-input"
                        style={{ width: "100%", padding: "10px" }}
                        value={currentDur}
                        onChange={(e) => setEditingServices(prev => ({
                          ...prev,
                          [s.id]: { ...(prev[s.id]||{defaultCapacity:s.defaultCapacity, durationMinutes:s.durationMinutes}), duration: e.target.value }
                        }))}
                      />
                    </div>

                    <div className="admin-editor-section">
                      <label className="admin-field-label">Duration (Minutes) - for range calculation</label>
                      <input
                        type="number"
                        className="admin-time-input"
                        style={{ width: "100%", padding: "10px" }}
                        value={currentMins}
                        onChange={(e) => setEditingServices(prev => ({
                          ...prev,
                          [s.id]: { ...(prev[s.id]||{defaultCapacity:s.defaultCapacity, duration:s.duration}), durationMinutes: parseInt(e.target.value, 10) || 0 }
                        }))}
                      />
                    </div>

                    <button
                      className="admin-time-add"
                      style={{ width: "100%", marginTop: "12px", background: hasChanges ? "var(--accent)" : "#ccc", color: hasChanges ? "var(--ink)" : "#666" }}
                      onClick={() => handleUpdateService(s)}
                      disabled={!hasChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/*  BOOKINGS  */}
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
                  <div className="appt-modal__icon"></div>
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
                  placeholder="Search by name, date, service, phone"
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
                                <br/><span className="admin-time-badge">{formatSlotLabel(b.time)}</span>
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
        {/*  ACADEMY COURSES  */}
        {view === "courses" && editCourse && (
          <div className="admin-view">
            <div className="admin-view__head">
              <h1 className="admin-view__title">Academy Management</h1>
              <p className="admin-view__sub">Update your training curriculum, pricing, and timing.</p>
            </div>

            <div className="admin-card">
              <div className="admin-card__head">
                <h2 className="admin-card__title">Course Details</h2>
                <button 
                  className="admin-time-add" 
                  disabled={isSavingCourse}
                  onClick={async () => {
                    setIsSavingCourse(true)
                    try {
                      await updateCourse(editCourse)
                      alert("Course updated successfully!")
                    } catch (e) {
                      alert("Failed to update course")
                    } finally {
                      setIsSavingCourse(false)
                    }
                  }}
                >
                  {isSavingCourse ? "Saving..." : "Save All Changes"}
                </button>
              </div>

              <div className="admin-course-form">
                <div className="admin-form-row">
                  <div className="admin-field">
                    <label>Course Title</label>
                    <input 
                      value={editCourse.title} 
                      onChange={e => setEditCourse({...editCourse, title: e.target.value})}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Instructor Name</label>
                    <input 
                      value={editCourse.instructor} 
                      onChange={e => setEditCourse({...editCourse, instructor: e.target.value})}
                    />
                  </div>
                </div>

                <div className="admin-field">
                  <label>Description</label>
                  <textarea 
                    rows={3}
                    value={editCourse.description} 
                    onChange={e => setEditCourse({...editCourse, description: e.target.value})}
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-field">
                    <label>Duration (e.g. 4 Weeks)</label>
                    <input 
                      value={editCourse.duration} 
                      onChange={e => setEditCourse({...editCourse, duration: e.target.value})}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Timing (e.g. Daily 2 Hours)</label>
                    <input 
                      value={editCourse.timing} 
                      onChange={e => setEditCourse({...editCourse, timing: e.target.value})}
                    />
                  </div>
                </div>

                <div className="admin-editor-section">
                  <h3 className="admin-editor-section__title">Syllabus</h3>
                  <div className="admin-syllabus-edit-list">
                    {editCourse.syllabus.map((item, idx) => (
                      <div key={idx} className="admin-syllabus-edit-item">
                        <input 
                          value={item} 
                          onChange={e => {
                            const next = [...editCourse.syllabus]
                            next[idx] = e.target.value
                            setEditCourse({...editCourse, syllabus: next})
                          }}
                        />
                        <button onClick={() => {
                          const next = editCourse.syllabus.filter((_, i) => i !== idx)
                          setEditCourse({...editCourse, syllabus: next})
                        }}>×</button>
                      </div>
                    ))}
                    <button 
                      className="admin-add-item-btn"
                      onClick={() => setEditCourse({...editCourse, syllabus: [...editCourse.syllabus, ""]})}
                    >
                      + Add Syllabus Item
                    </button>
                  </div>
                </div>

                <div className="admin-editor-section">
                  <h3 className="admin-editor-section__title">Pricing</h3>
                  <div className="admin-form-row">
                    <div className="admin-field">
                      <label>With Kit Pricing</label>
                      <input 
                        value={editCourse.pricing.withKit} 
                        onChange={e => setEditCourse({
                          ...editCourse, 
                          pricing: {...editCourse.pricing, withKit: e.target.value}
                        })}
                      />
                    </div>
                    <div className="admin-field">
                      <label>Without Kit Pricing</label>
                      <input 
                        value={editCourse.pricing.withoutKit} 
                        onChange={e => setEditCourse({
                          ...editCourse, 
                          pricing: {...editCourse.pricing, withoutKit: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-field">
                  <label>Additional Info</label>
                  <input 
                    value={editCourse.additional} 
                    onChange={e => setEditCourse({...editCourse, additional: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}


