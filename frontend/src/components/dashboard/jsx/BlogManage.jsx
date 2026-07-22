import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../css/BlogManage.css';

const BlogManage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ← ADDED
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
    try {
      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('keywords', formData.keywords);
      if (formData.image) form.append('image', formData.image);

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: form
      });

      if (!res.ok) throw new Error('Failed to save');
      await fetchBlogs();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', keywords: '', image: null });
    setPreviewUrl('');
  };

  // ── UPDATED: no window.confirm, uses confirmDeleteId state instead ──
  const handleDelete = async (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id); // first click — show confirm
      return;
    }
    // second click — actually delete
    setConfirmDeleteId(null);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchBlogs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      description: blog.description,
      keywords: blog.keywords || '',
      image: null
    });
    setPreviewUrl(blog.image || '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const loadMore = () => setVisibleCount(prev => prev + 3);

  const visibleBlogs = blogs.slice(0, visibleCount);
  const hasMore = visibleCount < blogs.length;

  if (loading) return <div className="blog-loading">Loading blogs...</div>;

  return (
    <div className="project-manage">
      <div className="project-header">
        <div className="header-actions">
          {hasMore && (
            <button className="load-more-btn" onClick={loadMore}>
              Load More
            </button>
          )}
          <button className="add-btn" onClick={() => setShowForm(true)}>
            <FiPlus /> Write Blog
          </button>
        </div>
      </div>

      <div className="project-grid">
        {visibleBlogs.map((blog) => (
          <div key={blog.id} className="project-card">
            <div className="project-image">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="project-info">
              <h3>{blog.title}</h3>
              <p className="project-short">
                {blog.description && blog.description.length > 100
                  ? `${blog.description.substring(0, 100)}...`
                  : blog.description}
              </p>
              {blog.keywords && (
                <div className="blog-keywords">
                  {blog.keywords.split(',').map((kw, i) => (
                    <span key={i} className="keyword-tag">#{kw.trim()}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="project-actions">
              <button className="edit-btn" onClick={() => handleEdit(blog)}>
                <FiEdit /> Edit
              </button>
              {/* ── UPDATED: two-click delete, no window.confirm ── */}
              <button
                className="delete-btn"
                onClick={() => handleDelete(blog.id)}
              >
                <FiTrash2 /> {confirmDeleteId === blog.id ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleBlogs.length === 0 && (
        <div className="no-projects">
          <p>No blog posts yet. Click "Write Blog" to create one.</p>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Blog' : 'Write Blog'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content / Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="e.g. solar, energy, savings"
                />
              </div>
              <div className="form-group">
                <label>Blog Image</label>
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
                  {editingId ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManage;