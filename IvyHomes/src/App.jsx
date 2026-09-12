import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {

  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
    </AuthProvider>
  )
}

export default App
