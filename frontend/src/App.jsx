import { Routes, Route, Navigate } from 'react-router-dom';
// removed legacy unified Login
import Landing from './pages/Landing.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import UserLogin from './pages/UserLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { useAuth } from './state/AuthContext.jsx';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Landing />} />
      <Route path="/login-admin" element={<AdminLogin />} />
      <Route path="/login-user" element={<UserLogin />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


