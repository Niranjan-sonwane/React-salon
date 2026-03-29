import { Link, useParams } from 'react-router-dom'
import { services } from '../data/services'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sp-root,
  .sp-root * {
    box-sizing: border-box;
  }

  .sp-root {
    --sp-ink: #1a1510;
    --sp-cream: #f8f4ee;
    --sp-warm: #fcfaf7;
    --sp-gold: #c5a164;
    --sp-gold-soft: rgba(197, 161, 100, 0.16);
    --sp-muted: #74695f;
    --sp-border: rgba(26, 21, 16, 0.12);
    --sp-shadow: 0 18px 46px rgba(26, 21, 16, 0.14);
    background: var(--sp-warm);
    color: var(--sp-ink);
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
  }

  .sp-shell {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 clamp(16px, 4vw, 26px);
  }

  .sp-hero {
    position: relative;
    overflow: hidden;
    padding: clamp(56px, 10vw, 120px) clamp(18px, 6vw, 78px) clamp(50px, 8vw, 94px);
    background:
      linear-gradient(115deg, rgba(26, 21, 16, 0.88), rgba(26, 21, 16, 0.46)),
      var(--sp-hero-image) center/cover no-repeat;
  }

  .sp-hero::before {
    content: '';
    position: absolute;
    right: -80px;
    top: -90px;
    width: clamp(200px, 34vw, 420px);
    height: clamp(200px, 34vw, 420px);
    border-radius: 50%;
    border: 1px solid rgba(197, 161, 100, 0.22);
  }

  .sp-hero::after {
    content: '';
    position: absolute;
    left: -130px;
    bottom: -130px;
    width: clamp(180px, 28vw, 320px);
    height: clamp(180px, 28vw, 320px);
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(197, 161, 100, 0.2), rgba(197, 161, 100, 0));
  }

  .sp-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 820px;
    margin: 0 auto;
    text-align: center;
  }

  .sp-tag {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 10px;
    font-weight: 500;
    color: var(--sp-gold);
  }

  .sp-tag::before,
  .sp-tag::after {
    content: '';
    width: 30px;
    height: 1px;
    background: currentColor;
    opacity: 0.55;
  }

  .sp-title {
    margin-top: 16px;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 8vw, 88px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    font-weight: 500;
    color: #f8f3eb;
  }

  .sp-sub {
    margin: 14px auto 0;
    max-width: 540px;
    color: rgba(248, 243, 235, 0.76);
    font-size: clamp(13px, 1.8vw, 16px);
    line-height: 1.8;
  }

  .sp-body {
    padding: clamp(34px, 6vw, 72px) 0 clamp(60px, 8vw, 100px);
  }

  .sp-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: clamp(22px, 3vw, 42px);
    align-items: center;
  }

  .sp-media {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid var(--sp-border);
    box-shadow: var(--sp-shadow);
    background: #fff;
  }

  .sp-media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(26, 21, 16, 0.2), rgba(26, 21, 16, 0));
    pointer-events: none;
  }

  .sp-media img {
    width: 100%;
    height: 100%;
    min-height: clamp(300px, 50vw, 560px);
    object-fit: cover;
    display: block;
  }

  .sp-content {
    background: linear-gradient(170deg, #ffffff, #fbf7f1);
    border: 1px solid var(--sp-border);
    border-radius: 22px;
    padding: clamp(22px, 4vw, 38px);
    box-shadow: 0 10px 28px rgba(26, 21, 16, 0.08);
  }

  .sp-kicker {
    text-transform: uppercase;
    letter-spacing: 0.17em;
    font-size: 10px;
    color: var(--sp-gold);
    font-weight: 600;
  }

  .sp-heading {
    margin-top: 10px;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 4.8vw, 54px);
    line-height: 1.03;
    letter-spacing: -0.01em;
    color: var(--sp-ink);
  }

  .sp-copy {
    margin-top: 12px;
    display: grid;
    gap: 12px;
  }

  .sp-copy p {
    margin: 0;
    font-size: clamp(13px, 1.6vw, 15px);
    line-height: 1.8;
    color: var(--sp-muted);
  }

  .sp-points {
    margin-top: 18px;
    display: grid;
    gap: 10px;
  }

  .sp-point {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: #5e554c;
    line-height: 1.6;
  }

  .sp-point-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--sp-gold);
    margin-top: 6px;
    flex-shrink: 0;
  }

  .sp-actions {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .sp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 18px;
    text-decoration: none;
    border-radius: 999px;
    border: 1px solid transparent;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.13em;
    font-weight: 600;
    transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
  }

  .sp-btn-primary {
    background: #4f2318;
    color: #fff;
  }

  .sp-btn-primary:hover {
    background: #653223;
    color: #fff;
    transform: translateY(-1px);
  }

  .sp-btn-ghost {
    border-color: var(--sp-border);
    color: var(--sp-ink);
    background: #fff;
  }

  .sp-btn-ghost:hover {
    border-color: #7b5138;
    color: #7b5138;
  }

  .sp-more {
    margin-top: clamp(34px, 5vw, 54px);
    border-top: 1px solid var(--sp-border);
    padding-top: clamp(24px, 4vw, 36px);
  }

  .sp-more-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .sp-more-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 3.2vw, 36px);
    color: var(--sp-ink);
  }

  .sp-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .sp-chip {
    text-decoration: none;
    border: 1px solid var(--sp-border);
    color: #5f5347;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    border-radius: 999px;
    padding: 8px 12px;
    background: #fff;
    transition: all 0.2s ease;
  }

  .sp-chip:hover {
    border-color: #7b5138;
    color: #7b5138;
    background: var(--sp-gold-soft);
  }

  .sp-not-found {
    min-height: 55vh;
    display: grid;
    place-items: center;
    padding: clamp(30px, 8vw, 80px) 16px;
  }

  .sp-not-found-card {
    width: min(560px, 100%);
    border: 1px solid var(--sp-border);
    border-radius: 20px;
    padding: clamp(24px, 5vw, 42px);
    text-align: center;
    background: #fff;
  }

  .sp-not-found-card h2 {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5.8vw, 52px);
  }

  .sp-not-found-card p {
    margin: 10px 0 20px;
    color: var(--sp-muted);
    line-height: 1.75;
  }

  @media (max-width: 1080px) {
    .sp-grid {
      grid-template-columns: 1fr;
    }

    .sp-media img {
      min-height: clamp(270px, 55vw, 430px);
    }
  }

  @media (max-width: 680px) {
    .sp-tag::before,
    .sp-tag::after {
      width: 18px;
    }

    .sp-content,
    .sp-media {
      border-radius: 16px;
    }

    .sp-actions {
      display: grid;
      grid-template-columns: 1fr;
    }

    .sp-btn {
      width: 100%;
    }
  }

  @media (max-width: 420px) {
    .sp-shell {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
`

function ServicePage() {
  const { slug } = useParams()
  const normalizedSlug = (slug || '').toLowerCase()
  const service = services.find(
    (item) => item.slug === normalizedSlug || item.aliases?.includes(normalizedSlug),
  )
  const relatedServices = services.filter((item) => item.slug !== service?.slug)
  const highlights = [
    'Personalized consultation for your skin tone, style, and preference.',
    'Premium products and hygiene-first techniques for safe, lasting results.',
    'Designed to balance beauty, comfort, and long-term maintenance.',
  ]

  if (!service) {
    return (
      <>
        <style>{css}</style>
        <main className="sp-root page-content">
          <section className="sp-not-found">
            <div className="sp-not-found-card">
              <h2>Service not found</h2>
              <p>The requested service is unavailable. Explore all services from the home page.</p>
              <Link to="/" className="sp-btn sp-btn-primary">
                Back to Home
              </Link>
            </div>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <style>{css}</style>
      <main className="sp-root page-content">
        <section
          className="sp-hero"
          style={{ '--sp-hero-image': `url(${service.bannerImage || '/images/banner/about.jpg'})` }}
        >
          <div className="sp-hero-inner">
            <p className="sp-tag">Honey Nails &amp; Academy</p>
            <h1 className="sp-title">{service.title}</h1>
            <p className="sp-sub">{service.shortDescription}</p>
          </div>
        </section>

        <section className="sp-body">
          <div className="sp-shell">
            <div className="sp-grid">
              <div className="sp-media">
                <img src={service.detailImage || service.image} alt={service.title} />
              </div>

              <div className="sp-content">
                <p className="sp-kicker">Signature Treatment</p>
                <h2 className="sp-heading">{service.title} Services</h2>

                <div className="sp-copy">
                  {service.descriptions?.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>

                <div className="sp-points">
                  {highlights.map((item) => (
                    <div className="sp-point" key={item}>
                      <span className="sp-point-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="sp-actions">
                  <Link to="/appointment" className="sp-btn sp-btn-primary">
                    Book Appointment
                  </Link>
                  <Link to="/contact" className="sp-btn sp-btn-ghost">
                    Talk to Us
                  </Link>
                </div>
              </div>
            </div>

            <div className="sp-more">
              <div className="sp-more-header">
                <h3 className="sp-more-title">Explore More Services</h3>
                <div className="sp-chips">
                  {relatedServices.map((item) => (
                    <Link to={`/${item.slug}`} key={item.slug} className="sp-chip">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default ServicePage

