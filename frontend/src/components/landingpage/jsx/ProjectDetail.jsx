import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../../SEO/Seo';
import '../css/ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="project-detail-loading">Loading...</div>;
  if (!project) return <div className="project-detail-notfound">Project not found</div>;

  return (
    <>
      <SEO
        title={project.title}
        description={project.shortDescription || project.longDescription || 'Energen solar project details.'}
        ogImage={project.image}
        keywords="solar project, renewable energy, Kenyan solar installation"
      />
      <div className="project-detail">
      <Link to="/projects" className="back-link">← Back to Projects</Link>

      <div className="project-detail-content">
        <div className="project-detail-image">
          {project.image ? (
           <img src={project.image}  alt={project.title} />
          ) : (
            <div className="placeholder-image">No Image</div>
          )}
        </div>

        <div className="project-detail-info">
          <h1>{project.title}</h1>
          <p className="detail-client"><strong>Client:</strong> {project.client}</p>
          {project.location && <p className="detail-location"><strong>Location:</strong> {project.location}</p>}
          {project.year && <p className="detail-year"><strong>Year:</strong> {project.year}</p>}

          <div className="detail-description">
            <h3>Overview</h3>
            <p>{project.longDescription}</p>
          </div>

          {project.procedure && (
            <div className="detail-procedure">
              <h3>Procedure / Steps</h3>
              <p>{project.procedure}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectDetail;