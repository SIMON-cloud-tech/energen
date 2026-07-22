import { useEffect, useRef } from 'react';
import '../css/Story.css';
import aboutImage from '../../../../public/about.jpeg'; // Convert to WebP!

const Story = () => {
  const sectionRef = useRef(null);

  // Lazy load animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mvv-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.mvv-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* ── HERO / INTRO SECTION ── */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h1>About Energen</h1>
          <p>Powering Kenya with sustainable solar solutions since 2010.</p>
        </div>
      </section>

      {/* ── COMPANY INFO + IMAGE ── */}
      <section className="about-content">
        <div className="about-image">
          <img 
            src={aboutImage} 
            alt="Energen Company" 
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            <strong>Energen Systems & General Supplies Ltd.</strong> is a company 
            that specializes in Solar Lighting & Installation, Solar Water Pumps, 
            Solar Hot Water, and Solar Power Backup Systems, amongst others.
          </p>
          <p>
            Founded in <strong>2010</strong>, Energen has expanded its services 
            and has since successfully installed over <strong>500 homes and 
            institutions</strong> across the country.
          </p>
          <p className="tagline">⚡ Energy That Cares</p>
        </div>
      </section>

      {/* ── MISSION, VISION, VALUES ── */}
      <section className="about-mvv" ref={sectionRef}>
        <div className="mvv-card">
          <h3>🎯 Mission</h3>
          <p>
            Empowering communities to opt for a sustainable and greener lifestyle 
            through innovative energy solutions.
          </p>
        </div>
        <div className="mvv-card">
          <h3>🔭 Vision</h3>
          <p>
            Dedicated to the execution of renewable energy projects focused 
            in Kenya and East Africa.
          </p>
        </div>
        <div className="mvv-card">
          <h3>⭐ Core Values</h3>
          <ul>
            <li>Quality</li>
            <li>Professionalism</li>
            <li>Commitment</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Story;