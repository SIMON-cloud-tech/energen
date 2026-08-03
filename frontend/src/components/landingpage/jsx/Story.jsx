import { useEffect, useRef } from 'react';
import '../css/Story.css';
import aboutImage from '/about.webp'; // Convert to WebP!

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
            <strong>Energen Systems & General Supplies Ltd.</strong>is a trusted solar energy company in Kenya 
            specializing in solar lighting and installation, solar water pumps for farms in Thika and Gatundu,
             solar hot water systems for households in Kiambu estates like Ruiru and Githunguri, and solar 
             power backup solutions for Nairobi businesses in Westlands, Industrial Area, and Buruburu. 
            Our expertise ensures reliable, affordable, and sustainable energy for both urban and rural communities.
          </p>
          <p>
            Founded in <strong>2020</strong>,Energen has rapidly expanded 
            its services and successfully installed solar 
            systems in over 500 homes, schools, 
            and institutions across Nairobi, Kiambu, 
            and Thika. From residential rooftops 
            in Kasarani and South B, to commercial 
            projects in Donholm and Kitengela, and 
            rural installations in Limuru and Juja, 
            we continue to power communities with clean energy while 
            reducing electricity costs and promoting sustainable living.
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