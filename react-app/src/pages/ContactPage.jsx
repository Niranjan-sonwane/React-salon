import { useState } from 'react'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600&display=swap');

  .lal-root *, .lal-root *::before, .lal-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lal-root {
    --bg: #ffffff;
    --bg-soft: #f8f6f2;
    --bg-dark: #111009;
    --gold: #b8924a;
    --gold-lt: #d4aa6a;
    --gold-bg: #fdf6ec;
    --ink: #1a1712;
    --muted: #706860;
    --faint: rgba(26,23,18,0.1);
    --faint2: rgba(26,23,18,0.06);
    --radius: 4px;
    --sans: 'Outfit', sans-serif;
    --serif: 'Playfair Display', serif;
    font-family: var(--sans);
    color: var(--ink);
    background: var(--bg);
    min-height: 100vh;
  }

  /* HERO */
  .lal-hero {
    background: var(--bg-dark);
    position: relative;
    overflow: hidden;
    padding: clamp(56px,11vw,130px) clamp(20px,6vw,88px) clamp(48px,9vw,100px);
  }
  .lal-hero-ring {
    position: absolute;
    right: -60px; top: -80px;
    width: clamp(220px,36vw,460px);
    height: clamp(220px,36vw,460px);
    border-radius: 50%;
    border: 1px solid rgba(184,146,74,0.12);
    pointer-events: none;
  }
  .lal-hero-ring::after {
    content: '';
    position: absolute;
    inset: 28px;
    border-radius: 50%;
    border: 1px solid rgba(184,146,74,0.08);
  }
  .lal-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 22px;
  }
  .lal-hero-tag-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--gold);
    opacity: 0.7;
  }
  .lal-hero h1 {
    font-family: var(--serif);
    font-weight: 400;
    font-size: clamp(38px,7vw,90px);
    line-height: 1;
    letter-spacing: -0.02em;
    color: #f5f0e8;
    max-width: 640px;
  }
  .lal-hero h1 i { color: var(--gold-lt); font-style: italic; }
  .lal-hero-sub {
    margin-top: 20px;
    font-size: clamp(13px,1.7vw,15px);
    font-weight: 300;
    color: rgba(245,240,232,0.45);
    max-width: 340px;
    line-height: 1.75;
  }
  @media (max-width:480px) { .lal-hero-ring { display: none; } }

  /* GRID */
  .lal-grid { display: grid; grid-template-columns: 1fr; }

  /* FORM SIDE */
  .lal-form-side {
    padding: clamp(36px,7vw,80px) clamp(20px,6vw,80px);
    border-bottom: 1px solid var(--faint);
  }
  @media (min-width:860px) {
    .lal-form-side { border-bottom: none; border-right: 1px solid var(--faint); }
  }
  .lal-side-label {
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 28px;
  }
  .lal-fields { display: flex; flex-direction: column; }
  .lal-row { display: grid; grid-template-columns: 1fr; }
  @media (min-width:520px) { .lal-row { grid-template-columns: 1fr 1fr; gap: 0 24px; } }

  .lal-field {
    border-bottom: 1px solid var(--faint);
    transition: border-color 0.2s;
  }
  .lal-field:focus-within { border-color: var(--gold); }
  .lal-field label {
    display: block;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    padding-top: 20px;
    padding-bottom: 5px;
    transition: color 0.2s;
  }
  .lal-field:focus-within label { color: var(--gold); }
  .lal-field input,
  .lal-field textarea {
    display: block;
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: var(--sans);
    font-size: clamp(14px,1.8vw,15px);
    font-weight: 300;
    color: var(--ink);
    padding: 3px 0 16px;
    resize: none;
    line-height: 1.55;
    -webkit-appearance: none;
  }
  .lal-field input::placeholder,
  .lal-field textarea::placeholder { color: rgba(26,23,18,0.25); }
  .lal-err { font-size: 11px; color: #b03a2e; padding-bottom: 6px; display: block; }

  .lal-btn {
    margin-top: 32px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 15px 32px;
    background: var(--bg-dark);
    color: #f5f0e8;
    border: none;
    cursor: pointer;
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 500;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
    transition: transform 0.18s;
    min-width: 172px;
    justify-content: center;
    border-radius: var(--radius);
  }
  .lal-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.34s cubic-bezier(0.4,0,0.2,1);
    border-radius: var(--radius);
  }
  .lal-btn:hover::after { transform: translateX(0); }
  .lal-btn:active { transform: scale(0.97); }
  .lal-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .lal-btn:disabled::after { transform: translateX(-101%); }
  .lal-btn > * { position: relative; z-index: 1; }
  .lal-btn svg { flex-shrink: 0; transition: transform 0.22s; }
  .lal-btn:hover svg { transform: translateX(4px); }
  @media (max-width:420px) { .lal-btn { width: 100%; } }

  .lal-success {
    margin-top: 24px;
    padding: 16px 18px;
    background: var(--gold-bg);
    border-left: 2px solid var(--gold);
    border-radius: 0 var(--radius) var(--radius) 0;
    font-size: 13.5px;
    color: var(--ink);
    line-height: 1.65;
  }

