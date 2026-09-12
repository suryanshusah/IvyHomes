import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PageLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="container" style={{ flex: 1, padding: '2rem 1.5rem' }}>
        <Outlet />
      </main>
      
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto' }}>
        <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} Ivy Homes Frontend Assignment.
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
