import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/landingpage/jsx/Footer';
import Navbar from '../components/landingpage/jsx/Navbar';

const PublicLayout = () => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <Navbar cart={cart} setCart={setCart} cartCount={cartCount} />
      <main className="public-main">
        <Outlet context={{ cart, setCart }} />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;