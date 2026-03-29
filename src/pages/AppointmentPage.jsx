import { useState, useEffect } from "react"
import { useBooking } from "../context/BookingContext"
import { fetchApi } from "../api"

/*  helpers  */
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
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/*  component  */
export default function AppointmentPage() {
  const today         = new Date()
  const todayKey      = getDateKey(today)
  const calendar      = buildCalendar(today)

  const {
    getDayConfig,
    addBooking,
    BASE_SERVICES,
    getDayAvailability
  } = useBooking()

  /* wizard step */
  const [step, setStep]           = useState(1)

  /* selections */
  const [dateKey, setDateKey]     = useState(todayKey)
  const [serviceId, setServiceId] = useState("")
  const [timeSlot, setTimeSlot]   = useState("")

  /* form fields */
  const [form, setForm] = useState({ name:"", phone:"", email:"", message:"" })

  /* modal / result states */
  const [fullAlert, setFullAlert]   = useState(null)   // { message }
  const [submitMsg, setSubmitMsg]   = useState(null)   // { ok, text }
  const [isLoadingAvail, setIsLoadingAvail] = useState(false)

  /* Fetched API states */
  const [dayAvail, setDayAvail] = useState(null)
  const [slotAvail, setSlotAvail] = useState([])

  useEffect(() => {
    setIsLoadingAvail(true)
    getDayAvailability(dateKey)
      .then(res => {
        setDayAvail(res)
        setIsLoadingAvail(false)
      })
      .catch(() => setIsLoadingAvail(false))
  }, [dateKey, getDayAvailability])

  useEffect(() => {
    if (serviceId && dateKey) {
      fetchApi(`/slots?date=${dateKey}&serviceId=${serviceId}`)
        .then(res => setSlotAvail(res?.slots || []))
        .catch(console.error)
    }
  }, [serviceId, dateKey])

  /* total booked count for the selected date */
  const totalBooked = dayAvail ? dayAvail.services.reduce((a, s) => a + s.totalBooked, 0) : 0
  const totalCap = dayAvail ? dayAvail.services.reduce((a, s) => a + s.capacity, 0) : 0

  /*  step 1 helpers  */
  const handleDateClick = (key) => {
    const cfg = getDayConfig(key)
    if (!cfg.isOpen) return          // don't allow clicking closed days
    setDateKey(key)
    setServiceId("")
    setTimeSlot("")
    setSubmitMsg(null)
  }

  /*  step 3 submit  */
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!timeSlot) return

    const result = await addBooking({
      name: form.name,
      phone: form.phone,
      email: form.email,
      message: form.message,
      date: dateKey,
      serviceId,
      time: timeSlot,
    })

    if (result.ok) {
      setSubmitMsg({ ok: true, text: `Confirmed! ${BASE_SERVICES.find(s=>s.id===serviceId)?.title} on ${readableDate(dateKey)} at ${timeSlot}. See you soon! ` })
      setStep(1)
      setServiceId("")
      setTimeSlot("")
      setForm({ name:"", phone:"", email:"", message:"" })
      // Refresh availability
      getDayAvailability(dateKey).then(res => setDayAvail(res))
    } else {
      if (result.isFull) {
        setFullAlert({ message: result.reason })
      } else {
        setSubmitMsg({ ok: false, text: result.reason })
      }
    }
  }

  return (
    <main className="appt-page">
      {/*  Full-Capacity Alert Modal  */}
      {fullAlert && (
        <div className="appt-modal-overlay" onClick={() => setFullAlert(null)}>
          <div className="appt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appt-modal__icon"></div>
            <h3 className="appt-modal__title">Slot Fully Booked</h3>
            <p className="appt-modal__body">{fullAlert.message}</p>
            <button className="appt-modal__btn" onClick={() => setFullAlert(null)}>
              Choose Another Slot
            </button>
          </div>
        </div>
      )}

      {/*  Hero Banner  */}
      <section className="appt-hero" style={{ backgroundImage: "url('/images/nails images/1.jpeg')" }}>
        <div className="appt-hero__overlay" />
        <div className="appt-hero__content">
          <span className="appt-hero__eyebrow">Honey Nails &amp; Academy</span>
          <h1 className="appt-hero__title">Book an Appointment</h1>
          <p className="appt-hero__sub">Secure your slot with ease. Walk-ins welcome, reservations preferred.</p>
          <div className="appt-hero__badges">
            <span className="appt-hero__badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              10:30 AM  9:00 PM
            </span>
            <span className="appt-hero__badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Walk-ins Welcome
            </span>
            <span className="appt-hero__badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Easy Booking
            </span>
          </div>
        </div>
      </section>

      {/*  Body  */}
      <section className="appt-body">
        <div className="appt-container">
          {submitMsg?.ok && (
            <div className="appt-success-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p>{submitMsg.text}</p>
              <button onClick={() => setSubmitMsg(null)}></button>
            </div>
          )}

          <div className="appt-grid">
            {/*  LEFT PANEL  */}
            <div className="appt-left">

              {/* Step Nav */}
              <div className="appt-steps">
                {[
                  { n:1, label:"Pick a Date" },
                  { n:2, label:"Choose Service" },
                  { n:3, label:"Time & Details" },
                ].map(({ n, label }) => (
                  <button
                    key={n}
                    type="button"
                    className={`appt-step-btn${step === n ? " is-active" : ""}${step > n ? " is-done" : ""}`}
                    onClick={() => step > n && setStep(n)}
                  >
                    <span className="appt-step-num">
                      {step > n
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : n}
                    </span>
                    <span className="appt-step-label">{label}</span>
                  </button>
                ))}
              </div>

              {/*  STEP 1  Pick a Date  */}
              {step === 1 && (
                <div className="appt-step-content">
                  <div className="appt-card">
                    <div className="appt-card__head">
                      <div>
                        <p className="appt-card__eyebrow">Step 1 of 3</p>
                        <h2 className="appt-card__title">Select a Date</h2>
                      </div>
                      <div className="appt-month-badge">
                        {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </div>
                    </div>

                    <div className="appt-weekdays">
                      {WEEK_DAYS.map((d) => <span key={d}>{d}</span>)}
                    </div>

                    <div className="appt-cal-grid">
                      {calendar.map((date, i) => {
                        if (!date) return <div key={i} className="appt-cal-empty" />
                        const key = getDateKey(date)
                        const cfg = getDayConfig(key)
                        // Removed the bkMap dot logic as we don't fetch full month data
                        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                        const isClosed = !cfg.isOpen
                        const isSel = key === dateKey
                        const isToday = key === todayKey

                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={isPast || isClosed}
                            className={`appt-day${isSel?" is-selected":""}${isToday?" is-today":""}${isPast?" is-past":""}${isClosed?" is-closed":""}`}
                            onClick={() => handleDateClick(key)}
                            title={isClosed ? "Shop closed this day" : undefined}
                          >
                            <span className="appt-day__num">{date.getDate()}</span>
                            {isClosed
                              ? <span className="appt-day__closed">Closed</span>
                              : <span className="appt-day__count">Open</span>
                            }
                          </button>
                        )
                      })}
                    </div>

                    <div className="appt-cal-legend">
                      <span><i className="appt-dot appt-dot--low" /> Open</span>
                      <span><i className="appt-dot appt-dot--closed" /> Closed</span>
                    </div>

                    <button
                      className="appt-next-btn"
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={isLoadingAvail || !dayAvail || !dayAvail.isOpen}
                    >
                      {isLoadingAvail ? "Loading..." : "Continue"}  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </div>

                  {/* Day Summary Card */}
                  <div className="appt-card">
                    <p className="appt-card__eyebrow">Selected Day</p>
                    <h2 className="appt-card__title" style={{marginBottom:"12px"}}>Day Overview</h2>
                    <p className="appt-day-label">{readableDate(dateKey)}</p>
                    <div className="appt-stats-row">
                      <div className="appt-stat appt-stat--booked"><strong>{totalBooked}</strong><span>Booked</span></div>
                      <div className="appt-stat appt-stat--cap"><strong>{totalCap}</strong><span>Capacity</span></div>
                      <div className="appt-stat appt-stat--avail"><strong>{Math.max(totalCap-totalBooked,0)}</strong><span>Available</span></div>
                    </div>
                    <div className="appt-avail-bar-wrap">
                      <div className="appt-avail-bar-track">
                        <div className="appt-avail-bar-fill" style={{ width:`${totalCap>0?Math.round(((totalCap-totalBooked)/totalCap)*100):100}%` }} />
                      </div>
                      <span className="appt-avail-pct">
                        {totalCap>0?Math.round(((totalCap-totalBooked)/totalCap)*100):100}% open
                      </span>
                    </div>
                    <div className="appt-booking-rows">
                      {!dayAvail || dayAvail.services.filter(s => s.totalBooked > 0).length === 0
                        ? <p className="appt-empty-note">No bookings yet for this day. </p>
                        : dayAvail.services.filter(s => s.totalBooked > 0).map(s => (
                            <div key={s.id} className="appt-brow">
                              <div className="appt-brow__left">
                                <span className="appt-brow__icon">{s.icon}</span>
                                <strong className="appt-brow__name">{s.title}</strong>
                              </div>
                              <div className="appt-brow__right">
                                <div className="appt-brow__dots">
                                  {Array.from({length:Math.max(s.capacity, 1)}).map((_,idx)=>(
                                    <span key={idx} className={`appt-brow__dot${idx<s.totalBooked?" is-filled":""}`} />
                                  ))}
                                </div>
                                <span className="appt-brow__frac">{s.totalBooked}/{s.capacity}</span>
                              </div>
                            </div>
                          ))
                      }
                    </div>
                  </div>
                </div>
              )}

              {/*  STEP 2  Choose Service  */}
              {step === 2 && (
                <div className="appt-step-content">
                  <div className="appt-card">
                    <div className="appt-card__head">
                      <div>
                        <p className="appt-card__eyebrow">Step 2 of 3  {readableDate(dateKey)}</p>
                        <h2 className="appt-card__title">Choose a Service</h2>
                      </div>
                      <div className="appt-hours-pill">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        10:30 AM  9:00 PM
                      </div>
                    </div>

                    {!dayAvail ? (
                      <p className="appt-empty-note">Loading capacity information...</p>
                    ) : (
                      <div className="appt-service-grid">
                        {dayAvail.services.map((s) => {
                          const isFull = s.remaining <= 0
                          const isSel = serviceId === s.id
                          return (
                            <div
                              key={s.id}
                              role="button"
                              tabIndex={isFull ? -1 : 0}
                              className={`appt-serv-card${isSel?" is-selected":""}${isFull?" is-full":""}`}
                              onClick={() => !isFull && setServiceId(s.id)}
                              onKeyDown={(e) => e.key==="Enter" && !isFull && setServiceId(s.id)}
                            >
                              <span className="appt-serv-card__icon">{s.icon}</span>
                              <strong className="appt-serv-card__name">{s.title}</strong>
                              <p className="appt-serv-card__dur">{s.duration}</p>
                              <span className={`appt-serv-card__cap${isFull?" is-full":""}`}>
                                {isFull ? "Day Full" : `${s.remaining} left`}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    <div className="appt-nav-row">
                      <button className="appt-back-btn" type="button" onClick={() => setStep(1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                        Back
                      </button>
                      <button
                        className="appt-next-btn"
                        type="button"
                        disabled={!serviceId}
                        onClick={() => serviceId && setStep(3)}
                      >
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/*  STEP 3  Time & Details  */}
              {step === 3 && (
                <div className="appt-step-content">
                  <div className="appt-card">
                    <div className="appt-card__head">
                      <div>
                        <p className="appt-card__eyebrow">Step 3 of 3  {BASE_SERVICES.find(s=>s.id===serviceId)?.title}</p>
                        <h2 className="appt-card__title">Pick a Time & Confirm</h2>
                      </div>
                      <div className="appt-booking-summary-pill">{readableDate(dateKey)}</div>
                    </div>

                    {/* Time Slots */}
                    <div className="appt-time-section">
                      <p className="appt-section-label">Available Time Slots</p>
                      {!dayAvail || dayAvail.timeSlots.length === 0
                        ? <p className="appt-empty-note">No time slots configured by admin for this day.</p>
                        : (
                          <div className="appt-time-grid">
                            {dayAvail.timeSlots.map((slot) => {
                              const slotData = slotAvail.find(sa => sa.time === slot)
                              const remaining = slotData ? slotData.remaining : 0
                              const isTaken = remaining <= 0
                              const isSel = timeSlot === slot
                              const endTime = slotData?.endTime || slot
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isTaken}
                                  title={isTaken ? "This slot is fully booked" : `${remaining} spot${remaining!==1?"s":""} left`}
                                  className={`appt-time-slot${isSel?" is-selected":""}${isTaken?" is-taken":""}`}
                                  onClick={() => !isTaken && setTimeSlot(slot)}
                                >
                                  <div className="appt-time-slot__range">
                                    <span>{formatSlotLabel(slot)}</span>
                                    <span className="appt-time-slot__sep">-</span>
                                    <span>{formatSlotLabel(endTime)}</span>
                                  </div>
                                  {isTaken ? (
                                    <span className="appt-time-slot__booked-label">Booked</span>
                                  ) : (
                                    <span className="appt-time-slot__rem">{remaining} slot{remaining!==1?"s":""}</span>
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        )
                      }
                    </div>

                    {/* Customer Form */}
                    <form onSubmit={handleSubmit} className="appt-form">
                      <p className="appt-section-label" style={{marginTop:"8px"}}>Your Details</p>

                      <div className="appt-form__row">
                        <div className="appt-form__group">
                          <label className="appt-form__label">Full Name *</label>
                          <input
                            required
                            placeholder="Your name"
                            value={form.name}
                            onChange={e => setForm(p=>({...p, name:e.target.value}))}
                            className="appt-form__input"
                          />
                        </div>
                        <div className="appt-form__group">
                          <label className="appt-form__label">Phone *</label>
                          <input
                            required
                            placeholder="Your phone number"
                            value={form.phone}
                            onChange={e => setForm(p=>({...p, phone:e.target.value}))}
                            className="appt-form__input"
                          />
                        </div>
                      </div>

                      <div className="appt-form__group appt-form__group--full">
                        <label className="appt-form__label">Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={e => setForm(p=>({...p, email:e.target.value}))}
                          className="appt-form__input"
                        />
                      </div>

                      <div className="appt-form__group appt-form__group--full">
                        <label className="appt-form__label">Message / Special Requests</label>
                        <textarea
                          placeholder="Any preferences or notes?"
                          value={form.message}
                          onChange={e => setForm(p=>({...p, message:e.target.value}))}
                          className="appt-form__input appt-form__textarea"
                        />
                      </div>

                      {!submitMsg?.ok && submitMsg && (
                        <div className="appt-submit-note appt-submit-note--error">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <p>{submitMsg.text}</p>
                        </div>
                      )}

                      <div className="appt-nav-row">
                        <button className="appt-back-btn" type="button" onClick={() => setStep(2)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                          Back
                        </button>
                        <button
                          className="appt-submit-btn"
                          type="submit"
                          disabled={!timeSlot}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          Confirm Booking
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/*  RIGHT PANEL  */}
            <aside className="appt-right">
              {/* Info Card */}
              <div className="appt-card appt-info-card">
                <span className="appt-info-header-tag">Nail Specialists</span>
                <h3 className="appt-info-title">Honey Nails &amp; Academy</h3>
                <p className="appt-info-sub">Premium beauty services crafted with care and expertise.</p>
                <div className="appt-info-hours">
                  <div className="appt-info-hour-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Mon  Fri: 10:30 AM  9:00 PM</span>
                  </div>
                  <div className="appt-info-hour-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span>Sat  Sun: 10:30 AM  8:00 PM</span>
                  </div>
                </div>
                <div className="appt-info-tags">
                  {["Walk-ins Welcome","Premium Products","Certified Artists","Hygienic"].map(t=>(
                    <span key={t} className="appt-info-tag">{t}</span>
                  ))}
                </div>
              </div>

              {/* Services Ref */}
              <div className="appt-card">
                <p className="appt-card__eyebrow">Quick Reference</p>
                <h3 className="appt-card__title" style={{marginBottom:"14px"}}>Services & Duration</h3>
                <div className="appt-ref-list">
                  {(dayAvail ? dayAvail.services : BASE_SERVICES).map((s) => (
                    <div key={s.id} className="appt-ref-row">
                      <div className="appt-ref-row__left">
                        <span className="appt-ref-row__icon">{s.icon}</span>
                        <div>
                          <strong className="appt-ref-row__name">{s.title}</strong>
                          <span className="appt-ref-row__cap">{s.capacity || s.defaultCapacity} slot{(s.capacity || s.defaultCapacity)!==1?"s":""}/day</span>
                        </div>
                      </div>
                      <span className="appt-ref-row__dur">{s.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Card */}
              <div className="appt-card">
                <p className="appt-card__eyebrow">Booking Policy</p>
                <h3 className="appt-card__title">Good to Know</h3>
                <ul className="appt-policy-list">
                  {[
                    "Multiple customers can share a slot up to service capacity.",
                    "Weekend bookings need 1 day advance notice.",
                    "Weekday slots open 3060 min before.",
                    "All artists are certified & trained.",
                    "Tools sterilized before every session.",
                    "Late arrivals may shorten your session.",
                  ].map(rule => (
                    <li key={rule}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

