import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { fetchApi } from "../api"

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [shopConfig, setShopConfig] = useState({
    openDays: [0, 1, 2, 3, 4, 5, 6],
    defaultTimeSlots: [],
    dayConfigs: {},
  })
  const [bookings, setBookings] = useState([])
  const [baseServices, setBaseServices] = useState([])

  useEffect(() => {
    fetchApi("/services")
      .then((res) => {
        setBaseServices(Array.isArray(res) ? res : [])
      })
      .catch(console.error)
  }, [])

  const loadAdminData = useCallback(async () => {
    try {
      const configRes = await fetchApi("/admin/config")
      if (configRes) setShopConfig(configRes)

      const bookRes = await fetchApi("/admin/bookings")
      if (bookRes?.bookings) setBookings(bookRes.bookings)
    } catch (err) {
      console.error("Failed to load admin data", err)
    }
  }, [])

  const getDayConfig = useCallback(
    (dateKey) => {
      const dayOfWeek = new Date(dateKey).getDay()
      const override = shopConfig.dayConfigs?.[dateKey] || {}

      const isOpen =
        override.open !== undefined
          ? override.open
          : (shopConfig.openDays || []).includes(dayOfWeek)

      const timeSlots = override.timeSlots ?? (shopConfig.defaultTimeSlots || [])

      const services = baseServices.map((s) => ({
        ...s,
        capacity: override.services?.[s.id] ?? s.defaultCapacity,
      }))

      return { dateKey, isOpen, timeSlots, services }
    },
    [shopConfig, baseServices],
  )

  const getDateBookings = useCallback(
    (dateKey) => {
      const map = {}
      bookings
        .filter((b) => b.date === dateKey)
        .forEach((b) => {
          if (!map[b.serviceId]) map[b.serviceId] = {}
          map[b.serviceId][b.time] = (map[b.serviceId][b.time] || 0) + 1
        })
      return map
    },
    [bookings],
  )

  const getSlotRemaining = useCallback(
    (dateKey, serviceId, time) => {
      const { services } = getDayConfig(dateKey)
      const svc = services.find((s) => s.id === serviceId)
      if (!svc) return 0

      const dateMap = getDateBookings(dateKey)
      const used = dateMap[serviceId]?.[time] || 0
      return Math.max(svc.capacity - used, 0)
    },
    [getDayConfig, getDateBookings],
  )

  const updateShopConfig = useCallback(
    async (updater) => {
      const next =
        typeof updater === "function"
          ? updater(shopConfig)
          : { ...shopConfig, ...updater }

      try {
        await fetchApi("/admin/config", {
          method: "PUT",
          body: JSON.stringify({
            openDays: next.openDays,
            defaultTimeSlots: next.defaultTimeSlots,
          }),
        })
        setShopConfig(next)
      } catch (e) {
        console.error(e)
      }
    },
    [shopConfig],
  )

  const setDayConfig = useCallback(async (dateKey, config) => {
    try {
      await fetchApi(`/admin/config/day/${dateKey}`, {
        method: "PUT",
        body: JSON.stringify(config),
      })
      setShopConfig((prev) => ({
        ...prev,
        dayConfigs: {
          ...prev.dayConfigs,
          [dateKey]: { ...(prev.dayConfigs[dateKey] || {}), ...config },
        },
      }))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const resetDayConfig = useCallback(async (dateKey) => {
    try {
      await fetchApi(`/admin/config/day/${dateKey}`, { method: "DELETE" })
      setShopConfig((prev) => {
        const next = { ...prev, dayConfigs: { ...prev.dayConfigs } }
        delete next.dayConfigs[dateKey]
        return next
      })
    } catch (e) {
      console.error(e)
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      await fetchApi(`/admin/bookings/${bookingId}`, { method: "DELETE" })
      setBookings((prev) => prev.filter((b) => b.id !== bookingId))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const addBooking = useCallback(async (booking) => {
    try {
      const res = await fetchApi("/bookings", {
        method: "POST",
        body: JSON.stringify(booking),
      })
      setBookings((prev) => [...prev, res.booking || res.data || res])
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        reason: err.message,
        isFull: err.code === "SLOT_FULL" || err.code === "INVALID_SLOT",
      }
    }
  }, [])

  const getDayAvailability = useCallback(async (dateKey) => {
    try {
      return await fetchApi(`/availability?date=${dateKey}`)
    } catch (e) {
      return null
    }
  }, [])

  return (
    <BookingContext.Provider
      value={{
        shopConfig,
        bookings,
        BASE_SERVICES: baseServices,
        loadAdminData,
        getDayConfig,
        getDateBookings,
        getSlotRemaining,
        addBooking,
        updateShopConfig,
        setDayConfig,
        resetDayConfig,
        cancelBooking,
        getDayAvailability,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within <BookingProvider>")
  return ctx
}
