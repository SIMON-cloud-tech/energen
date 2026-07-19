import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/ProjectsSection.css';

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Show only the first 3 projects
        setProjects(data.slice(0, 3));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="projects-loading">Loading projects...</div>;
  if (projects.length === 0) return null;

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h2 className="header">Signature Projects</h2>
        <p>Each project reflects our commitment to delivering reliable, high‑impact solar solutions for Kenya’s most trusted organizations.</p>
        <button className="view-all-btn" onClick={() => navigate('/projects')}>
          View All →
        </button>
      </div>

      <div className="projects-grid full-width">
        {projects.map((project) => (
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
              <Link to={`/projects/${project.id}`} className="read-more-btn">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;