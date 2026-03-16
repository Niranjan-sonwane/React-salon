import { useState } from "react"
import { services } from "../data/services"

/* ---------- CONSTANT DATA ---------- */

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const NAIL_SERVICES = [
  { title: "Gel Polish", duration: "30–45 min", capacity: 3 },
  { title: "Gel Overlay", duration: "45–60 min", capacity: 2 },
  { title: "Temporary Extension", duration: "1 hr 30 min", capacity: 1 },
  { title: "Gel Extension", duration: "1 hr 30 min – 2 hr 30 min", capacity: 2 },
  { title: "Acrylic Extension", duration: "1 hr 30 min – 2 hr 30 min", capacity: 2 },
  { title: "Refilling", duration: "1 hr 30 min", capacity: 1 },
  { title: "Removal", duration: "30 min", capacity: 1 },
  { title: "Nail Art Per Tip", duration: "10–12 min", capacity: 4 }
]

const TOTAL_CAPACITY = NAIL_SERVICES.reduce((a, b) => a + b.capacity, 0)

/* ---------- HELPER FUNCTIONS ---------- */

const pad = (v) => String(v).padStart(2, "0")

const getDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const readableDate = (key) => {
  const [y, m, d] = key.split("-")
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}

const getLeadMessage = (key) => {
  const [y, m, d] = key.split("-")
  const day = new Date(y, m - 1, d).getDay()
  return day === 0 || day === 6
    ? "Weekend booking requires at least 1 day advance."
    : "Weekday booking allowed 30–60 minutes prior."
}

