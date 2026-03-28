const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .ft-root {
    --ink: #1a1510;
    --cream: #f9f5ef;
    --accent: #c8a96e;
    --accent-dim: rgba(200,169,110,0.18);
    --muted: rgba(249,245,239,0.45);
    --border: rgba(249,245,239,0.1);
  }

  .ft-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--ink);
    color: var(--cream);
    position: relative;
    overflow: hidden;
  }

  /* noise overlay */
  .ft-root::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
    pointer-events: none;
  }

  /* decorative circle */
  .ft-deco {
    position: absolute;
    right: -120px;
    top: -120px;
    width: 400px;
    height: 400px;
    border: 1px solid rgba(200,169,110,0.08);
    border-radius: 50%;
    pointer-events: none;
  }
  .ft-deco::before {
    content: '';
    position: absolute;
    inset: 40px;
    border: 1px solid rgba(200,169,110,0.05);
    border-radius: 50%;
  }

  /*  TOP  */
  .ft-top {
    padding: clamp(56px, 8vw, 96px) clamp(24px, 6vw, 80px) clamp(48px, 6vw, 72px);
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    position: relative;
  }

  @media (min-width: 640px) {
    .ft-top { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 1024px) {
    .ft-top { grid-template-columns: 2fr 1.4fr 1fr; gap: 40px; }
  }

  /* brand col */
  .ft-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 300;
    letter-spacing: -0.01em;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .ft-brand-name em { font-style: italic; color: var(--accent); }
  .ft-tagline {
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.75;
    max-width: 300px;
    margin-bottom: 28px;
  }

  /* newsletter row */
  .ft-newsletter {
    display: flex;
    gap: 0;
    border: 1px solid var(--border);
    max-width: 340px;
  }
  .ft-newsletter input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: var(--cream);
    min-width: 0;
  }
  .ft-newsletter input::placeholder { color: var(--muted); }
  .ft-newsletter button {
    background: var(--accent);
    border: none;
    cursor: pointer;
    padding: 12px 16px;
    color: var(--ink);
    display: flex;
    align-items: center;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .ft-newsletter button:hover { background: #d4b87a; }

  /* col headings */
  .ft-col-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .ft-col-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--accent);
    opacity: 0.25;
  }

  /* contact list */
  .ft-contact-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
  .ft-contact-item { display: flex; gap: 12px; align-items: flex-start; }
  .ft-contact-icon {
    width: 30px;
    height: 30px;
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    flex-shrink: 0;
    margin-top: 1px;
  }
  .ft-contact-text {
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.7;
  }
  .ft-contact-text a {
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-contact-text a:hover { color: var(--cream); }

  .ft-phone {
    margin-top: 20px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: 0.02em;
  }
  .ft-phone a { color: var(--cream); text-decoration: none; transition: color 0.2s; }
  .ft-phone a:hover { color: var(--accent); }

  /* social list */
  .ft-social-list { list-style: none; display: flex; flex-direction: column; gap: 4px; }
  .ft-social-list li a {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    font-weight: 300;
    color: var(--muted);
    text-decoration: none;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    transition: color 0.2s, padding-left 0.2s;
  }
  .ft-social-list li:last-child a { border-bottom: none; }
  .ft-social-list li a:hover { color: var(--cream); padding-left: 6px; }
  .ft-social-list li a svg { color: var(--accent); flex-shrink: 0; }

  /* divider */
  .ft-divider {
    height: 1px;
    background: var(--border);
    margin: 0 clamp(24px, 6vw, 80px);
  }

  /*  BOTTOM  */
  .ft-bottom {
    padding: clamp(20px, 3vw, 28px) clamp(24px, 6vw, 80px);
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    text-align: center;
    position: relative;
  }
  @media (min-width: 640px) {
    .ft-bottom {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }

  .ft-copy {
    font-size: 12px;
    font-weight: 300;
    color: var(--muted);
    letter-spacing: 0.04em;
  }

  .ft-legal { display: flex; gap: 24px; align-items: center; }
  .ft-legal a {
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .ft-legal a:hover { color: var(--accent); }
  .ft-legal-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--border);
  }
`

function IconPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  )
}
function IconMail() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}
function IconInsta() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function IconTwitter() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}
function IconYoutube() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
    </svg>
  )
}

const socials = [
  { label: 'Instagram', href: '#', icon: <IconInsta /> },
  { label: 'Twitter / X',  href: '#', icon: <IconTwitter /> },
  { label: 'Facebook',  href: '#', icon: <IconFacebook /> },
  { label: 'YouTube',   href: '#', icon: <IconYoutube /> },
]

export default function Footer() {
  return (
    <>
      <style>{styles}</style>
      <footer className="ft-root">
        <div className="ft-deco" />

        {/*  Top  */}
        <div className="ft-top">

          {/* Brand + newsletter */}
          <div>
            <p className="ft-brand-name">Honey Nails<br /><em>&amp; Academy</em></p>
            <p className="ft-tagline">
              Questions or bookings? Reach out and we'll get back to you as soon as possible.
            </p>
            <div className="ft-newsletter">
              <input type="email" placeholder="Your email address" />
              <button type="button" aria-label="Subscribe"><IconArrow /></button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="ft-col-label">Get in Touch</p>
            <ul className="ft-contact-list">
              <li className="ft-contact-item">
                <div className="ft-contact-icon"><IconPin /></div>
                <p className="ft-contact-text">
                  Shop No. 4, Opp. Paras Hospital, Beside Kaya Collection,
                  Kundan Nagar, Gulab Nagar, Dhankawadi, Pune, Maharashtra  411043
                </p>
              </li>
              <li className="ft-contact-item">
                <div className="ft-contact-icon"><IconMail /></div>
                <p className="ft-contact-text">
                  <a href="https://wa.me/918087694723" target="_blank" rel="noreferrer">WhatsApp: +91 80876 94723</a>
                </p>
              </li>
            </ul>
            <p className="ft-phone"><a href="tel:+918087694723">+91 80876 94723</a></p>
          </div>

          {/* Social */}
          <div>
            <p className="ft-col-label">Follow Us</p>
            <ul className="ft-social-list">
              {socials.map(({ label, href, icon }) => (
                <li key={label}>
                  <a href={href}>{icon}{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ft-divider" />

        {/*  Bottom  */}
        <div className="ft-bottom">
          <span className="ft-copy"> 2026 Honey Nails &amp; Academy. All rights reserved.</span>
          <div className="ft-legal">
            <a href="#">Privacy Policy</a>
            <div className="ft-legal-dot" />
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </footer>
    </>
  )
}

