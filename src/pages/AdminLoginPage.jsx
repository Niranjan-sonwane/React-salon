import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth, validateEmail, validatePassword } from "../context/AuthContext"

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)

  const [emailErr,   setEmailErr]   = useState("")
  const [passErr,    setPassErr]    = useState("")
  const [generalErr, setGeneralErr] = useState("")
  const [loading,    setLoading]    = useState(false)

  /*  Live validation on blur  */
  const handleEmailBlur = () => {
    setEmailErr(validateEmail(email) || "")
  }

  const handlePassBlur = () => {
    setPassErr(validatePassword(password) || "")
  }

  /*  Submit  */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralErr("")

    // Run full validation before submitting
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailErr(eErr || "")
    setPassErr(pErr || "")
    if (eErr || pErr) return

    setLoading(true)
    // Simulate a brief network delay for realistic UX
    await new Promise((r) => setTimeout(r, 600))

    try {
      const result = await login(email, password)

      if (result.ok) {
        navigate("/admin", { replace: true })
      } else {
        if (result.field === "email") setEmailErr(result.error)
        else if (result.field === "password") setPassErr(result.error)
        else setGeneralErr(result.error)
      }
    } catch (err) {
      setGeneralErr(err?.message || "Failed to login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      {/*  Left panel  brand art  */}
      <div className="auth-brand">
        <div className="auth-brand__overlay" />
        <div className="auth-brand__content">
          <div className="auth-brand__logo">
            <img src="/images/DazzlerBeauty.jpeg" alt="Honey Nails & Academy" />
          </div>
          <h1 className="auth-brand__tagline">
            Where Beauty<br />Meets Precision
          </h1>
          <p className="auth-brand__sub">
            Manage your salon appointments, services, and client bookings all in one place.
          </p>
          <div className="auth-brand__features">
            {["Booking Management", "Dynamic Capacity Control", "Daily Schedule Config", "Client Records"].map((f) => (
              <div key={f} className="auth-brand__feature">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*  Right panel  login form  */}
      <div className="auth-form-panel">
        <Link to="/" className="auth-back-to-site">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to site
        </Link>

        <div className="auth-form-box">
          <div className="auth-form-header">
            <div className="auth-form-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h2 className="auth-form-title">Admin Login</h2>
            <p className="auth-form-sub">Sign in to access the management panel</p>
          </div>

          {/* General error */}
          {generalErr && (
            <div className="auth-alert auth-alert--error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{generalErr}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email */}
            <div className={`auth-field${emailErr ? " has-error" : ""}`}>
              <label className="auth-label" htmlFor="admin-email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@dazzlerbeauty.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr("") }}
                  onBlur={handleEmailBlur}
                  className="auth-input"
                  aria-describedby={emailErr ? "email-error" : undefined}
                />
              </div>
              {emailErr && (
                <p className="auth-field-error" id="email-error" role="alert">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {emailErr}
                </p>
              )}
            </div>

            {/* Password */}
            <div className={`auth-field${passErr ? " has-error" : ""}`}>
              <label className="auth-label" htmlFor="admin-password">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (passErr) setPassErr("") }}
                  onBlur={handlePassBlur}
                  className="auth-input"
                  aria-describedby={passErr ? "pass-error" : undefined}
                />
                <button
                  type="button"
                  className="auth-show-pass"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {passErr && (
                <p className="auth-field-error" id="pass-error" role="alert">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {passErr}
                </p>
              )}
            </div>

            {/* Password hints */}
            <div className="auth-pass-hints">
              {[
                { label: "8+ characters",     ok: password.length >= 8 },
                { label: "Uppercase letter",  ok: /[A-Z]/.test(password) },
                { label: "Number",            ok: /[0-9]/.test(password) },
                { label: "Special character", ok: /[@$!%*?&#^]/.test(password) },
              ].map(({ label, ok }) => (
                <span key={label} className={`auth-hint${ok ? " is-ok" : ""}`}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    {ok
                      ? <polyline points="20 6 9 17 4 12"/>
                      : <circle cx="12" cy="12" r="10"/>
                    }
                  </svg>
                  {label}
                </span>
              ))}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading
                ? <><span className="auth-spinner" />Verifying</>
                : <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Sign In to Admin Panel
                  </>
              }
            </button>
          </form>

          <p className="auth-demo-hint">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="8"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
            </svg>
            Demo  use <strong>admin@dazzlerbeauty.com</strong> / <strong>Admin@2026</strong>
          </p>
        </div>
      </div>
    </div>
  )
}


