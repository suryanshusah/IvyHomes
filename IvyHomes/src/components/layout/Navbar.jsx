import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1.25rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'bold', fontSize: '1.5rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            I
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.025em' }}>
            Ivy<span style={{ color: 'var(--text-muted)' }}>Homes</span>
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { path: '/', label: 'Buy' },
            { path: '/rentals', label: 'Rent' },
            { path: '/projects', label: 'Projects' },
            { path: '/saved', label: 'Saved' },
            { path: '/insights', label: 'Insights' }
          ].map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path} 
                style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: isActive ? '600' : '500', 
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.2s'
                }} 
                onMouseEnter={(e) => !isActive && (e.target.style.color = 'var(--text-primary)')} 
                onMouseLeave={(e) => !isActive && (e.target.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user && (
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {user.email}
            </span>
          )}
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
