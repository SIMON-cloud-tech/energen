import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/LatestBlogs.css';

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Show only the 3 most recent blogs
        setBlogs(data.slice(0, 3));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="latest-loading">Loading articles...</div>;
  if (blogs.length === 0) return null;

  return (
    <section className="latest-blogs">
      <div className="latest-header">
        <h2>Latest Solar Insights</h2>
        <button className="view-all-link" onClick={() => navigate('/blogs')}>
          View All →
        </button>
      </div>

      <div className="latest-grid">
        {blogs.map((blog) => (
          <div key={blog.id} className="latest-card">
            <div className="latest-image">
              {blog.image ? (
                <img src={`${import.meta.env.VITE_IMAGE_BASE_URL || ''}${blog.image}`} alt={blog.title} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="latest-info">
              <h3>{blog.title}</h3>
              <p className="latest-excerpt">
                {blog.description && blog.description.length > 80
                  ? `${blog.description.substring(0, 80)}...`
                  : blog.description}
              </p>
              <Link to={`/blogs/${blog.id}`} className="read-more-link">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestBlogs;