import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { addToCart } from '../../../utils/CartUtil';
import '../css/FeaturedProducts.css';

const FeaturedProducts = () => {
  const { cart, setCart } = useOutletContext();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/inventory');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setCart(prev => addToCart(prev, product));
  };

  if (loading) return <div className="featured-loading">Loading products...</div>;
  if (products.length === 0) return null;

  return (
    <section className="featured-section">
      <div className="featured-header">
        <div className="featured-header-content">
          <h2>Featured Products</h2>
          <p className="featured-subtitle">
            🌞 <strong>Reliable solar power starts here.</strong> Our systems cut your electricity 
            bills, protect you from blackouts, and reduce your carbon footprint. Each product is 
            built for durability, backed by expert support, and priced for real value — because 
            clean energy should be accessible to every home and business.
          </p>
        </div>
        <button className="view-all-btn" onClick={() => navigate('/products')}>
          View All →
        </button>
      </div>

      <div className="featured-grid">
        {products.map((product) => (
          <div key={product.id} className="featured-card">
            {product.status === 'offer' && (
              <span className="offer-badge">🔥 Offer</span>
            )}
            <div className="featured-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="featured-info">
              <h3>{product.name}</h3>
              <p className="featured-description">{product.description}</p>
             <p className="product-price">KSH {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="featured-actions">
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;