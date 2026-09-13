import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        setError('Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <Spinner size={48} />;
  
  if (error) return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--error)' }}>
      <h3>{error}</h3>
      <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>Go Back</Button>
    </div>
  );

  if (!project) return null;

  const formatLakhs = (lakhs) => {
    if (lakhs === undefined) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(lakhs * 100000);
  };

  const imageSeed = (project.project_id || 'home').replace(/[^a-zA-Z0-9]/g, '');

  return (
    <div>
      <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginBottom: '2rem', color: '#fff', background: 'rgba(255,255,255,0.1)' }}>
        ← Back to Results
      </Button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Massive Image Hero */}
        <div style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <img 
            src={`https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop&seed=${imageSeed}`} 
            alt="Project"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Badge variant={project.project_status === 'ready to move' ? 'success' : 'info'}>
                {project.project_status}
              </Badge>
              {project.developer_name && <Badge variant="default" style={{ background: 'rgba(255,255,255,0.1)' }}>By {project.developer_name}</Badge>}
            </div>
            <h1 style={{ fontSize: '3.5rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', textTransform: 'capitalize' }}>
              {project.apartment_name || project.project_name || `Project ${project.project_id}`}
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
              {project.locality}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Detailed Facts Grid */}
            <Card hover={false}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Project Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {project.total_units !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Units</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{project.total_units}</p>
                  </div>
                )}
                {project.total_towers !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Towers</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{project.total_towers}</p>
                  </div>
                )}
                {project.total_floors !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Floors</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{project.total_floors}</p>
                  </div>
                )}
                {project.launch_date && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Launch Date</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{new Date(project.launch_date).toLocaleDateString()}</p>
                  </div>
                )}
                {project.possession_date && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Possession Date</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{new Date(project.possession_date).toLocaleDateString()}</p>
                  </div>
                )}
                {project.rera_number && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>RERA Registration</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{project.rera_number}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Amenities Section */}
            {project.amenities && project.amenities.length > 0 && (
              <Card hover={false}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Amenities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {project.amenities.map((amenity, i) => (
                    <span key={i} style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)',
                      textTransform: 'capitalize',
                      fontSize: '0.9rem'
                    }}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Pricing Card */}
            <Card hover={false} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Price Range
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' }}>
                <p className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1' }}>
                  {formatLakhs(Math.min(project.price_min, project.price_max))}
                </p>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>to</p>
                <p className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700', lineHeight: '1' }}>
                  {formatLakhs(Math.max(project.price_min, project.price_max))}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-muted)' }}>Size Range</span>
                 <span style={{ fontWeight: '500' }}>{project.min_area_sqft} - {project.max_area_sqft} sqft</span>
              </div>
            </Card>

            {/* Total Listings Reference */}
            {project.total_listings !== undefined && (
              <Card hover={false} style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Listings Available</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>{project.total_listings}</p>
                <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.5rem' }}>* Note: This number may be inaccurate according to API checks.</p>
              </Card>
            )}
            
            {/* Project URL */}
            {project.project_url && (
              <Card hover={false} style={{ textAlign: 'center' }}>
                <a 
                  href={project.project_url}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  View on Ivy Homes →
                </a>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
