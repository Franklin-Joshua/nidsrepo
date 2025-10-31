import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../state/AuthContext.jsx';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/auth/login', {
        username,
        password
      });
      const role = res?.data?.user?.role;
      if (role !== 'admin') {
        setError('Please use the correct login page for your role.');
        return;
      }
      setToken(res.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="login-hero">
      <div className="container" style={{ maxWidth: 520, width: '100%' }}>
        <div className="card login-card">
          <h1>Admin Login</h1>
          <form onSubmit={onSubmit} className="form">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            {error && <div className="error">{error}</div>}
            <button type="submit" className="primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}


