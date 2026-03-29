import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

const serviceLinks = [
  { to: '/nails',              label: 'Nails' },
  { to: '/lashes',             label: 'Lashes' },
  { to: '/skin',               label: 'Skin' },
  { to: '/pedicure',           label: 'Pedicure' },
  { to: '/manicure',           label: 'Manicure' },
  { to: '/darklip-correction', label: 'DarkLip Correction' },
  { to: '/microblading',       label: 'Microblading' },
  { to: '/waxing',             label: 'Waxing' },
]

const galleryLinks = [
  { to: '/portfolio#nail-art', label: 'Nail Art' },
  { to: '/portfolio#jewellery', label: 'Jewellery' },
]

function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    setMobileServicesOpen(false)
    setMobileGalleryOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        /*  ROOT  */
        .ll-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #efe5d6;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 1px solid rgba(79, 35, 24, 0.18);
          transition: box-shadow 0.3s ease;
        }
        .ll-nav.ll-scrolled {
          box-shadow: 0 4px 28px rgba(26,21,16,0.08);
        }

        /*  GOLD ACCENT STRIP  */
        .ll-nav-accent {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #c8a96e 35%, #c8a96e 65%, transparent 100%);
          opacity: 0.45;
        }

        /*  MAIN BAR 
           height: 90px is the single source of truth.
           overflow: hidden ensures the logo never bleeds outside. */
        .ll-nav-bar {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 clamp(20px, 4vw, 52px);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 90px;
          overflow: visible;
        }

        /*  LEFT / RIGHT NAVS  */
        .ll-nav-left {
          display: flex;
          align-items: center;
          gap: clamp(20px, 2.8vw, 44px);
          justify-content: flex-start;
        }
        .ll-nav-right {
          display: flex;
          align-items: center;
          gap: clamp(16px, 2.2vw, 36px);
          justify-content: flex-end;
        }

        /*  NAV LINKS  */
        .ll-nav-link {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #3b2a20;
          text-decoration: none;
          position: relative;
          padding: 4px 0;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .ll-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #c8a96e;
          transition: width 0.25s cubic-bezier(.4,0,.2,1);
        }
        .ll-nav-link:hover,
        .ll-nav-link.active { color: #1a1510; }
        .ll-nav-link:hover::after,
        .ll-nav-link.active::after { width: 100%; }

        /*  SERVICES DROPDOWN  */
        .ll-nav-services { position: relative; }
        .ll-nav-service-btn {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #3b2a20;
          background: transparent;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 0;
          position: relative;
          white-space: nowrap;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ll-nav-service-btn::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #c8a96e;
          transition: width 0.25s;
        }
        .ll-nav-service-btn:hover { color: #1a1510; }
        .ll-nav-service-btn:hover::after { width: 100%; }
        .ll-chevron { transition: transform 0.22s; }
        .ll-nav-services:hover .ll-chevron { transform: rotate(180deg); }

        .ll-nav-dropdown {
          position: absolute;
          top: calc(100% + 18px);
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          min-width: 210px;
          background: #f7efe3;
          border: 1px solid rgba(79, 35, 24, 0.2);
          box-shadow: 0 20px 48px rgba(26,21,16,0.10);
          padding: 8px 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s, transform 0.2s, visibility 0.2s;
          z-index: 50;
        }
        .ll-nav-dropdown::before {
          content: '';
          position: absolute;
          top: -5px; left: 50%;
          transform: translateX(-50%) rotate(45deg);
          width: 9px; height: 9px;
          background: #f7efe3;
          border-left: 1px solid rgba(79, 35, 24, 0.2);
          border-top: 1px solid rgba(79, 35, 24, 0.2);
        }
        .ll-nav-services:hover .ll-nav-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        .ll-nav-dropdown-link {
          display: block;
          padding: 9px 20px;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #3b2a20;
          text-decoration: none;
          transition: background 0.15s, color 0.15s, padding-left 0.2s;
        }
        .ll-nav-dropdown-link:hover {
          background: rgba(200,169,110,0.09);
          color: #1a1510;
          padding-left: 26px;
        }
        .ll-nav-dropdown-link.active {
          border-left: 2px solid #c8a96e;
          background: rgba(200,169,110,0.06);
          color: #1a1510;
          padding-left: 18px;
        }

        /*  LOGO 
           KEY FIX: max-height: 75px keeps logo inside the 90px bar always.
           The parent has overflow:hidden as a second safeguard. */
        .ll-nav-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 clamp(12px, 1.8vw, 28px);
          height: 90px;
          overflow: hidden;
        }
        .ll-nav-logo img {
          width: auto;
          max-width: clamp(100px, 15vw, 180px);
          max-height: 78px;
          object-fit: contain;
          display: block;
          transition: opacity 0.2s;
          mix-blend-mode: multiply;
          filter: contrast(1.1) brightness(1.08); /* Forces off-white background to pure white to fix the grey rectangle */
        }
        .ll-nav-logo:hover img { opacity: 0.82; }

        /*  CONTACT BUTTON  */
        .ll-nav-pill {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fdfcfa !important;
          background: #1a1510;
          text-decoration: none;
          padding: 10px 20px;
          white-space: nowrap;
          transition: background 0.22s, color 0.22s;
          display: inline-block;
          line-height: 1;
        }
        .ll-nav-pill:hover { background: #c8a96e; color: #1a1510 !important; }
        .ll-nav-pill.active { background: #c8a96e; color: #1a1510 !important; }

        /*  WHATSAPP BUTTON  */
        .ll-nav-whatsapp {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #25d366;
          color: #fff !important;
          padding: 10px 18px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s;
          line-height: 1;
        }
        .ll-nav-whatsapp:hover {
          background: #128c7e;
          transform: translateY(-1px);
        }
        .ll-nav-whatsapp svg {
          stroke-width: 2.5;
        }

        /*  ADMIN BTN  single circle, no duplicate  */
        .ll-nav-admin {
          width: 34px; height: 34px;
          border: 1px solid rgba(26,21,16,0.14);
          border-radius: 50%;
          background: transparent;
          color: #4a3f37;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .ll-nav-admin:hover {
          background: #1a1510;
          color: #fdfcfa;
          border-color: #1a1510;
        }

        /*  HAMBURGER  hidden on desktop  */
        .ll-nav-toggle {
          display: none;
          width: 36px; height: 36px;
          border: 1px solid rgba(26,21,16,0.14);
          border-radius: 6px;
          background: transparent;
          color: #1a1510;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .ll-nav-toggle:hover { background: rgba(26,21,16,0.05); }

        .ll-nav-admin-mobile {
          display: none;
          width: 36px; height: 36px;
          border: 1px solid rgba(26,21,16,0.14);
          border-radius: 50%;
          background: transparent;
          color: #4a3f37;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .ll-nav-admin-mobile:hover {
          background: #1a1510;
          color: #fdfcfa;
          border-color: #1a1510;
        }

        /*  MOBILE MENU  */
        .ll-nav-mobile {
          background: #f7efe3;
          border-top: 1px solid rgba(79, 35, 24, 0.16);
        }
        .ll-nav-mobile-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 14px clamp(20px,4vw,52px) 22px;
        }
        .ll-nav-mobile-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(26,21,16,0.06);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #1a1510;
          text-decoration: none;
          background: transparent;
          border-left: none; border-right: none; border-top: none;
          width: 100%;
          cursor: pointer;
          transition: color 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .ll-nav-mobile-link:last-child { border-bottom: none; }
        .ll-nav-mobile-link:hover,
        .ll-nav-mobile-link.active { color: #c8a96e; }
        .ll-nav-mobile-sub {
          padding: 4px 0 8px 16px;
          display: flex;
          flex-direction: column;
          border-left: 2px solid rgba(200,169,110,0.35);
          margin: 2px 0 6px;
        }
        .ll-nav-mobile-sub a {
          padding: 7px 0;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b6257;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.2s;
        }
        .ll-nav-mobile-sub a:hover,
        .ll-nav-mobile-sub a.active { color: #1a1510; }

        /*  BREAKPOINT  */
        @media (max-width: 1040px) {
          .ll-nav-left, .ll-nav-right { display: none; }
          .ll-nav-bar {
            grid-template-columns: 36px 1fr 36px;
            gap: 12px;
          }
          .ll-nav-toggle { display: inline-flex; }
          .ll-nav-logo   { justify-self: center; }
          .ll-nav-admin-mobile {
            display: inline-flex;
            justify-self: end;
          }
        }

        @media (max-width: 480px) {
          .ll-nav-logo img { max-width: 72px; max-height: 44px; }
        }
      `}</style>

      <header className={`ll-nav${scrolled ? ' ll-scrolled' : ''}`}>

        {/*  BAR  */}
        <div className="ll-nav-bar">

          {/* Hamburger  CSS shows only on mobile */}
          <button
            type="button"
            className="ll-nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(p => !p)}
          >
            {menuOpen
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            }
          </button>

          {/* LEFT NAV */}
          <nav className="ll-nav-left" aria-label="Primary left navigation">
            <NavLink to="/" className={({ isActive }) => `ll-nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
            <NavLink to="/about" className={({ isActive }) => `ll-nav-link${isActive ? ' active' : ''}`}>About</NavLink>
            <div className="ll-nav-services">
              <button type="button" className="ll-nav-service-btn" aria-haspopup="true">
                Services
                <svg className="ll-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className="ll-nav-dropdown" role="menu">
                {serviceLinks.map(s => (
                  <NavLink
                    key={s.to}
                    to={s.to}
                    className={({ isActive }) => `ll-nav-dropdown-link${isActive ? ' active' : ''}`}
                    role="menuitem"
                  >
                    {s.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          {/* LOGO  contained within 72px bar */}
          <Link to="/" className="ll-nav-logo" aria-label="Honey Nails & Academy  Home">
            <img src="/images/DazzlerBeauty.jpeg" alt="Honey Nails & Academy" />
          </Link>

          <button
            type="button"
            className="ll-nav-admin-mobile"
            onClick={() => navigate('/admin-login')}
            aria-label="Admin login"
            title="Admin Panel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </button>

          {/* RIGHT NAV */}
          <nav className="ll-nav-right" aria-label="Primary right navigation">
            <NavLink to="/appointment" className={({ isActive }) => `ll-nav-link${isActive ? ' active' : ''}`}>Appointment</NavLink>
            <NavLink to="/portfolio"   className={({ isActive }) => `ll-nav-link${isActive ? ' active' : ''}`}>Portfolio</NavLink>
            <NavLink to="/courses"     className={({ isActive }) => `ll-nav-link${isActive ? ' active' : ''}`}>Courses</NavLink>
            <div className="ll-nav-services">
              <button type="button" className="ll-nav-service-btn" aria-haspopup="true">
                Gallery
                <svg className="ll-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div className="ll-nav-dropdown" role="menu">
                {galleryLinks.map(g => (
                  <NavLink
                    key={g.to}
                    to={g.to}
                    className={({ isActive }) => `ll-nav-dropdown-link${isActive ? ' active' : ''}`}
                    role="menuitem"
                  >
                    {g.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink to="/contact"     className={({ isActive }) => `ll-nav-pill${isActive ? ' active' : ''}`}>Contact</NavLink>
            <a href="https://wa.me/918087694723" target="_blank" rel="noopener noreferrer" className="ll-nav-whatsapp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L22 2l-2.1 4.7a8.38 8.38 0 0 1 .9 3.8z"/>
              </svg>
              Chat
            </a>
            {/* One admin button  no duplicate */}
            <button
              type="button"
              className="ll-nav-admin"
              onClick={() => navigate('/admin-login')}
              aria-label="Admin login"
              title="Admin Panel"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </button>
          </nav>

        </div>

        {/* Gold accent line */}
        <div className="ll-nav-accent" />

        {/*  MOBILE DROPDOWN  */}
        {menuOpen && (
          <div className="ll-nav-mobile">
            <div className="ll-nav-mobile-inner">
              <NavLink to="/"    className={({ isActive }) => `ll-nav-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => `ll-nav-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>About</NavLink>

              <button
                type="button"
                className="ll-nav-mobile-link"
                onClick={() => setMobileServicesOpen(p => !p)}
              >
                Services
                <svg
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {mobileServicesOpen && (
                <div className="ll-nav-mobile-sub">
                  {serviceLinks.map(s => (
                    <NavLink
                      key={s.to}
                      to={s.to}
                      className={({ isActive }) => isActive ? 'active' : ''}
                      onClick={closeMenu}
                    >
                      {s.label}
                    </NavLink>
                  ))}
                </div>
              )}

              <NavLink to="/appointment" className={({ isActive }) => `ll-nav-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Appointment</NavLink>
              <NavLink to="/portfolio"   className={({ isActive }) => `ll-nav-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Portfolio</NavLink>
              <NavLink to="/courses"     className={({ isActive }) => `ll-nav-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Courses</NavLink>

              <button
                type="button"
                className="ll-nav-mobile-link"
                onClick={() => setMobileGalleryOpen(p => !p)}
              >
                Gallery
                <svg
                  width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: mobileGalleryOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {mobileGalleryOpen && (
                <div className="ll-nav-mobile-sub">
                  {galleryLinks.map(g => (
                    <NavLink
                      key={g.to}
                      to={g.to}
                      className={({ isActive }) => isActive ? 'active' : ''}
                      onClick={closeMenu}
                    >
                      {g.label}
                    </NavLink>
                  ))}
                </div>
              )}

              <NavLink to="/contact"     className={({ isActive }) => `ll-nav-mobile-link${isActive ? ' active' : ''}`} onClick={closeMenu}>Contact</NavLink>
              
              <a 
                href="https://wa.me/918087694723" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ll-nav-mobile-link"
                style={{ background: '#25d366', color: '#fff', border: 'none', marginTop: '12px', justifyContent: 'center', gap: '8px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L22 2l-2.1 4.7a8.38 8.38 0 0 1 .9 3.8z"/>
                </svg>
                WhatsApp Chat
              </a>
            </div>
          </div>
        )}

      </header>
    </>
  )
}

export default Navbar

