import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTiktok,
  
} from 'react-icons/fa';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
       {/* ── ENERGEN WATERMARK ── */}
      <div className="footer-watermark">
        <span className="footer-watermark-text">ENERGEN</span>
      </div>
      <div className="footer-container">

        {/* TOP SECTION */}
        <div className="footer-top">

          {/* BUSINESS INFO */}
          <div>
            <h2 className="footer-title main">Energen</h2>
            <p className="footer-text">
              Powering Kenya with clean, reliable solar energy — reaching beyond
              Nairobi’s estates into rural communities in Thika, Juja, Gatundu,
              Limuru, and Githunguri in Kiambu. From homesteads and schools to
              small trading centers, we supply and install solar solutions that
              help families and institutions cut costs and embrace sustainable living.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className="footer-title small">Quick Links</h2>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
            </ul>
          </div>

          {/* HOURS & LOCATION */}
          <div>
            <h2 className="footer-title small">Working Hours</h2>
            <div className="footer-hours">
              <p>Mon – Fri: 8AM – 6PM</p>
              <p>Saturday: 9AM – 4PM</p>
              <p>Sunday: Closed</p>
            </div>

            <div className="footer-location">
              <h2 className="footer-title small">Location</h2>
              <p>Nairobi CBD Cookie House</p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="footer-middle">

          {/* SOCIALS */}
          <div>
            <h2 className="footer-title small">Follow Us On</h2>
            <div className="footer-socials">
              <a href="https://www.facebook.com/share/18JMsrLyF2/" className="social-icon"><FaFacebook /></a>
              <a href="https://vm.tiktok.com/ZS9rAK5PoeQtf-dD3rW/" className="social-icon"><FaTiktok /></a>
            </div>
          </div>

          {/* WHATSAPP */}
        </div>

        {/* BOTTOM */}
        <div className="footer-bottom">
           <p>© {new Date().getFullYear()} Energen Systems &amp; General Supplies Ltd.All Rights Reserved.
           </p>
          <p> Energy That Cares{' '}<Link to="/admin" className="admin-sun-icon" aria-label="Admin login">☀️</Link>
         </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;