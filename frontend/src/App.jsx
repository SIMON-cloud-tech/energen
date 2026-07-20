import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';
import Loader from './components/landingpage/jsx/Loader';
// Layouts
import PublicLayout from './layouts/PublicLayout';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './components/landingpage/jsx/Products';
import Projects from './components/landingpage/jsx/Projects';
import ProjectDetail from './components/landingpage/jsx/ProjectDetail';
import BlogDetail from './components/landingpage/jsx/BlogDetail';
import BlogSection from './components/landingpage/jsx/BlogSection';

// Admin / Auth
import Auth from './components/dashboard/jsx/Auth';
import Reset from './components/dashboard/jsx/Reset';
import Dashboard from './components/dashboard/jsx/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  //Add a loading spinner to show a spinnner while loading
  if (loading) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#1a2a6c'
    }}>
      <Oval
        height={80}
        width={80}
        color="#f39c12"
        secondaryColor="#2ecc71"
        ariaLabel="loading"
        strokeWidth={5}
      />
      <p style={{ color: 'white', marginTop: '20px', fontFamily: 'Arial' }}>
        Loading...
      </p>
    </div>
  );
  }

  const isAuthenticated = !!user;

  return (
    <Routes>
      {/* ===== PUBLIC ROUTES (with Navbar + Footer) ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/blogs" element={<BlogSection />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Route>

      {/* ===== HIDDEN ADMIN LOGIN ===== */}
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Auth setUser={setUser} />
          )
        }
      />

      {/* ===== PASSWORD RESET ===== */}
      <Route path="/reset" element={<Reset />} />

      {/* ===== PROTECTED DASHBOARD ===== */}
      <Route
        path="/dashboard/*"
        element={
          isAuthenticated ? (
            <Dashboard setUser={setUser} />
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;