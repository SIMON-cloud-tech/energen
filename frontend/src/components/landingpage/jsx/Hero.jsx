import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Lazy load animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hero-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h2 className="hero-title">
            Power Your Future with Clean Solar Energy
          </h2>

          <p className="hero-subtitle">
            Energen delivers high‑quality solar solutions nationwide.
            From residential installations to commercial projects, we help you
            cut electricity costs, reduce carbon footprint, and gain energy independence.
          </p>

          <h4 className="marketing-strip">
            🌍 Eco‑Friendly  •  ⚡ Stable Power  •  💰 Lower Bills  •  🔋 Reliable
          </h4>

          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Explore Solutions
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;