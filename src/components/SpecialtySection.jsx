import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SpecialtySection() {
  const navigate = useNavigate()
  const [sliderPos, setSliderPos] = useState(50)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.min(Math.max(x, 0), 100))
  }

  return (
    <section className="ll-specialty">
      <div className="ll-specialty-container">
        {/* Left Content */}
        <div className="ll-specialty-content">
          <div className="ll-specialty-eyebrow">
            <span className="ll-line"></span>
            OUR SPECIALITY
          </div>
          <h2 className="ll-specialty-title">
            Unveil Your Beauty with <br />
            <span>Flawless Precision</span>
          </h2>
          <p className="ll-specialty-text">
            We pride ourselves on delivering personalized beauty treatments that use 
            premium products selected to suit diverse preferences and enhance your comfort.
          </p>
          <button 
            className="ll-specialty-btn"
            onClick={() => navigate('/portfolio')}
          >
            KNOW MORE
          </button>
        </div>

        {/* Right Comparison Slider */}
        <div className="ll-specialty-comparison">
          <div 
            className="ll-comparison-wrapper"
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => handleMouseMove(e.touches[0])}
          >
            {/* After Image (Primary) */}
            <div className="ll-comparison-after">
              <img src="/images/nails images/4.jpeg" alt="After treatment" />
            </div>

            {/* Before Image (Overlayed / Clipped) */}
            <div 
              className="ll-comparison-before"
              style={{ width: `${sliderPos}%` }}
            >
              <img src="/images/nails images/2.jpeg" alt="Before treatment" />
            </div>

            {/* Slider Line / Handle */}
            <div 
              className="ll-comparison-handle"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="ll-handle-circle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 8L22 12L18 16M6 16L2 12L6 8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ll-specialty {
          background: #1a1510;
          padding: 100px 0;
          color: #efe5d6;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }
        .ll-specialty-container {
          max-width: 1320px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: center;
          padding: 0 40px;
        }
        
        .ll-specialty-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c8a96e;
          margin-bottom: 32px;
        }
        .ll-line {
          width: 40px;
          height: 1px;
          background: #c8a96e;
        }
        
        .ll-specialty-title {
          font-size: clamp(36px, 4vw, 54px);
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 24px;
          line-height: 1.15;
          color: #fff;
        }
        .ll-specialty-title span {
          color: #c8a96e;
          font-style: italic;
        }
        
        .ll-specialty-text {
          font-size: 16px;
          line-height: 1.7;
          opacity: 0.7;
          margin-bottom: 40px;
          max-width: 480px;
        }
        
        .ll-specialty-btn {
          padding: 14px 34px;
          background: #c8a96e;
          color: #1a1510;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .ll-specialty-btn:hover {
          background: #fff;
          transform: translateY(-2px);
        }

        /* COMPARISON SLIDER CRITICAL STYLES */
        .ll-comparison-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          overflow: hidden;
          user-select: none;
          cursor: ew-resize;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        
        .ll-comparison-after,
        .ll-comparison-before {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
        }
        
        .ll-comparison-before {
          overflow: hidden;
          border-right: 2px solid #c8a96e;
          z-index: 2;
        }
        
        .ll-comparison-after img,
        .ll-comparison-before img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        /* Forces the before image to stay full width so clipping works on container */
        .ll-comparison-before img {
          position: absolute;
          width: auto;
          height: 100%;
          max-width: none;
        }

        .ll-comparison-handle {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #c8a96e;
          z-index: 10;
          pointer-events: none;
          transform: translateX(-50%);
        }
        
        .ll-handle-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: #c8a96e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1510;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
          border: 4px solid #1a1510;
        }

        @media (max-width: 900px) {
          .ll-specialty-container { grid-template-columns: 1fr; gap: 40px; padding: 0 20px; }
          .ll-specialty { padding: 80px 0; }
          .ll-specialty-content { text-align: center; }
          .ll-specialty-eyebrow { justify-content: center; }
          .ll-specialty-text { margin-left: auto; margin-right: auto; }
          .ll-comparison-wrapper { aspect-ratio: 1; }
        }
      `}</style>
    </section>
  )
}
