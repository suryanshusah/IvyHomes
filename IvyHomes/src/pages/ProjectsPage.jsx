import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import InfiniteScrollTrigger from '../components/features/InfiniteScrollTrigger';
import Spinner from '../components/ui/Spinner';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchProjects = useCallback(async (currentOffset, append = false) => {
    setIsLoading(true);
    try {
      const data = await getProjects(currentOffset, 50);
      
      if (append) {
        setProjects(prev => [...prev, ...data.results]);
      } else {
        setProjects(data.results);
      }
      
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(0, false);
  }, [fetchProjects]);

  useEffect(() => {
    if (offset > 0) {
      fetchProjects(offset, true);
    }
  }, [offset, fetchProjects]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setOffset(prev => prev + 50);
    }
  };

  const formatLakhs = (lakhs) => {
    if (lakhs === undefined) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(lakhs * 100000);
  };

  return (
    <div>
      <div style={{ 
        position: 'relative', 
        padding: '4rem 0 3rem 0',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.15) 0%, transparent 70%)'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
          Builder <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #34d399, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Projects.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore new and upcoming developments.
        </p>
      </div>

      {isInitialLoad ? (
        <Spinner size={48} />
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
            gap: '2rem' 
          }}>
            {projects.map((project, index) => (
              <Link to={`/projects/${project.project_id}`} key={`proj-${project.project_id}-${index}`} style={{ display: 'block' }}>
                <Card hover style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0, border: '1px solid var(--border-color)' }}>
                  
                  {/* Project Image Placeholder */}
                  <div style={{ height: '200px', background: 'var(--bg-tertiary)', position: 'relative' }}>
                    <img 
                      src={`https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop&seed=${project.project_id}`} 
                      alt="Project"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }} />
                    <h3 style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '1.5rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', textTransform: 'capitalize' }}>
                      {project.apartment_name || project.project_name || `Project ${project.project_id}`}
                    </h3>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <Badge variant={project.project_status === 'ready to move' ? 'success' : 'info'}>
                        {project.project_status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {project.locality}
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                      <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Developer</p>
                        <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{project.developer_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Possession</p>
                        <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{project.possession_date ? new Date(project.possession_date).getFullYear() : 'N/A'}</p>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Starting From</p>
                        <p className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '700', lineHeight: '1' }}>{formatLakhs(Math.min(project.price_min, project.price_max))}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <InfiniteScrollTrigger 
            onTrigger={loadMore} 
            hasMore={hasMore} 
            isLoading={isLoading} 
          />
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
