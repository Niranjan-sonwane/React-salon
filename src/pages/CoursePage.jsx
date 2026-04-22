import { useBooking } from "../context/BookingContext"
import SEO from "../components/SEO"

export default function CoursePage() {
  const { course } = useBooking()

  if (!course) {
    return (
      <div className="course-loading">
        <div className="course-container">
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title={course.title} 
        description={`Professional beauty course: ${course.description}. Learn from experts at Dazzler Beauty Academy.`}
        canonicalUrl="/courses"
      />
      <div className="course-page">
      <section className="course-hero">
        <div className="course-hero__overlay" />
        <div className="course-container">
          <div className="course-hero__content">
            <span className="course-hero__eyebrow">Academy Training</span>
            <h1 className="course-hero__title">{course.title}</h1>
            <p className="course-hero__sub">{course.description}</p>
            <div className="course-hero__badges">
              <span className="course-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                {course.duration}
              </span>
              <span className="course-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M18 7a4 4 0 1 0-3 6.87"/></svg>
                Instructor: {course.instructor}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="course-details">
        <div className="course-container">
          <div className="course-grid">
            {/* Syllabus */}
            <div className="course-card">
              <div className="course-card__head">
                <h2 className="course-card__title">
                  <span className="course-card__icon">📚</span>
                  Comprehensive Syllabus
                </h2>
              </div>
              <ul className="course-syllabus-list">
                {course.syllabus.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Pricing & Timing */}
            <div className="course-sidebar">
              <div className="course-card course-card--pricing">
                <div className="course-card__head">
                  <h2 className="course-card__title">
                    <span className="course-card__icon">💰</span>
                    Course Pricing
                  </h2>
                </div>
                <div className="course-pricing-stack">
                  <div className="course-pricing-item">
                    <div className="course-pricing-label">Full Professional Kit Included</div>
                    <div className="course-pricing-val">{course.pricing.withKit}</div>
                  </div>
                  <div className="course-pricing-item">
                    <div className="course-pricing-label">Training Only (Practice Material Provided)</div>
                    <div className="course-pricing-val">{course.pricing.withoutKit}</div>
                  </div>
                </div>
              </div>

              <div className="course-card">
                <div className="course-card__head">
                  <h2 className="course-card__title">
                    <span className="course-card__icon">⏱️</span>
                    Timing & Info
                  </h2>
                </div>
                <div className="course-info-list">
                  <div className="course-info-item">
                    <strong>Sessions:</strong>
                    <span>{course.timing}</span>
                  </div>
                  <div className="course-info-item">
                    <strong>Additional Care:</strong>
                    <span>{course.additional}</span>
                  </div>
                </div>
                <div className="course-cta">
                  <a href="https://wa.me/918087694723" target="_blank" rel="noopener noreferrer" className="course-cta-btn">Enquire Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .course-page {
          background: #fffaf6;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }
        .course-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .course-hero {
          position: relative;
          padding: 100px 0 80px;
          background-image: url('https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80\u0026w=2070\u0026auto=format\u0026fit=crop');
          background-size: cover;
          background-position: center;
          color: #fff;
          overflow: hidden;
        }
        .course-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(26,21,16,0.92) 0%, rgba(79, 35, 24, 0.75) 100%);
        }
        .course-hero__content {
          position: relative;
          max-width: 700px;
        }
        .course-hero__eyebrow {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c8a96e;
          margin-bottom: 16px;
        }
        .course-hero__title {
          font-size: clamp(32px, 5vw, 56px);
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 20px;
          line-height: 1.1;
        }
        .course-hero__sub {
          font-size: 18px;
          opacity: 0.85;
          margin-bottom: 32px;
        }
        .course-hero__badges {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .course-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
        }

        .course-details {
          padding: 60px 0 100px;
        }
        .course-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: start;
        }
        .course-card {
          background: #fff;
          border: 1px solid rgba(79, 35, 24, 0.1);
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(26,21,16,0.04);
        }
        .course-card__head {
          margin-bottom: 24px;
        }
        .course-card__title {
          font-size: 20px;
          font-family: 'Cormorant Garamond', serif;
          color: #1a1510;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .course-syllabus-list {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .course-syllabus-list li {
          font-size: 15px;
          color: #4a3f37;
          padding-left: 24px;
          position: relative;
        }
        .course-syllabus-list li::before {
          content: '✔';
          position: absolute;
          left: 0;
          color: #c8a96e;
          font-weight: bold;
        }

        .course-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .course-pricing-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .course-pricing-item {
          padding: 16px;
          background: #fdfaf5;
          border: 1px dashed #c8a96e;
          border-radius: 12px;
        }
        .course-pricing-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9c845e;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .course-pricing-val {
          font-size: 1.1rem;
          color: #1a1510;
          font-weight: 700;
        }
        .course-info-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }
        .course-info-item {
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .course-info-item strong { color: #1a1510; }
        .course-info-item span { color: #5c534a; }
        
        .course-cta-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 16px;
          background: #1a1510;
          color: #fdfcfa;
          text-decoration: none;
          font-weight: 600;
          border-radius: 12px;
          transition: background 0.2s;
        }
        .course-cta-btn:hover { background: #c8a96e; color: #1a1510; }

        @media (max-width: 900px) {
          .course-grid { grid-template-columns: 1fr; }
          .course-syllabus-list { grid-template-columns: 1fr; }
          .course-hero { padding: 60px 0 60px; }
        }
      `}</style>
    </div>
    </>
  )
}
