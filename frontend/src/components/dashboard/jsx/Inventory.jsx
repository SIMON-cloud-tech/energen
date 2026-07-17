import { useState, useEffect } from 'react';
import '../css/Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/inventory', {
        credentials: 'include' // sends the httpOnly cookie
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  if (loading) return <div className="inventory-loading">Loading inventory...</div>;

  return (
    <div className="inventory">
      <div className="inventory-header">
        {hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>

      <div className="inventory-grid">
        {visibleProducts.map(product => (
          <div key={product.id} className="inventory-card">
            <div className="inventory-image">
              {product.image ? (
                <img src={`http://localhost:5000${product.image}`} alt={product.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              <span className={`product-status ${product.status}`}>
                {product.status === 'offer' ? '🔥 Offer' : 'Normal'}
              </span>
            </div>
            <div className="inventory-info">
              <h3>{product.name}</h3>
              <p className="product-price">KSH {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="product-description">{product.description}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="no-inventory">
          <p>No products in inventory yet.</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;