`

const EMPTY = { dzName: '', dzEmail: '', dzPhone: '', dzMessage: '' }
const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

export default function ContactPage() {
  const [form,      setForm]      = useState(EMPTY)
  const [errors,    setErrors]    = useState({})
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onChange = ({ target: { name, value } }) => {
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.dzName.trim())                      e.dzName    = 'Name is required'
    if (!form.dzEmail.trim())                     e.dzEmail   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.dzEmail)) e.dzEmail   = 'Enter a valid email'
    if (!form.dzPhone.trim())                     e.dzPhone   = 'Phone is required'
    if (!form.dzMessage.trim())                   e.dzMessage = 'Message is required'
    return e
  }

  const onSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true); setForm(EMPTY) }, 900)
  }

  return (
    <>
      <style>{css}</style>
      <div className="lal-root">

        {/* HERO */}
        <section className="lal-hero">
          <div className="lal-hero-ring" aria-hidden="true" />
          <div className="lal-hero-tag">
            <span className="lal-hero-tag-dot" />
            Dazzler Beauty
          </div>
          <h1>Let's <i>connect</i></h1>
          <p className="lal-hero-sub">
            Reach out for appointments, questions, or just to say hello  we're always happy to hear from you.
          </p>
        </section>

        {/* CONTENT GRID */}
        <div className="lal-grid">

          {/*  Form  */}
          <div className="lal-form-side">
            <p className="lal-side-label">Send us a message</p>
            <div className="lal-fields">

              <div className="lal-row">
                {[
                  { name: 'dzName',  label: 'Full Name',    type: 'text', ph: 'Jane Doe',        ac: 'name' },
                  { name: 'dzPhone', label: 'Phone Number', type: 'tel',  ph: '+91 98765 43210', ac: 'tel' },
                ].map(({ name, label, type, ph, ac }) => (
                  <div className="lal-field" key={name}>
                    <label htmlFor={name}>{label}</label>
                    <input id={name} name={name} type={type} placeholder={ph} autoComplete={ac}
                      value={form[name]} onChange={onChange} aria-required="true" aria-invalid={!!errors[name]} />
                    {errors[name] && <span className="lal-err">{errors[name]}</span>}
                  </div>
                ))}
              </div>

              <div className="lal-field">
                <label htmlFor="dzEmail">Email Address</label>
                <input id="dzEmail" name="dzEmail" type="email" placeholder="jane@example.com"
                  autoComplete="email" value={form.dzEmail} onChange={onChange}
                  aria-required="true" aria-invalid={!!errors.dzEmail} />
                {errors.dzEmail && <span className="lal-err">{errors.dzEmail}</span>}
              </div>

              <div className="lal-field">
                <label htmlFor="dzMessage">Your Message</label>
                <textarea id="dzMessage" name="dzMessage" rows="5"
                  placeholder="Tell us how we can help"
                  value={form.dzMessage} onChange={onChange}
                  aria-required="true" aria-invalid={!!errors.dzMessage} />
                {errors.dzMessage && <span className="lal-err">{errors.dzMessage}</span>}
              </div>

              <button type="button" className="lal-btn" onClick={onSubmit} disabled={loading}>
                <span>{loading ? 'Sending' : 'Send Message'}</span>
                {!loading && <ArrowIcon />}
              </button>
            </div>

            {submitted && (
              <div className="lal-success" role="alert">
                Thank you  your message has been received. We'll be in touch shortly.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

