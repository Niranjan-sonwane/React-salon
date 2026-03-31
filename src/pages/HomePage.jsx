import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import SpecialtySection from '../components/SpecialtySection'

/* 
   STYLES
 */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:       #1a1510;
  --cream:     #f9f5ef;
  --warm:      #fdfcfa;
  --accent:    #c8a96e;
  --accent-dk: #9d7d45;
  --muted:     #6b6257;
  --border:    rgba(26,21,16,.10);
}

/*  noise overlay  */
.hp-noise {
  position:absolute; inset:0; pointer-events:none; z-index:0;
  opacity:.032;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px;
}

/* 
   HERO
   FIX: overflow:hidden on wrapper, 
   overlay lightened & even, 
   content padding corrected
 */
.hp-hero {
  position: relative;
  overflow: hidden;          /* prevents peekthrough from adjacent slides */
  background: var(--ink);
  width: 100%;
}
.hp-hero-track {
  display: flex;
  width: 100%;
  transition: transform .85s cubic-bezier(.4,0,.2,1);
  /* will-change keeps GPU compositing in check */
  will-change: transform;
}
.hp-hero-slide {
  flex: 0 0 100%;
  width: 100%;
  position: relative;
  min-height: clamp(520px, 82vh, 860px);
  overflow: hidden;          /* each slide clips its own image */
}
.hp-hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hp-hero-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  opacity: 0.92;             /* increased opacity to make image brighter */
  display: block;
}

/* FIX: overlay was lopsided (too dark left, pale right).
   Now a gentle centered vignette + left-side readable darkening. */
.hp-hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to right,
      rgba(26,21,16,.65) 0%,
      rgba(26,21,16,.15) 45%,
      transparent 100%
    );
}

/* FIX: content padding  starts from true left edge with proper gutters */
.hp-hero-content {
  position: relative;
  z-index: 2;
  padding:
    clamp(90px, 14vw, 160px)   /* top */
    clamp(24px, 7vw, 96px)     /* right */
    clamp(72px, 10vw, 130px)   /* bottom */
    clamp(24px, 7vw, 96px);    /* left  matches right for symmetry */
  max-width: 660px;
}
.hp-hero-eyebrow {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.hp-hero-eyebrow::after {
  content: '';
  width: 36px; height: 1px;
  background: var(--accent);
  opacity: .55;
}
.hp-hero-content h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 6vw, 82px);
  font-weight: 300;
  line-height: 1.03;
  color: var(--cream);
  letter-spacing: -.02em;
  margin-bottom: 18px;
}
.hp-hero-content h2 em { font-style: italic; color: var(--accent); }
.hp-hero-content p {
  font-size: clamp(13px, 1.3vw, 15px);
  font-weight: 300;
  color: rgba(249,245,239,.68);
  line-height: 1.75;
  margin-bottom: 34px;
  max-width: 420px;
}

/* hero nav dots */
.hp-hero-dots {
  position: absolute;
  bottom: 28px;
  left: clamp(24px, 7vw, 96px);   /* aligned with content, not centred */
  display: flex;
  gap: 8px;
  z-index: 3;
}
.hp-hero-dot {
  width: 20px; height: 3px;
  border: none; cursor: pointer; padding: 0;
  background: rgba(249,245,239,.30);
  border-radius: 2px;
  transition: background .25s, width .25s;
}
.hp-hero-dot.active {
  background: var(--accent);
  width: 36px;
}

/*  BUTTONS  */
.hp-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--accent);
  color: var(--ink);
  padding: 14px 32px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .13em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background .22s;
}
.hp-btn:hover { background: #d4b87a; }
.hp-btn-dark { background: var(--ink); color: var(--cream); }
.hp-btn-dark:hover { background: #2e2720; }
.hp-btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border);
}
.hp-btn-ghost:hover { background: var(--ink); color: var(--cream); }

/*  SECTION SHELL  */
.hp-section { padding: clamp(64px,9vw,112px) clamp(24px,6vw,80px); position: relative; }
.hp-container { max-width: 1200px; margin: 0 auto; }

