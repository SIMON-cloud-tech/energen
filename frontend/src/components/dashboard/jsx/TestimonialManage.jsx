import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../css/TestimonialsManage.css';

const TestimonialsManage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    text: ''
  });

  // ── Fetch testimonials ──
  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTestimonials(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ── Form handling ──
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Submit (add / update) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : '/api/testimonials';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save');
      await fetchTestimonials();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', text: '' });
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchTestimonials();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ── Edit – populate form ──
  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      location: testimonial.location || '',
      text: testimonial.text
    });
    setShowForm(true);
  };

  // ── Cancel ──
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  // ── Load more ──
  const loadMore = () => setVisibleCount(prev => prev + 3);

  const visibleTestimonials = testimonials.slice(0, visibleCount);
  const hasMore = visibleCount < testimonials.length;

  if (loading) return <div className="testimonials-loading">Loading testimonials...</div>;

  return (
    <div className="testimonials-manage">
      <div className="testimonials-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => setShowForm(true)}>
            <FiPlus /> Add Testimonial
          </button>
        </div>
      </div>

      {/* Testimonials Cards Grid */}
      <div className="testimonials-grid">
        {visibleTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-content">
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                {testimonial.location && (
                  <span className="testimonial-location">{testimonial.location}</span>
                )}
              </div>
            </div>
            <div className="testimonial-actions">
              <button className="edit-btn" onClick={() => handleEdit(testimonial)}>
                <FiEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(testimonial.id)}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleTestimonials.length === 0 && (
        <div className="no-testimonials">
          <p>No testimonials yet. Click "Add Testimonial" to create one.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location (optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Nairobi, Kenya"
                />
              </div>
              <div className="form-group">
                <label>Testimonial Text</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  rows="4"
                  required
                />
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

export default TestimonialsManage;