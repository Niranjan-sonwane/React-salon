const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500;700&display=swap');

  .ab-root,
  .ab-root * {
    box-sizing: border-box;
  }

  .ab-root {
    --ab-ink: #1a1510;
    --ab-warm: #fcfaf7;
    --ab-cream: #f6eee2;
    --ab-gold: #c4a166;
    --ab-muted: #72675d;
    --ab-border: rgba(26, 21, 16, 0.12);
    background: var(--ab-warm);
    color: var(--ab-ink);
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
  }

  .ab-hero {
    position: relative;
    overflow: hidden;
    padding: clamp(58px, 10vw, 124px) clamp(18px, 6vw, 72px) clamp(46px, 8vw, 92px);
    background:
      linear-gradient(120deg, rgba(26, 21, 16, 0.88), rgba(26, 21, 16, 0.52)),
      url('/images/nails images/1.jpeg') center/cover no-repeat;
  }

  .ab-hero-inner {
    max-width: 860px;
    margin: 0 auto;
    text-align: center;
  }

  .ab-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--ab-gold);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 10px;
    font-weight: 600;
  }

  .ab-kicker::before,
  .ab-kicker::after {
    content: '';
    width: 30px;
    height: 1px;
    background: currentColor;
    opacity: 0.5;
  }

  .ab-hero-title {
    margin-top: 16px;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 8vw, 88px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: #f8f2e9;
  }

  .ab-hero-sub {
    margin: 16px auto 0;
    max-width: 620px;
    color: rgba(248, 242, 233, 0.76);
    font-size: clamp(13px, 1.8vw, 16px);
    line-height: 1.8;
  }

  .ab-wrap {
    max-width: 1240px;
    margin: 0 auto;
    padding: clamp(32px, 6vw, 78px) clamp(14px, 4vw, 28px) clamp(64px, 8vw, 104px);
  }

  .ab-grid {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: clamp(20px, 3vw, 42px);
    align-items: center;
  }

  .ab-media {
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid var(--ab-border);
    box-shadow: 0 16px 38px rgba(26, 21, 16, 0.12);
    background: #fff;
  }

  .ab-media img {
    width: 100%;
    height: 100%;
    min-height: clamp(300px, 48vw, 560px);
    object-fit: cover;
    display: block;
  }

  .ab-content {
    background: linear-gradient(170deg, #ffffff, #fbf7f1);
    border: 1px solid var(--ab-border);
    border-radius: 22px;
    padding: clamp(20px, 4vw, 38px);
  }

  .ab-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 5vw, 54px);
    line-height: 1.03;
    margin: 0;
  }

  .ab-copy {
    margin-top: 12px;
    color: var(--ab-muted);
    font-size: clamp(13px, 1.6vw, 15px);
    line-height: 1.85;
  }

  .ab-stats {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .ab-stat {
    border: 1px solid var(--ab-border);
    background: #fff;
    border-radius: 14px;
    padding: 14px 12px;
    text-align: center;
  }

  .ab-stat strong {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 3vw, 30px);
    color: #4f2318;
  }

  .ab-stat span {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #7a6e61;
  }

  .ab-values {
    margin-top: clamp(30px, 5vw, 52px);
    border-top: 1px solid var(--ab-border);
    padding-top: clamp(22px, 4vw, 34px);
  }

  .ab-values-title {
    margin: 0;
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(24px, 4vw, 40px);
  }

  .ab-values-grid {
    margin-top: 14px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .ab-value {
    border: 1px solid var(--ab-border);
    background: var(--ab-cream);
    border-radius: 14px;
    padding: 14px;
  }

  .ab-value strong {
    display: block;
    font-size: 13px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #4f2318;
  }

  .ab-value p {
    margin: 7px 0 0;
    font-size: 13px;
    line-height: 1.7;
    color: #6f6459;
  }

  @media (max-width: 1080px) {
    .ab-grid { grid-template-columns: 1fr; }
    .ab-media img { min-height: clamp(260px, 55vw, 430px); }
  }

  @media (max-width: 760px) {
    .ab-stats { grid-template-columns: 1fr 1fr; }
    .ab-values-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 460px) {
    .ab-stats { grid-template-columns: 1fr; }
    .ab-content,
    .ab-media { border-radius: 16px; }
    .ab-kicker::before,
    .ab-kicker::after { width: 16px; }
  }
`

function AboutPage() {
  return (
    <>
      <style>{styles}</style>

      <main className="ab-root page-content">
        <section className="ab-hero">
          <div className="ab-hero-inner">
            <p className="ab-kicker">Honey Nails &amp; Academy</p>
            <h1 className="ab-hero-title">About Us</h1>
            <p className="ab-hero-sub">
              We blend modern beauty techniques with a personalized salon experience,
              creating polished, confident looks that feel uniquely yours.
            </p>
          </div>
        </section>

        <section className="ab-wrap">
          <div className="ab-grid">
            <figure className="ab-media">
              <img src="/images/nails images/2.jpeg" alt="About Honey Nails & Academy" loading="lazy" />
            </figure>

            <article className="ab-content">
              <h2 className="ab-title">Where Beauty is Crafted with Expertise and Care</h2>
              <p className="ab-copy">
                At Honey Nails &amp; Academy, every treatment is designed around your features,
                your comfort, and your desired finish. Our team focuses on precision,
                hygiene, and consistent quality in every session.
              </p>
              <p className="ab-copy">
                From nails and lashes to advanced beauty services, we use premium
                products and proven methods to deliver long-lasting, elegant results.
              </p>

              <div className="ab-stats">
                <div className="ab-stat"><strong>1000+</strong><span>Happy Clients</span></div>
                <div className="ab-stat"><strong>8+</strong><span>Signature Services</span></div>
                <div className="ab-stat"><strong>7 Days</strong><span>Open Weekly</span></div>
              </div>
            </article>
          </div>

          <div className="ab-values">
            <h3 className="ab-values-title">What Defines Us</h3>
            <div className="ab-values-grid">
              <div className="ab-value">
                <strong>Precision</strong>
                <p>Detailed work that balances artistry and technical perfection.</p>
              </div>
              <div className="ab-value">
                <strong>Hygiene</strong>
                <p>Strict sanitation and safety standards for every appointment.</p>
              </div>
              <div className="ab-value">
                <strong>Personalization</strong>
                <p>Every service is tailored to your style, tone, and preferences.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default AboutPage