.hp-eyebrow {
  font-size: 10px; font-weight: 500; letter-spacing: .22em; text-transform: uppercase;
  color: var(--accent); margin-bottom: 14px;
  display: flex; align-items: center; gap: 12px;
}
.hp-eyebrow::before { content: ''; width: 32px; height: 1px; background: var(--accent); opacity: .5; }
.hp-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(30px, 4.2vw, 54px);
  font-weight: 300;
  line-height: 1.07;
  letter-spacing: -.02em;
  color: var(--ink);
}
.hp-section-title em { font-style: italic; color: var(--accent-dk); }
.hp-body-text { font-size: 15px; font-weight: 300; color: var(--muted); line-height: 1.78; }

/*  ABOUT  */
.hp-about { background: var(--cream); }
.hp-about-grid {
  display: grid; grid-template-columns: 1fr; gap: 52px; align-items: center;
}
@media(min-width:900px){ .hp-about-grid { grid-template-columns: 1.2fr 1fr; } }
.hp-about-text { display: flex; flex-direction: column; gap: 22px; }
.hp-about-card {
  background: var(--ink); color: var(--cream);
  padding: clamp(30px,4vw,48px); position: relative; overflow: hidden;
}
.hp-about-card::before {
  content: ''; position: absolute; right: -40px; top: -40px;
  width: 160px; height: 160px;
  border: 1px solid rgba(200,169,110,.15); border-radius: 50%;
}
.hp-about-card h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px,2.5vw,30px); font-weight: 300; margin-bottom: 8px;
  color: #ffffff;
}
.hp-about-card h3 em { font-style: italic; color: #e3c184; }
.hp-about-card .stat {
  font-size: 12px; font-weight: 300; color: rgba(249,245,239,.5);
  letter-spacing: .08em; margin-bottom: 24px;
}

/*  SERVICES  */
.hp-services { background: var(--warm); }
.hp-services-header { text-align: center; margin-bottom: 48px; }
.hp-services-header p { font-size: 14px; font-weight: 300; color: var(--muted); margin-top: 10px; }

.hp-srv-wrap { overflow: hidden; }
.hp-srv-track {
  display: flex; gap: 20px;
  transition: transform .6s cubic-bezier(.4,0,.2,1);
}
.hp-srv-card {
  flex: 0 0 100%;
  background: var(--cream); text-decoration: none; color: inherit;
  overflow: hidden; border: 1px solid var(--border);
  transition: transform .3s, box-shadow .3s;
}
@media(min-width:520px) { .hp-srv-card { flex: 0 0 calc(50% - 10px); } }
@media(min-width:860px) { .hp-srv-card { flex: 0 0 calc(33.333% - 14px); } }
@media(min-width:1100px){ .hp-srv-card { flex: 0 0 calc(25% - 15px); } }
.hp-srv-card:hover { transform: translateY(-5px); box-shadow: 0 20px 44px rgba(26,21,16,.11); }
.hp-srv-img { height: 200px; overflow: hidden; }
.hp-srv-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
.hp-srv-card:hover .hp-srv-img img { transform: scale(1.06); }
.hp-srv-body { padding: 18px 20px 22px; }
.hp-srv-body h6 {
  font-size: 11px; font-weight: 600; letter-spacing: .15em; text-transform: uppercase;
  color: var(--ink); margin-bottom: 7px;
}
.hp-srv-body p { font-size: 13px; font-weight: 300; color: var(--muted); line-height: 1.65; }
.hp-srv-bar {
  display: block; width: 22px; height: 2px;
  background: var(--accent); margin-top: 13px;
  transition: width .3s;
}
.hp-srv-card:hover .hp-srv-bar { width: 38px; }
.hp-srv-nav {
  display: flex; justify-content: center; gap: 10px; margin-top: 32px;
}
.hp-srv-arr {
  width: 42px; height: 42px; border: 1px solid var(--border); background: transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: var(--ink); transition: background .2s, color .2s;
}
.hp-srv-arr:hover { background: var(--ink); color: var(--cream); }
.hp-srv-center { text-align: center; margin-top: 40px; }

/*  BEFORE / AFTER  */
.hp-ba { background: var(--ink); color: var(--cream); }
.hp-ba-grid {
  display: grid; grid-template-columns: 1fr; gap: 52px; align-items: center;
}
@media(min-width:900px){ .hp-ba-grid { grid-template-columns: 1fr 1fr; gap: 68px; } }
.hp-ba-text { display: flex; flex-direction: column; gap: 22px; }
.hp-ba-text .hp-section-title { color: var(--cream); }
.hp-ba-text .hp-section-title em { color: var(--accent); }
.hp-ba-text .hp-body-text { color: rgba(249,245,239,.55); }

/* BA slider */
.hp-ba-slider {
  position: relative; overflow: hidden;
  cursor: col-resize; user-select: none;
  border: 1px solid rgba(249,245,239,.1);
  touch-action: none;
}
.hp-ba-slider > img { width: 100%; display: block; pointer-events: none; }
.hp-ba-resize {
  position: absolute; top: 0; left: 0; height: 100%; overflow: hidden;
}
.hp-ba-resize img { height: 100%; width: auto; min-width: 100%; pointer-events: none; }
.hp-ba-handle {
  position: absolute; top: 0; height: 100%;
  width: 3px; background: var(--accent);
  transform: translateX(-50%);
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.hp-ba-handle-knob {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--accent);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink); pointer-events: none; flex-shrink: 0;
}
.hp-ba-label {
  position: absolute; top: 12px;
  font-size: 9px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
  background: var(--accent); color: var(--ink); padding: 4px 9px; pointer-events: none;
}
.hp-ba-label.after  { right: 12px; }
.hp-ba-label.before { left: 12px; }

/*  WHY US  */
.hp-why { background: var(--cream); }
.hp-why-grid {
  display: grid; grid-template-columns: 1fr; gap: 52px; align-items: center;
}
@media(min-width:900px){ .hp-why-grid { grid-template-columns: 1fr 1fr; } }
.hp-why-list { list-style: none; display: flex; flex-direction: column; margin: 22px 0 30px; }
.hp-why-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 13px 0; border-bottom: 1px solid var(--border);
  font-size: 14px; font-weight: 300; color: var(--muted); line-height: 1.5;
}
.hp-why-item:first-child { border-top: 1px solid var(--border); }
.hp-why-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 5px; }
.hp-why-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.hp-collage {
  display: grid; grid-template-columns: 1fr 1fr;
  grid-template-rows: 210px 210px; gap: 10px;
}
.hp-collage img { width: 100%; height: 100%; object-fit: cover; }

/*  PARALLAX CTA  */
.hp-paralax {
  background: var(--ink); text-align: center;
  padding: clamp(72px,10vw,112px) clamp(24px,6vw,80px);
  position: relative; overflow: hidden;
}
.hp-paralax::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(200,169,110,.12) 0%, transparent 70%);
  pointer-events: none;
}
.hp-paralax h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(30px,5vw,62px); font-weight: 300; color: var(--cream);
  letter-spacing: -.02em; margin-bottom: 10px; position: relative;
}
.hp-paralax h2 em { font-style: italic; color: var(--accent); }
.hp-paralax p {
  font-size: 15px; font-weight: 300; color: rgba(249,245,239,.48);
  margin-bottom: 34px; position: relative;
}

/*  PROCESS  */
.hp-process { background: var(--warm); }
.hp-process-grid {
  display: grid; grid-template-columns: 1fr; gap: 44px; align-items: center;
}
@media(min-width:800px){ .hp-process-grid { grid-template-columns: 1fr 1.2fr; } }
.hp-process-img { border: 1px solid var(--border); overflow: hidden; }
.hp-process-img img { width: 100%; display: block; }

