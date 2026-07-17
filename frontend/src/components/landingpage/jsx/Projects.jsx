import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Projects.css';

const Projects = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setAllProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter projects when search term changes
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      setFilteredProjects(allProjects);
    } else {
      const filtered = allProjects.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.client.toLowerCase().includes(term) ||
        p.shortDescription.toLowerCase().includes(term)
      );
      setFilteredProjects(filtered);
    }
    setVisibleCount(3); // reset visible count when filtering
  }, [searchTerm, allProjects]);

  const loadMore = () => setVisibleCount(prev => prev + 3);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  if (loading) return <div className="projects-loading">Loading projects...</div>;

  return (
    <section className="projects-page">
      {/* Header row: title left, load more right */}
      <div className="projects-header">
        <h2>Our Projects</h2>
        {hasMore && (
          <button className="load-more-btn" onClick={loadMore}>
            Load More
          </button>
        )}
      </div>

      {/* Search bar – centered, 60% width */}
      <div className="projects-search-wrapper">
        <input
          type="text"
          className="projects-search-input"
          placeholder="Search by title, client, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="no-projects">
          <p>No projects match your search.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {visibleProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                {project.image ? (
                  <img src={`http://localhost:5000${project.image}`} alt={project.title} />
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
                <Link to={`/projects/${project.id}`} className="read-more-btn">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;