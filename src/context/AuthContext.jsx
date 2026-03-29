import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { fetchApi } from "../api"

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || email.trim() === "") return "Email is required."
  if (!re.test(email.trim())) return "Please enter a valid email address."
  return null
}

export function validatePassword(password) {
  if (!password || password.trim() === "") return "Password is required."
  if (password.length < 8) return "Password must be at least 8 characters."
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter."
  if (!/[0-9]/.test(password)) return "Password must contain at least one number."
  if (!/[@$!%*?&#^]/.test(password)) return "Password must contain at least one special character (@$!%*?&#^)."
  return null
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("leela_admin_token")
  })

  useEffect(() => {
    if (!isAuthenticated) return

    fetchApi("/auth/session").catch(() => {
      localStorage.removeItem("leela_admin_token")
      sessionStorage.removeItem("dazzler_admin_auth")
      setIsAuthenticated(false)
    })
  }, [isAuthenticated])

  const login = useCallback(async (email, password) => {
    const emailErr = validateEmail(email)
    if (emailErr) return { ok: false, error: emailErr, field: "email" }

    const passErr = validatePassword(password)
    if (passErr) return { ok: false, error: passErr, field: "password" }

    try {
      const response = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      const token = response?.token || response?.data?.token
      if (!token) {
        return { ok: false, error: "Invalid email or password.", field: "general" }
      }

      localStorage.setItem("leela_admin_token", token)
      sessionStorage.setItem("dazzler_admin_auth", "true")
      setIsAuthenticated(true)
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err.message || "Failed to login. Please check connection.",
        field: err.field || "general",
      }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await fetchApi("/auth/logout", { method: "POST" })
      }
    } catch (err) {
      console.warn("Logout request failed", err)
    } finally {
      localStorage.removeItem("leela_admin_token")
      sessionStorage.removeItem("dazzler_admin_auth")
      setIsAuthenticated(false)
    }
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>")
  return ctx
}
