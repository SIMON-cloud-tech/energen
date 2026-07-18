import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPackage, FiEdit, FiBox, FiSettings,
  FiLogOut, FiSun, FiMoon,
  FiMenu, FiX, FiFolder, FiStar,    
} from 'react-icons/fi';
import '../css/Dashboard.css';
import ProductManage from './ProductManage.jsx';
import BlogManage from './BlogManage.jsx';
import Inventory from './Inventory.jsx';
import ProjectManage from './ProjectManage.jsx';
import TestimonialsManage from './TestimonialManage.jsx';

const MENU_ICONS = {
  products: FiPackage,
  blog: FiEdit,
  inventory: FiBox,
  projects: FiFolder,
  testimonials: FiStar,    
};

const Dashboard = ({ setUser }) => {
  const navigate = useNavigate();

  const [activeMenuItem, setActiveMenuItem] = useState('products');
  const [theme, setTheme] = useState('light');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const menuItems = [
    { id: 'products', label: 'Product Management' },
    { id: 'blog', label: 'Blog Management' },
    { id: 'inventory', label: 'Inventory' },
    {id: 'projects', label: 'Project Management'},
    { id: 'testimonials', label: 'Testimonials' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', {
          credentials: 'include' // sends the httpOnly cookie
        });
        if (!res.ok) {
          // If not authenticated, redirect to login
          if (res.status === 401) {
            navigate('/auth');
            return;
          }
          throw new Error('Failed to fetch profile');
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    navigate('/auth');
  };

  // Render the correct component based on active menu item
  const renderContentPanel = () => {
    switch (activeMenuItem) {
      case 'products':
        return <ProductManage />;
      case 'blog':
        return <BlogManage />;
      case 'inventory':
        return <Inventory />;
      case 'projects':
        return <ProjectManage />
      case 'testimonials':
        return <TestimonialsManage />
      default:
        return <p>Section not found</p>;
    }
  };

  if (loading) return <div className="dashboard-status"><p>Loading dashboard...</p></div>;

  const activeLabel = menuItems.find((item) => item.id === activeMenuItem)?.label || 'Dashboard';


   // ── Time‑based greeting ──
      const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening'; 
     };

  return (
    <div className={`dashboard ${theme}`}>
      {/* Mobile hamburger */}
      <button
        className="mobile-hamburger"
        onClick={toggleMobileSidebar}
        aria-label={mobileSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${mobileSidebarOpen ? 'visible' : ''}`}
        onClick={closeMobileSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Dashboard</h2>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon = MENU_ICONS[item.id] || FiSettings;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${activeMenuItem === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveMenuItem(item.id);
                  closeMobileSidebar();
                }}
                title={item.label}
              >
                <span className="sidebar-icon"><Icon size={20} /></span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon"><FiLogOut size={20} /></span>
            <span className="sidebar-label">Logout</span>
          </button>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <span className="sidebar-icon">
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </span>
            <span className="sidebar-label">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <section className="dashboard-row">
          <div className="welcome-banner">
            <h1 className="welcome-title">{getGreeting()},  {profile?.name || 'User'}! 👋</h1>
          </div>
        </section>

        <section className="dashboard-row">
          <div className="content-panel full-width">
            <h3>{activeLabel}</h3>
            {renderContentPanel()}
          </div>
        </section>

        <footer className="dashboard-footer">
         <p>© {new Date().getFullYear()} Energen Systems &amp; General Supplies Ltd. All Rights Reserved.</p>
        <Link to="/" className="dashboard-footer-link">
         <p>Energy That Cares ☀️</p>
        </Link>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;