/*  TESTIMONIALS  */
.hp-testi { background: var(--cream); }
.hp-testi-header { text-align: center; margin-bottom: 44px; }
.hp-testi-wrap { overflow: hidden; }
.hp-testi-track {
  display: flex;
  transition: transform .6s cubic-bezier(.4,0,.2,1);
}
.hp-testi-card {
  flex: 0 0 100%;
  background: var(--warm); padding: clamp(28px,4vw,44px);
  border: 1px solid var(--border);
}
.hp-testi-stars { display: flex; gap: 3px; margin-bottom: 18px; }
.hp-testi-star { color: var(--accent); font-size: 13px; }
.hp-testi-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(16px,1.9vw,21px); font-weight: 300; font-style: italic;
  color: var(--ink); line-height: 1.65; margin-bottom: 24px;
}
.hp-testi-quote::before {
  content: '\\201C';
  font-size: 72px; line-height: .4; color: var(--accent); opacity: .32;
  display: block; margin-bottom: 10px;
}
.hp-testi-name { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--ink); }
.hp-testi-role { font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 2px; }
.hp-testi-nav { display: flex; justify-content: center; gap: 8px; margin-top: 28px; }
.hp-testi-dot {
  width: 6px; height: 6px; border-radius: 50%;
  border: none; cursor: pointer; padding: 0;
  background: var(--border);
  transition: background .2s, transform .2s;
}
.hp-testi-dot.active { background: var(--accent); transform: scale(1.4); }

/*  GALLERY  */
.hp-gallery { overflow: hidden; background: var(--ink); padding: 0; line-height: 0; }
.hp-gallery-track {
  display: flex; gap: 3px;
  animation: hp-scroll 32s linear infinite;
  width: max-content;
}
.hp-gallery-track:hover { animation-play-state: paused; }
@keyframes hp-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.hp-gallery-item { flex: 0 0 clamp(130px,15vw,210px); height: 175px; overflow: hidden; }
.hp-gallery-item img {
  width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(15%);
  transition: filter .4s, transform .4s;
}
.hp-gallery-item:hover img { filter: grayscale(0); transform: scale(1.07); }

/*  CTA BOTTOM  */
.hp-cta { background: var(--warm); border-top: 1px solid var(--border); }
.hp-cta-grid {
  display: grid; grid-template-columns: 1fr; gap: 36px; align-items: center;
}
@media(min-width:768px){ .hp-cta-grid { grid-template-columns: 1fr 1fr; } }
.hp-cta-call { display: flex; align-items: center; gap: 16px; }
.hp-cta-icon {
  width: 50px; height: 50px; border: 1px solid var(--border); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  color: var(--accent-dk);
}
.hp-cta-call h6 {
  font-size: 10px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 4px;
}
.hp-cta-call p {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(19px,2.2vw,26px); font-weight: 300; color: var(--ink);
}
.hp-cta-call p a { color: inherit; text-decoration: none; transition: color .2s; }
.hp-cta-call p a:hover { color: var(--accent-dk); }
.hp-cta-connect h6 {
  font-size: 10px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 6px;
}
.hp-cta-connect p { font-size: 13px; font-weight: 300; color: var(--muted); margin-bottom: 16px; }
.hp-email-row {
  display: flex; border: 1px solid var(--border); overflow: hidden; max-width: 400px;
}
.hp-email-row input {
  flex: 1; border: none; outline: none; background: transparent;
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300;
  color: var(--ink); padding: 12px 15px; min-width: 0;
}
.hp-email-row input::placeholder { color: rgba(26,21,16,.32); }
.hp-email-row button {
  background: var(--ink); color: var(--cream); border: none; cursor: pointer;
  padding: 12px 18px; font-family: 'DM Sans', sans-serif;
  font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  white-space: nowrap; transition: background .2s; display: flex; align-items: center; gap: 7px;
}
.hp-email-row button:hover { background: var(--accent); color: var(--ink); }

