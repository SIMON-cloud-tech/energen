import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import '../css/ProjectManage.css';

const ProjectManage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    shortDescription: '',
    longDescription: '',
    procedure: '',
    location: '',
    year: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
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
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const form = new FormData();
      form.append('title', formData.title);
      form.append('client', formData.client);
      form.append('shortDescription', formData.shortDescription);
      form.append('longDescription', formData.longDescription);
      form.append('procedure', formData.procedure);
      form.append('location', formData.location);
      form.append('year', formData.year);
      if (formData.image) form.append('image', formData.image);

      const res = await fetch(url, {
        method,
        credentials: 'include',
        body: form
      });

      if (!res.ok) throw new Error('Failed to save');
      await fetchProjects();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      shortDescription: '',
      longDescription: '',
      procedure: '',
      location: '',
      year: '',
      image: null
    });
    setPreviewUrl('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      client: project.client,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription || '',
      procedure: project.procedure || '',
      location: project.location || '',
      year: project.year || '',
      image: null
    });
    setPreviewUrl(project.image || '');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const loadMore = () => setVisibleCount(prev => prev + 3);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  if (loading) return <div className="project-loading">Loading projects...</div>;

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
            <FiPlus /> Add Project
          </button>
        </div>
      </div>

      <div className="project-grid">
        {visibleProjects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image">
              {project.image ? (
                <img src={project.image}  alt={project.title} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p className="project-client">Client: {project.client}</p>
              <p className="project-short">{project.shortDescription}</p>
            </div>
            <div className="project-actions">
              <button className="edit-btn" onClick={() => handleEdit(project)}>
                <FiEdit /> Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(project.id)}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleProjects.length === 0 && (
        <div className="no-projects">
          <p>No projects yet. Click "Add Project" to create one.</p>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Project' : 'Add Project'}</h3>
              <button className="close-modal" onClick={handleCancel}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Long Description</label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Procedure / Steps</label>
                <textarea
                  name="procedure"
                  value={formData.procedure}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2023"
                />
              </div>
              <div className="form-group">
                <label>Project Image</label>
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

export default ProjectManage;