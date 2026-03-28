import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf-root,
  .pf-root * {
    box-sizing: border-box;
  }

  .pf-root {
    --pf-ink: #1a1510;
    --pf-cream: #f7f3ed;
    --pf-warm: #fcfaf7;
    --pf-gold: #c4a166;
    --pf-gold-soft: rgba(196, 161, 102, 0.18);
    --pf-muted: #7a7065;
    --pf-border: rgba(26, 21, 16, 0.12);
    --pf-shadow: 0 22px 54px rgba(26, 21, 16, 0.15);
    background: var(--pf-warm);
    color: var(--pf-ink);
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
  }

  .pf-hero {
    position: relative;
    overflow: hidden;
    padding: clamp(62px, 11vw, 132px) clamp(20px, 6vw, 88px) clamp(52px, 9vw, 106px);
    background:
      linear-gradient(120deg, rgba(26, 21, 16, 0.86), rgba(26, 21, 16, 0.56)),
      url('/images/nails images/1.jpeg') center/cover no-repeat;
  }

  .pf-hero::before {
    content: '';
    position: absolute;
    right: -90px;
    top: -110px;
    width: clamp(220px, 35vw, 450px);
    height: clamp(220px, 35vw, 450px);
    border-radius: 50%;
    border: 1px solid rgba(196, 161, 102, 0.2);
  }

  .pf-hero::after {
    content: '';
    position: absolute;
    right: -40px;
    top: -60px;
    width: clamp(160px, 28vw, 340px);
    height: clamp(160px, 28vw, 340px);
    border-radius: 50%;
    border: 1px solid rgba(196, 161, 102, 0.12);
  }

  .pf-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 860px;
    margin: 0 auto;
    text-align: center;
  }

  .pf-tag {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--pf-gold);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 11px;
    font-weight: 500;
  }

  .pf-tag::before,
  .pf-tag::after {
    content: '';
    width: 34px;
    height: 1px;
    background: currentColor;
    opacity: 0.45;
  }

  .pf-title {
    margin-top: 18px;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 8vw, 92px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    font-weight: 500;
    color: #f8f3ec;
  }

  .pf-subtitle {
    margin: 16px auto 0;
    max-width: 540px;
    font-size: clamp(13px, 1.8vw, 16px);
    color: rgba(248, 243, 236, 0.72);
    line-height: 1.75;
  }

  .pf-body {
    max-width: 1240px;
    margin: 0 auto;
    padding: clamp(28px, 5.5vw, 70px) clamp(16px, 4vw, 28px) clamp(60px, 7vw, 96px);
  }

  .pf-anchor {
    scroll-margin-top: 105px;
  }

  .pf-intro {
    display: grid;
    grid-template-columns: 1.2fr auto;
    gap: 20px;
    align-items: end;
    margin-bottom: clamp(26px, 4vw, 38px);
  }

  .pf-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 4.1vw, 50px);
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: var(--pf-ink);
    margin: 0;
  }

  .pf-copy {
    margin-top: 8px;
    max-width: 640px;
    color: var(--pf-muted);
    font-size: clamp(13px, 1.7vw, 15px);
    line-height: 1.8;
  }

  .pf-badge {
    border: 1px solid var(--pf-border);
    background: linear-gradient(165deg, #ffffff, #f6eee2);
    color: var(--pf-ink);
    padding: 12px 16px;
    border-radius: 100px;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    box-shadow: 0 7px 16px rgba(26, 21, 16, 0.07);
  }

  .pf-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: clamp(10px, 1.5vw, 16px);
    grid-auto-flow: dense;
  }

  .pf-card {
    grid-column: span 3;
    position: relative;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid var(--pf-border);
    background: #fff;
    box-shadow: 0 8px 22px rgba(26, 21, 16, 0.08);
    aspect-ratio: 4 / 5;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .pf-card.is-wide {
    grid-column: span 6;
    aspect-ratio: 16 / 9;
  }

  .pf-card.is-tall {
    grid-row: span 2;
    aspect-ratio: 4 / 9;
  }

  .pf-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s ease, filter 0.55s ease;
  }

  .pf-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(26, 21, 16, 0.38), rgba(26, 21, 16, 0.02));
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .pf-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--pf-shadow);
  }

  .pf-card:hover img {
    transform: scale(1.05);
    filter: saturate(1.08);
  }

  .pf-card:hover::after {
    opacity: 1;
  }

  @media (max-width: 1100px) {
    .pf-card { grid-column: span 4; }
    .pf-card.is-wide { grid-column: span 8; }
    .pf-card.is-tall { grid-row: auto; aspect-ratio: 4 / 5; }
  }

  @media (max-width: 820px) {
    .pf-intro {
      grid-template-columns: 1fr;
      align-items: start;
      gap: 12px;
    }

    .pf-grid {
      grid-template-columns: repeat(6, 1fr);
    }

    .pf-card { grid-column: span 3; }
    .pf-card.is-wide { grid-column: span 6; }
  }

  @media (max-width: 580px) {
    .pf-tag::before,
    .pf-tag::after {
      width: 18px;
    }

    .pf-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .pf-card,
    .pf-card.is-tall {
      grid-column: span 1;
      aspect-ratio: 4 / 5;
      border-radius: 14px;
    }

    .pf-card.is-wide {
      grid-column: span 2;
      aspect-ratio: 16 / 10;
      border-radius: 14px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pf-card,
    .pf-card img,
    .pf-card::after {
      transition: none;
    }
  }
`

function PortfolioPage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
    }
  }, [hash])

  const nailArtItems = [
    '/images/nails images/1.jpeg',
    '/images/nails images/2.jpeg',
    '/images/nails images/3.jpeg',
    '/images/nails images/4.jpeg',
    '/images/nails images/5.jpeg',
    '/images/nails images/6.jpeg',
    '/images/nails images/7.jpeg',
    '/images/nails images/8.jpeg',
    '/images/nails images/9.jpeg',
  ]

  const jewelleryItems = [
    '/images/nails images/10.jpeg',
    '/images/nails images/11.jpeg',
    '/images/nails images/12.jpeg',
    '/images/nails images/13.jpeg',
    '/images/nails images/14.jpeg',
    '/images/nails images/15.jpeg',
    '/images/nails images/16.jpeg',
    '/images/nails images/17.jpeg',
  ]

  const tileClass = (index) => {
    if (index % 7 === 0 || index % 11 === 0) return 'pf-card is-wide'
    if (index % 5 === 0) return 'pf-card is-tall'
    return 'pf-card'
  }

  return (
    <>
      <style>{css}</style>
      <main className="pf-root page-content">
        <section className="pf-hero">
          <div className="pf-hero-inner">
            <p className="pf-tag">Dazzler Beauty Signature Work</p>
            <h1 className="pf-title">Portfolio</h1>
            <p className="pf-subtitle">
              Every frame reflects precision artistry, luxury finishes, and results designed to elevate your personal style.
            </p>
          </div>
        </section>

        <section className="pf-body pf-anchor" id="nail-art">
          <div className="pf-intro">
            <div>
              <h2 className="pf-heading">Nail Art</h2>
              <p className="pf-copy">
                Explore detailed nail art transformations featuring clean lines, sculpted finishes, and signature designs.
              </p>
            </div>
            <span className="pf-badge">9 Selected Works</span>
          </div>

          <div className="pf-grid">
            {nailArtItems.map((src, index) => (
              <figure className={tileClass(index)} key={src}>
                <img src={src} alt={`Portfolio ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section className="pf-body pf-anchor" id="jewellery">
          <div className="pf-intro">
            <div>
              <h2 className="pf-heading">Jewellery</h2>
              <p className="pf-copy">
                View jewellery styling looks with elegant detailing and polished visual balance across each design.
              </p>
            </div>
            <span className="pf-badge">8 Selected Works</span>
          </div>

          <div className="pf-grid">
            {jewelleryItems.map((src, index) => (
              <figure className={tileClass(index)} key={src}>
                <img src={src} alt={`Jewellery ${index + 1}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default PortfolioPage

