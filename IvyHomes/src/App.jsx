import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';

// Pages
import LoginPage from './pages/LoginPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import RentalsPage from './pages/RentalsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SavedPage from './pages/SavedPage';
import InsightsPage from './pages/InsightsPage';

// Layout
import PageLayout from './components/layout/PageLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {

  return (
    <AuthProvider>
      <SavedProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <PageLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ListingsPage />} />
              <Route path="listings/:id" element={<ListingDetailPage />} />
              
              <Route path="rentals" element={<RentalsPage />} />
              <Route path="rentals/:id" element={<ListingDetailPage isRental />} />
              
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:id" element={<ProjectDetailPage />} />
              
              <Route path="saved" element={<SavedPage />} />
              
              <Route path="insights" element={<InsightsPage />} />
            </Route>
          </Routes>
        </Router>
      </SavedProvider>
    </AuthProvider>
  );
}

export default App;