const getBookings = (key) => {
  const [y, m, d] = key.split("-")
  const date = new Date(y, m - 1, d)

  const bookings = NAIL_SERVICES.map((s, i) => {
    const spread = (date.getDate() + date.getDay() + i * 2) % (s.capacity + 2)
    return { ...s, booked: Math.min(s.capacity, spread) }
  }).filter((s) => s.booked > 0)

  const totalBooked = bookings.reduce((a, b) => a + b.booked, 0)

  return {
    bookings,
    totalBooked,
    available: Math.max(TOTAL_CAPACITY - totalBooked, 0)
  }
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

/* ---------- MAIN COMPONENT ---------- */

export default function AppointmentPage() {
  const today = new Date()
  const todayKey = getDateKey(today)

  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [submitState, setSubmitState] = useState({ type: "idle", message: "" })
  const [confirmedBookings, setConfirmedBookings] = useState([])

  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "Nails",
    date: todayKey,
    time: "",
    email: "",
    message: ""
  })

  const calendar = buildCalendar(today)
  const extraBookingsByDate = confirmedBookings.reduce((acc, booking) => {
    acc[booking.date] = (acc[booking.date] || 0) + 1
    return acc
  }, {})

  const schedule = (() => {
    const base = getBookings(selectedDate)
    const extra = extraBookingsByDate[selectedDate] || 0

    return {
      ...base,
      totalBooked: base.totalBooked + extra,
      available: Math.max(TOTAL_CAPACITY - (base.totalBooked + extra), 0)
    }
  })()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "date") setSelectedDate(value)
    setForm((p) => ({ ...p, [name]: value }))
  }

  const handleDateClick = (key) => {
    setSelectedDate(key)
    setSubmitState({ type: "idle", message: "" })
    setForm((p) => ({ ...p, date: key }))
  }

  const submitForm = (e) => {
    e.preventDefault()

    const bookingPayload = {
      date: form.date,
      time: form.time,
      service: form.service.trim().toLowerCase()
    }

    const isSlotTaken = confirmedBookings.some(
      (booking) =>
        booking.date === bookingPayload.date &&
        booking.time === bookingPayload.time &&
        booking.service === bookingPayload.service
    )

    if (isSlotTaken) {
      setSubmitState({
        type: "error",
        message:
          "This slot is already booked for the day. Choose a different time slot or book for another day."
      })
      return
    }

    setConfirmedBookings((prev) => [...prev, bookingPayload])
    setSubmitState({
      type: "success",
      message: `Appointment slot reserved for ${readableDate(form.date)} at ${form.time}.`
    })
  }

  return (
    <main className="page-content bg-white">

      {/* ===== Banner ===== */}
      <section
        className="dlab-bnr-inr overlay-primary"
        style={{ backgroundImage: "url(/images/banner/about.jpg)" }}
      >
        <div className="container">
          <h1 className="text-white">Book Appointment</h1>
        </div>
      </section>

      {/* ===== Content ===== */}
      <section className="content-inner-2">
        <div className="container appointment-layout">

          {/* ================= LEFT PANEL ================= */}
          <div className="appointment-main-panel">

            {/* Intro */}
            <div className="appointment-intro-card">
              <h2>Nail Appointment Planner</h2>
              <p>Select a date and request your preferred slot.</p>
              <div className="appointment-hours-pill">
                <span>Shop Time</span>
                <strong>10:30 AM – 9:00 PM</strong>
              </div>
            </div>

            {/* Service Timing */}
            <div className="appointment-service-card">
              <h3>Nail Service Duration</h3>

              {NAIL_SERVICES.map((s) => (
                <div key={s.title} className="appointment-service-row">
                  <div>
                    <strong>{s.title}</strong>
                    <span>{s.capacity} slots/day</span>
                  </div>
                  <p>{s.duration}</p>
                </div>
              ))}
            </div>

            {/* Booking Rules */}
            <div className="appointment-policy-card">
              <h3>Booking Rule</h3>
              <p>{getLeadMessage(selectedDate)}</p>
              <strong>{readableDate(selectedDate)}</strong>
            </div>

            {/* Form */}
            <div className="appointment-form-card">
              <h3>Request Appointment</h3>
              <span>{schedule.totalBooked} booked</span>

              <form onSubmit={submitForm} className="dlab-form">

                <input name="name" required placeholder="Name" onChange={handleChange} className="form-control m-b20" />
                <input name="phone" required placeholder="Mobile" onChange={handleChange} className="form-control m-b20" />

                <select name="service" className="form-control m-b20" value={form.service} onChange={handleChange}>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>{s.title}</option>
                  ))}
                </select>

                <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control m-b20" />
                <input type="time" name="time" required onChange={handleChange} className="form-control m-b20" />

                <input type="email" name="email" required placeholder="Email" onChange={handleChange} className="form-control m-b20" />

                <textarea name="message" required placeholder="Message" onChange={handleChange} className="form-control m-b20" />

                <button className="btn site-button btn-block">Submit</button>

              </form>

              {submitState.type !== "idle" && (
                <p
                  className={`appointment-submit-note ${
                    submitState.type === "error" ? "is-error" : "is-success"
                  }`}
                >
                  {submitState.message}
                </p>
              )}
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <aside className="appointment-calendar-panel">

            <div className="appointment-calendar-card">
              <h3>
                {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>

              <div className="appointment-weekdays">
                {WEEK_DAYS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              <div className="appointment-calendar-grid">
                {calendar.map((date, i) => {
                  if (!date) return <div key={i}></div>

                  const key = getDateKey(date)
                  const sum = getBookings(key)
                  const totalForDay = sum.totalBooked + (extraBookingsByDate[key] || 0)

                  return (
                    <button
                      key={key}
                      className={`appointment-day ${
                        key === selectedDate ? "is-selected" : ""
                      }`}
                      onClick={() => handleDateClick(key)}
                    >
                      <span>{date.getDate()}</span>
                      <small>{totalForDay} booked</small>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="appointment-count-card">
              <h3>Day Summary</h3>

              <div className="appointment-day-totals">
                <div>
                  <strong>{schedule.totalBooked}</strong>
                  <span>Booked</span>
                </div>
                <div>
                  <strong>{TOTAL_CAPACITY}</strong>
                  <span>Capacity</span>
                </div>
                <div>
                  <strong>{schedule.available}</strong>
                  <span>Available</span>
                </div>
              </div>

              {schedule.bookings.map((b) => (
                <div key={b.title} className="appointment-booking-row">
                  <strong>{b.title}</strong>
                  <span>
                    {b.booked}/{b.capacity}
                  </span>
                </div>
              ))}
            </div>

          </aside>
        </div>
      </section>
    </main>
  )
}