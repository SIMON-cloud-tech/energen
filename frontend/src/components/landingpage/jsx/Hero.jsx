import { useNavigate } from 'react-router-dom';
import '../css/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">

          {/* MAIN HEADLINE */}
          <h2 className="hero-title">
            Power Your Future with Clean Solar Energy
          </h2>

          {/* SUBTEXT */}
          <p className="hero-subtitle">
            Energen delivers high‑quality solar solutions nationwide. 
            From residential installations to commercial projects, we help you 
            cut electricity costs, reduce carbon footprint, and gain energy independence.
          </p>

          {/* KEY BENEFITS */}
          <h4 className="marketing-strip">
            🌍 Eco‑Friendly  •  ⚡ Stable Power  •  💰 Lower Bills  •  🔋 Reliable
          </h4>

          {/* CTA BUTTONS */}
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