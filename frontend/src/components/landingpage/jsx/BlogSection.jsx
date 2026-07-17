import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/BlogSection.css';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    setVisibleCount(3);
  }, [searchTerm, filterDate]);

  const filteredBlogs = blogs.filter((blog) => {
    const titleMatch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    let dateMatch = true;
    if (filterDate) {
      const blogDate = new Date(blog.createdAt).toISOString().split('T')[0];
      dateMatch = blogDate === filterDate;
    }
    return titleMatch && dateMatch;
  });

  const loadMore = () => setVisibleCount((prev) => prev + 3);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  if (loading) return <div className="blog-loading">Loading articles...</div>;

  return (
    <section className="blog-section">
      {/* TOP ROW: Title + Load More */}
      <div className="blog-header">
        <div className='blog-head'>
        <h2>Solar Insights & News</h2>
        </div>
        <div className='loadmore'>
        {hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
        </div>
      </div>
      {/* FILTER ROW: Centered search bar + date */}
      <div className="blog-filters">
        <div className="filter-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="date-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          {filterDate && (
            <button className="clear-filter" onClick={() => setFilterDate('')}>
              ✕
            </button>
          )}
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="no-blogs">
          <p>No blogs match your search.</p>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {visibleBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <div className="blog-image">
                  {blog.image ? (
                    <img src={`http://localhost:5000${blog.image}`} alt={blog.title} />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}
                </div>
                <div className="blog-info">
                  <h3>{blog.title}</h3>
                  <p className="blog-excerpt">
                    {blog.description && blog.description.length > 100
                      ? `${blog.description.substring(0, 100)}...`
                      : blog.description}
                  </p>
                  {blog.keywords && (
                    <div className="blog-tags">
                      {blog.keywords.split(',').slice(0, 3).map((kw) => (
                        <span key={kw} className="tag">#{kw.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="blog-actions">
                  <Link to={`/blogs/${blog.id}`} className="read-more-btn">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {/* Load More at bottom (optional) – remove if you only want top button */}
        </>
      )}
    </section>
  );
};

export default BlogSection;