/*  misc responsive  */
@media(max-width:480px){
  .hp-why-btns { flex-direction: column; }
  .hp-why-btns a { text-align: center; }
}
`

/*  helpers  */
function Section({ className = '', children }) {
  return (
    <section className={`hp-section ${className}`}>
      <div className="hp-container">{children}</div>
    </section>
  )
}
function Eyebrow({ children }) {
  return <p className="hp-eyebrow">{children}</p>
}

/*  HERO  */
function Hero({ slides }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 4500)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <section className="hp-hero">
      {/* track: only one slide visible at a time */}
      <div
        className="hp-hero-track"
        style={{ transform: `translateX(-${idx * 100}%)` }}
      >
        {slides.map(s => (
          <div className="hp-hero-slide" key={s.id}>
            <div className="hp-hero-img">
              <picture>
                <source media="(max-width:640px)" srcSet={s.mobile} />
                <img src={s.desktop} alt={s.title} />
              </picture>
            </div>
            <div className="hp-hero-overlay" />
            <div className="hp-hero-content">
              <div className="hp-hero-eyebrow">Honey Nails &amp; Academy</div>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
              <Link to="/appointment" className="hp-btn">Book Now </Link>
            </div>
          </div>
        ))}
      </div>

      {/* dots  bottom-left aligned with content */}
      <div className="hp-hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hp-hero-dot${i === idx ? ' active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

/*  SERVICES CAROUSEL  */
function ServicesCarousel({ services }) {
  const [pos, setPos] = useState(0)

  const visible = () => {
    if (typeof window === 'undefined') return 4
    if (window.innerWidth >= 1100) return 4
    if (window.innerWidth >= 860)  return 3
    if (window.innerWidth >= 520)  return 2
    return 1
  }

  const max    = Math.max(0, services.length - visible())
  const cardPc = 100 / visible()

  const prev = () => setPos(p => Math.max(0, p - 1))
  const next = () => setPos(p => Math.min(max, p + 1))

  return (
    <>
      <div className="hp-srv-wrap">
        <div
          className="hp-srv-track"
          style={{ transform: `translateX(-${pos * (cardPc + (20 / (12 * visible())))}%)` }}
        >
          {services.map(s => (
            <Link to={`/${s.slug}`} className="hp-srv-card" key={s.slug}>
              <div className="hp-srv-img">
                <img src={s.image} alt={s.title} />
              </div>
              <div className="hp-srv-body">
                <h6>{s.title}</h6>
                <p>{s.shortDescription}</p>
                <span className="hp-srv-bar" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="hp-srv-nav">
        <button className="hp-srv-arr" onClick={prev} aria-label="Previous services">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <button className="hp-srv-arr" onClick={next} aria-label="Next services">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </>
  )
}

/*  BEFORE / AFTER SLIDER  */
function BASlider() {
  const wrapRef   = useRef(null)
  const [pct, setPct] = useState(40)
  const dragging  = useRef(false)

  const calcPct = (clientX) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPct((x / rect.width) * 100)
  }

  const onPointerDown = (e) => {
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    calcPct(e.clientX)
  }
  const onPointerMove = (e) => { if (dragging.current) calcPct(e.clientX) }
  const onPointerUp   = ()  => { dragging.current = false }

  return (
    <div
      className="hp-ba-slider"
      ref={wrapRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* "After" image  full width base */}
      <img src="/images/nails images/5.jpeg" alt="After treatment" />
      <span className="hp-ba-label after" style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: '4px', zIndex: 2, padding: '6px 14px' }}>After</span>

      {/* "Before" image  clips to pct width */}
      <div className="hp-ba-resize" style={{ width: `${pct}%` }}>
        <img
          src="/images/nails images/5.jpeg"
          alt="Before treatment"
          style={{ width: wrapRef.current ? wrapRef.current.offsetWidth + 'px' : '100%', filter: 'grayscale(100%) contrast(85%)' }}
        />
        <span className="hp-ba-label before" style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: '4px', zIndex: 2, padding: '6px 14px' }}>Before</span>
      </div>

      {/* Drag handle */}
      <div className="hp-ba-handle" style={{ left: `${pct}%` }}>
        <div className="hp-ba-handle-knob">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

/*  TESTIMONIALS  */
function Testimonials({ items }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 5000)
    return () => clearInterval(t)
  }, [items.length])

  return (
    <>
      <div className="hp-testi-wrap">
        <div className="hp-testi-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {items.map(t => (
            <div className="hp-testi-card" key={t.name}>
              <div className="hp-testi-stars">
                {[...Array(5)].map((_, i) => <span key={i} className="hp-testi-star"></span>)}
              </div>
              <p className="hp-testi-quote">{t.text}</p>
              <p className="hp-testi-name">{t.name}</p>
              <p className="hp-testi-role">Valued Client</p>
            </div>
          ))}
        </div>
      </div>
      <div className="hp-testi-nav">
        {items.map((_, i) => (
          <button
            key={i}
            className={`hp-testi-dot${i === idx ? ' active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </>
  )
}

/*  GALLERY (auto-scroll marquee)  */
function Gallery({ images }) {
  const doubled = [...images, ...images]
  return (
    <section className="hp-gallery">
      <div className="hp-gallery-track">
        {doubled.map((src, i) => (
          <div className="hp-gallery-item" key={i}>
            <img src={src} alt="Portfolio" />
          </div>
        ))}
      </div>
    </section>
  )
}

/*  PAGE  */
function HomePage() {
  const heroSlides = [
    {
      id: 'hero-1',
      desktop: '/images/slide show/hero_1.png',
      mobile:  '/images/slide show/hero_1.png',
      title:   'Rose Gold Chrome Perfection',
      text:    "Honey Nails & Academy in Pune is a haven where beauty meets precision, offering luxurious nail art services tailored to bring out your natural radiance.",
    },
    {
      id: 'hero-2',
      desktop: '/images/slide show/hero_2.png',
      mobile:  '/images/slide show/hero_2.png',
      title:   'You Will Look Like a Goddess Every Day',
      text:    'Our expert team is trained in the latest beauty trends and techniques, ensuring every treatment is performed with exceptional care and stunning detail.',
    },
    {
      id: 'hero-3',
      desktop: '/images/slide show/hero_3.png',
      mobile:  '/images/slide show/hero_3.png',
      title:   'Art Beyond Imagination',
      text:    'We believe in a personalized approach to beauty, crafting unique nail art that enhances your style with premium products and safe, precise techniques.',
    },
    {
      id: 'hero-4',
      desktop: '/images/slide show/hero_4.png',
      mobile:  '/images/slide show/hero_4.png',
      title:   'Begin Your Beauty Journey Here',
      text:    "With our passion for aesthetics and commitment to excellence, Honey Nails & Academy is your trusted destination for transformative nail art experiences.",
    },
  ]

  const testimonials = [
    { name: 'Sneha P',  text: 'Not only was the end result beautiful, but it also gave me a sense of confidence and satisfaction. The staff ensured every detail was smooth and polished.' },
    { name: 'Ayisha',   text: "Honey Nails & Academy transformed my look with unmatched care and detail. The result was natural, defined, and exactly what I wanted." },
    { name: 'Kshipra',  text: 'I tried microblading with ombre shading, and the result was fantastic. The team made the whole experience comfortable and precise.' },
  ]

  const homePortfolio = [
    '/images/nails images/1.jpeg',  '/images/nails images/12.jpeg', '/images/nails images/13.jpeg',
    '/images/nails images/2.jpeg',  '/images/nails images/3.jpeg',   '/images/nails images/4.jpeg',
    '/images/nails images/5.jpeg',  '/images/nails images/6.jpeg',   '/images/nails images/7.jpeg',
    '/images/nails images/8.jpeg',  '/images/nails images/9.jpeg',   '/images/nails images/14.jpeg',
    '/images/nails images/15.jpeg', '/images/nails images/16.jpeg',
  ]

  return (
    <>
      <style>{CSS}</style>
      <main style={{ background: 'var(--warm)', fontFamily: "'DM Sans', sans-serif" }}>

        {/* HERO */}
        <Hero slides={heroSlides} />

        {/* ABOUT */}
        <Section className="hp-about">
          <div className="hp-about-grid">
            <div className="hp-about-text">
              <Eyebrow>About Us</Eyebrow>
              <h2 className="hp-section-title">Beauty is Crafted with<br /><em>Expertise</em></h2>
              <p className="hp-body-text">
                Honey Nails &amp; Academy in Pune is a haven where beauty meets
                precision, offering luxurious services tailored to bring out your natural radiance.
              </p>
              <div><Link to="/about" className="hp-btn hp-btn-dark">Read More </Link></div>
            </div>
            <div className="hp-about-card">
              <div className="hp-noise" />
              <h3 style={{ position: 'relative', zIndex: 1 }}>Specialized Nail<br /><em>Artistry</em></h3>
              <p className="stat" style={{ position: 'relative', zIndex: 1 }}>1000+ Happy Customers</p>
              <Link to="/appointment" className="hp-btn" style={{ position: 'relative', zIndex: 1 }}>Book Now </Link>
            </div>
          </div>
        </Section>

        {/* SERVICES */}
        <Section className="hp-services">
          <div className="hp-services-header">
            <Eyebrow>What We Offer</Eyebrow>
            <h2 className="hp-section-title">Our <em>Services</em></h2>
            <p>You Will Like To Look Like Goddess Every Day!</p>
          </div>
          <ServicesCarousel services={services} />
          <div className="hp-srv-center">
            <Link to="/nails" className="hp-btn hp-btn-ghost">See All Services </Link>
          </div>
        </Section>

        {/* SPECIALTY SECTION (Before/After) */}
        <SpecialtySection />

        {/* WHY US */}
        <Section className="hp-why">
          <div className="hp-why-grid">
            <div>
              <Eyebrow>Why Choose Us</Eyebrow>
              <h2 className="hp-section-title">Your Beauty Deserves<br /><em>Expert Care</em></h2>
              <p className="hp-body-text" style={{ marginTop: 14 }}>
                Choosing Honey Nails &amp; Academy means choosing a team dedicated to
                precision, safety, and the art of beauty.
              </p>
              <ul className="hp-why-list">
                {[
                  'Customized to meet your unique needs',
                  'We use highest-quality products',
                  'Ensure lasting and flawless results',
                  'More creative with smoothness and flexibility',
                  'Our every service exceeds your expectations',
                ].map(item => (
                  <li className="hp-why-item" key={item}>
                    <span className="hp-why-dot" />{item}
                  </li>
                ))}
              </ul>
              <div className="hp-why-btns">
                <Link to="/appointment" className="hp-btn">Appointment </Link>
                <Link to="/portfolio"   className="hp-btn hp-btn-dark">Portfolio </Link>
              </div>
            </div>
            <div className="hp-collage">
              <img src="/images/nails images/7.jpeg" alt="Why choose us 1" />
              <img src="/images/nails images/8.jpeg" alt="Why choose us 2" />
              <img src="/images/nails images/9.jpeg" alt="Why choose us 3" />
              <img src="/images/nails images/10.jpeg" alt="Why choose us 4" />
            </div>
          </div>
        </Section>

        {/* PARALLAX CTA */}
        <section className="hp-paralax">
          <div className="hp-noise" />
          <h2 style={{ position: 'relative' }}>Let our work <em>inspire</em> you</h2>
          <p style={{ position: 'relative' }}>the beauty possibilities</p>
          <Link to="/contact" className="hp-btn" style={{ position: 'relative' }}>Get In Touch </Link>
        </section>

        {/* PROCESS */}
        <Section className="hp-process">
          <div className="hp-process-grid">
            <div>
              <Eyebrow>Experience Seamless Results</Eyebrow>
              <h2 className="hp-section-title">Quality products to ensure<br /><em>Flawless results</em></h2>
            </div>
            <div className="hp-process-img">
              <img src="/images/nails images/11.jpeg" alt="Our process" />
            </div>
          </div>
        </Section>

        {/* TESTIMONIALS */}
        <Section className="hp-testi">
          <div className="hp-testi-header">
            <Eyebrow>Kind Words</Eyebrow>
            <h2 className="hp-section-title">What Our <em>Clients</em> Say</h2>
          </div>
          <Testimonials items={testimonials} />
        </Section>

        {/* GALLERY */}
        <Gallery images={homePortfolio} />

        {/* CTA BOTTOM */}
        <Section className="hp-cta">
          <div className="hp-cta-grid">
            <div className="hp-cta-call">
              <div className="hp-cta-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <h6>Call Us</h6>
                <p><a href="tel:+918087694723">+91 80876 94723</a></p>
              </div>
            </div>
            <div className="hp-cta-connect">
              <h6>Connect With Us</h6>
              <p>Get In Touch to Begin Your Beauty Journey</p>
              <div className="hp-email-row">
                <input type="email" placeholder="Enter your email address" />
                <button type="button">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Enquire
                </button>
              </div>
            </div>
          </div>
        </Section>

      </main>
    </>
  )
}

export default HomePage

