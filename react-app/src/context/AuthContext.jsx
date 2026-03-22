import { createContext, useContext, useState, useCallback } from "react"

/* ─────────────────────────────────────────────
   HARDCODED ADMIN CREDENTIALS
   (Replace with real API call when backend is ready)
───────────────────────────────────────────── */
const ADMIN_CREDENTIALS = {
  email: "admin@leelaslounge.com",
  password: "Admin@2026",
}

/* ─────────────────────────────────────────────
   VALIDATION HELPERS
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Persists across page reloads within the same tab session
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("leela_admin_auth") === "true"
  })

  /**
   * Attempt to login with provided credentials.
   * Returns { ok: true } or { ok: false, error: string }
   */
  const login = useCallback((email, password) => {
    // Format validation
    const emailErr = validateEmail(email)
    if (emailErr) return { ok: false, error: emailErr, field: "email" }

    const passErr = validatePassword(password)
    if (passErr) return { ok: false, error: passErr, field: "password" }

    // Credential check
    if (
      email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email.toLowerCase() ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return {
        ok: false,
        error: "Invalid email or password. Please try again.",
        field: "general",
      }
    }

    sessionStorage.setItem("leela_admin_auth", "true")
    setIsAuthenticated(true)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem("leela_admin_auth")
    setIsAuthenticated(false)
  }, [])

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
