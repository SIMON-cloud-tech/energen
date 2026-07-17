import { FiHome, FiFileText, FiZap } from 'react-icons/fi';
import '../css/Process.css';

const Process = () => {
  const steps = [
    {
      icon: <FiHome size={36} />,
      title: 'Consult & Assess',
      description: 'We evaluate your energy needs and site conditions – roof space, sun exposure, and load requirements.'
    },
    {
      icon: <FiFileText size={36} />,
      title: 'Design & Quote',
      description: 'We create a custom solar plan and provide a transparent, no‑obligation quote.'
    },
    {
      icon: <FiZap size={36} />,
      title: 'Install & Energize',
      description: 'Our certified team installs, connects, and hands over your system – you start saving immediately.'
    }
  ];

  return (
    <section className="process-section">
      <h2 className="process-title">How It Works</h2>
      <div className="process-grid">
        {steps.map((step, index) => (
          <div key={index} className="process-step">
            <div className="step-icon">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Process;