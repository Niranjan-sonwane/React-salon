import { createContext, useContext, useState, useEffect, useCallback } from "react"

/* ─────────────────────────────────────────────
   DEFAULT NAIL SERVICES (admin can override capacity per day)
───────────────────────────────────────────── */
export const BASE_SERVICES = [
  { id: "gel-polish",        title: "Gel Polish",          icon: "💅", duration: "30–45 min",               defaultCapacity: 3 },
  { id: "gel-overlay",       title: "Gel Overlay",         icon: "✨", duration: "45–60 min",               defaultCapacity: 2 },
  { id: "temp-extension",    title: "Temp Extension",      icon: "💎", duration: "1 hr 30 min",             defaultCapacity: 1 },
  { id: "gel-extension",     title: "Gel Extension",       icon: "🌸", duration: "1 hr 30 min – 2 hr 30 min", defaultCapacity: 2 },
  { id: "acrylic-extension", title: "Acrylic Extension",   icon: "🎀", duration: "1 hr 30 min – 2 hr 30 min", defaultCapacity: 2 },
  { id: "refilling",         title: "Refilling",           icon: "🔄", duration: "1 hr 30 min",             defaultCapacity: 1 },
  { id: "removal",           title: "Removal",             icon: "🗑️", duration: "30 min",                  defaultCapacity: 1 },
  { id: "nail-art",          title: "Nail Art Per Tip",    icon: "🎨", duration: "10–12 min",               defaultCapacity: 4 },
]

/* ─────────────────────────────────────────────
   DEFAULT OPEN DAYS (all days open to start)
   shopConfig.openDays = Set of day indexes 0–6
   shopConfig.defaultTimeSlots = string[] "HH:MM"
   shopConfig.dayConfigs[YYYY-MM-DD] = {
     open: bool,
     timeSlots: string[],
     services: { [serviceId]: capacity }
   }
───────────────────────────────────────────── */
const DEFAULT_TIME_SLOTS = [
  "10:30","11:00","11:30","12:00","12:30","13:00",
  "13:30","14:00","14:30","15:00","15:30","16:00",
  "16:30","17:00","17:30","18:00","18:30","19:00",
  "19:30","20:00","20:30",
]

const DEFAULT_SHOP_CONFIG = {
  openDays: [0,1,2,3,4,5,6],          // all 7 days open by default
  defaultTimeSlots: DEFAULT_TIME_SLOTS,
  dayConfigs: {},                       // per-date overrides: { [YYYY-MM-DD]: DayConfig }
}

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */
const BookingContext = createContext(null)

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function BookingProvider({ children }) {
  const [shopConfig, setShopConfig] = useState(() =>
    loadFromStorage("leela_shop_config", DEFAULT_SHOP_CONFIG)
  )
  const [bookings, setBookings] = useState(() =>
    loadFromStorage("leela_bookings", [])
  )

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("leela_shop_config", JSON.stringify(shopConfig))
  }, [shopConfig])

  useEffect(() => {
    localStorage.setItem("leela_bookings", JSON.stringify(bookings))
  }, [bookings])

  /* ── Helpers ── */

  /** Returns the effective config for a given YYYY-MM-DD date key */
  const getDayConfig = useCallback((dateKey) => {
    const [y,,d] = dateKey.split("-")
    const dayOfWeek = new Date(dateKey).getDay()
    const override = shopConfig.dayConfigs[dateKey] || {}

    const isOpen = override.open !== undefined
      ? override.open
      : shopConfig.openDays.includes(dayOfWeek)

    const timeSlots = override.timeSlots ?? shopConfig.defaultTimeSlots

    const services = BASE_SERVICES.map((s) => ({
      ...s,
      capacity: override.services?.[s.id] ?? s.defaultCapacity,
    }))

    return { dateKey, isOpen, timeSlots, services }
  }, [shopConfig])

  /**
   * Returns bookings aggregated for a specific date:
   * { [serviceId]: { [time]: bookedCount } }
   */
  const getDateBookings = useCallback((dateKey) => {
    const map = {}
    bookings
      .filter((b) => b.date === dateKey)
      .forEach((b) => {
        if (!map[b.serviceId]) map[b.serviceId] = {}
        map[b.serviceId][b.time] = (map[b.serviceId][b.time] || 0) + 1
      })
    return map
  }, [bookings])

  /**
   * Returns remaining capacity for a specific service+time slot on a given date.
   * capacity = dayConfig.capacity - bookings already made for that slot
   */
  const getSlotRemaining = useCallback((dateKey, serviceId, time) => {
    const { services } = getDayConfig(dateKey)
    const svc = services.find((s) => s.id === serviceId)
    if (!svc) return 0
    const dateMap = getDateBookings(dateKey)
    const used = dateMap[serviceId]?.[time] || 0
    return Math.max(svc.capacity - used, 0)
  }, [getDayConfig, getDateBookings])

  /**
   * Attempt to add a booking.
   * Returns { ok: true } or { ok: false, reason: string }
   */
  const addBooking = useCallback((booking) => {
    // booking shape: { id, name, phone, email, message, date, serviceId, time }
    const { date, serviceId, time } = booking
    const { isOpen, services, timeSlots } = getDayConfig(date)

    if (!isOpen) {
      return { ok: false, reason: "The shop is closed on this day." }
    }
    if (!timeSlots.includes(time)) {
      return { ok: false, reason: "This time slot is not available on the selected day." }
    }
    const svc = services.find((s) => s.id === serviceId)
    if (!svc) {
      return { ok: false, reason: "Service not found." }
    }

    const remaining = getSlotRemaining(date, serviceId, time)
    if (remaining <= 0) {
      return {
        ok: false,
        reason: `No capacity left for "${svc.title}" at ${time} on this day. Please choose another slot or date.`,
        isFull: true,
      }
    }

    setBookings((prev) => [
      ...prev,
      { ...booking, id: `B-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, createdAt: new Date().toISOString() },
    ])
    return { ok: true }
  }, [getDayConfig, getSlotRemaining])

  /* ── Admin Actions ── */

  const updateShopConfig = useCallback((updater) => {
    setShopConfig((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }, [])

  const setDayConfig = useCallback((dateKey, config) => {
    setShopConfig((prev) => ({
      ...prev,
      dayConfigs: {
        ...prev.dayConfigs,
        [dateKey]: { ...(prev.dayConfigs[dateKey] || {}), ...config },
      },
    }))
  }, [])

  const resetDayConfig = useCallback((dateKey) => {
    setShopConfig((prev) => {
      const next = { ...prev, dayConfigs: { ...prev.dayConfigs } }
      delete next.dayConfigs[dateKey]
      return next
    })
  }, [])

  const cancelBooking = useCallback((bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId))
  }, [])

  return (
    <BookingContext.Provider value={{
      shopConfig,
      bookings,
      BASE_SERVICES,
      getDayConfig,
      getDateBookings,
      getSlotRemaining,
      addBooking,
      updateShopConfig,
      setDayConfig,
      resetDayConfig,
      cancelBooking,
    }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>")
  return ctx
}
