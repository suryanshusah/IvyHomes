import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';

import LoginPage from './pages/LoginPage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';

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
            }></Route>

            <Route index element={<ListingsPage />} />
            <Route path="listings/:id" element={<ListingDetailPage />} />


          </Routes>
        </Router>
      </SavedProvider>
    </AuthProvider>
  )
}

export default App
