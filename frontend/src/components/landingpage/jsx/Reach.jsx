import { useState, useCallback, memo } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import '../css/Contact.css';

// ── Config ──
const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254727713219';
const MAP_EMBED =
  import.meta.env.VITE_MAP_EMBED_URL ||
  'https://www.google.com/maps?q=Nextgen+Mall+Mombasa+Road+Nairobi&z=15&output=embed';

// ── Contact Details ──
const CONTACT_DETAILS = [
  {
    id: 'location',
    label: 'Locations',
    value: 'Nextgen Mall, Mombasa Road & Rubby Mall, Nairobi CBD',
    href: 'https://maps.google.com/?q=Nextgen+Mall+Mombasa+Road+Nairobi',
    icon: <FaMapMarkerAlt />,
  },
  {
    id: 'phone',
    label: 'Phone / WhatsApp',
    value: '+254 727 713 219 | +254 579 573 792',
    href: 'tel:+254727713219',
    icon: <FaPhone />,
  },
  {
    id: 'email',
    label: 'Email',
    value: 'info@energen.co.ke',
    href: 'mailto:info@energen.co.ke',
    icon: <FaEnvelope />,
  },
  {
    id: 'website',
    label: 'Website',
    value: 'www.energen.co.ke',
    href: 'https://www.energen.co.ke',
    icon: <FaGlobe />,
  },
];

const WORKING_HOURS = [
  { day: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM – 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

// ── Row Component ──
const DetailRow = memo(({ icon, label, value, href }) => (
  <a href={href} className="detail-row" target="_blank" rel="noopener noreferrer">
    <span className="detail-row__icon">{icon}</span>
    <span>
      <strong>{label}</strong>
      <p>{value}</p>
    </span>
  </a>
));

const EMPTY_FORM = { name: '', phone: '', email: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    const text = `
Hi Energen Team 👋

I'm interested in solar solutions.

My details:
• Name: ${form.name}
• Phone: ${form.phone}
• Email: ${form.email || 'N/A'}

My enquiry:
${form.message}

Please advise on availability, pricing, and installation timeline.

Looking forward to your reply ☀️
`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setSubmitted(true);
    setForm(EMPTY_FORM);
    setTimeout(() => setSubmitted(false), 3000);
  }, [form]);

  return (
    <section className="contact-section">
      {/* HEADER */}
      <div className="contact-header">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">
          Ready to switch to solar? Reach out to us for a free consultation 
          and a custom quote tailored to your energy needs.
        </p>
      </div>

      {/* BODY */}
      <div className="contact-body">

        {/* LEFT */}
        <div className="contact-left">
          <h3>Contact & Office Info</h3>

          <div>
            {CONTACT_DETAILS.map(d => (
              <DetailRow key={d.id} {...d} />
            ))}
          </div>

          <div className="hours-card">
            <h4>Working Hours</h4>
            {WORKING_HOURS.map(w => (
              <p key={w.day}>{w.day}: {w.hours}</p>
            ))}
          </div>

          <div className="delivery-areas">
            <h4>Service Areas</h4>
            <p>Nairobi, Kiambu, Machakos, Kajiado, Nakuru, Kisumu, and nationwide.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="contact-right">
          <h3>Request a Quote</h3>

          {submitted && (
            <p className="success">✓ WhatsApp opened — we'll get back to you shortly ☀️</p>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address (optional)"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              name="message"
              placeholder="Tell us about your solar needs (e.g., home, business, backup, water pumping)"
              value={form.message}
              onChange={handleChange}
              required
            />
            <button type="submit">
              Send on WhatsApp ☀️
            </button>
          </form>
        </div>

      </div>

      {/* MAP */}
      <div className="contact-map">
        <iframe src={MAP_EMBED} title="Office Location" loading="lazy" />
      </div>

    </section>
  );
};

export default Contact;