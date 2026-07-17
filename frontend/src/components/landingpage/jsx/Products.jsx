import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { addToCart } from '../../../utils/CartUtil';
import '../css/Products.css';

const Products = () => {
  const { cart, setCart } = useOutletContext(); // from PublicLayout

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/inventory');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
    setVisibleCount(3);
  }, [searchTerm, allProducts]);

  const handleAddToCart = (product) => {
    setCart(prev => addToCart(prev, product));
  };

  const loadMore = () => setVisibleCount(prev => prev + 3);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  if (loading) return <div className="products-loading">Loading products...</div>;

  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Our Products</h2>
        <p>Our solar products are engineered for Kenyan conditions – stable output, weather‑resistant, and backed by expert support. Choose quality that pays for itself.
        </p>
        <h4>Reliable, durable, and built to last</h4>
        <div className="searchbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </div>
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
        </div>

      <div className="products-grid">
        {visibleProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.status === 'offer' && (
              <span className="offer-badge">🔥 Offer</span>
            )}
            <div className="product-image">
              {product.image ? (
                <img src={`http://localhost:5000${product.image}`} alt={product.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">KSH {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="product-actions">
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

      {visibleProducts.length === 0 && (
        <div className="no-products">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default Products;