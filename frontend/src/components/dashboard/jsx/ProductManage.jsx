import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../css/ProductManage.css';

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    status: 'normal',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/inventory?t=${Date.now()}`,  {
        credentials: 'include'
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🟢 Form submitted!');  // <-- ADD THIS
    console.log('🟢 Editing ID:', editingId)
    try {
      const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
      const method = editingId ? 'PUT' : 'POST';
      console.log('🟢 URL:', url, 'Method:', method); 

      const form = new FormData();
      form.append('name', formData.name);
      form.append('price', formData.price);
      form.append('description', formData.description);
      form.append('status', formData.status);
      if (formData.image) form.append('image', formData.image);

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: form
      });

      if (!res.ok) throw new Error('Failed to save');
      
      // ⬇️ ⬇️ ⬇️ FETCH PRODUCTS CALL 1 ⬇️ ⬇️ ⬇️
      await fetchProducts();  // <-- Refresh product list after add/update
      
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', status: 'normal', image: null });
    setPreviewUrl('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      
      // ⬇️ ⬇️ ⬇️ FETCH PRODUCTS CALL 2 ⬇️ ⬇️ ⬇️
      await fetchProducts();  // <-- Refresh product list after delete
      
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      status: product.status || 'normal',
      image: null
    });
    setPreviewUrl(product.image || '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const loadMore = () => setVisibleCount(prev => prev + 3);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  if (loading) return <div className="product-loading">Loading products...</div>;

  return (
    <div className="product-manage">
      <div className="product-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => setShowForm(true)}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      <div className="product-grid">
        {visibleProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              <span className={`product-status ${product.status}`}>
                {product.status === 'offer' ? '🔥 Offer' : 'Normal'}
              </span>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">KSH {Number(product.price).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="product-description">{product.description}</p>
            </div>
            <div className="product-actions">
              <button className="edit-btn" onClick={() => handleEdit(product)}>
                <FiEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="no-products">
          <p>No products yet. Click "Add Product" to create one.</p>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="normal">Normal</option>
                  <option value="offer">Offer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="image-upload"
                    className="file-upload-input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="image-upload" className="file-upload-label">
                    <FiPlus /> Choose Image
                  </label>
                  {formData.image && (
                    <span className="file-name">{formData.image.name}</span>
                  )}
                  {!formData.image && previewUrl && !editingId && (
                    <span className="file-name">Image selected</span>
                  )}
                  {editingId && previewUrl && !formData.image && (
                    <span className="file-name">Current image (replace)</span>
                  )}
                </div>
                {previewUrl && (
                  <div className="image-preview">
                    <img src={previewUrl} alt="Preview" />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingId ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManage;