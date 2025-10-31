import { useAuth } from '../state/AuthContext.jsx';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const { user, setToken } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  return (
    <div className="navbar">
      <div className="brand">NIDS Dashboard</div>
      <div className="spacer" />
      <button className="ghost" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      {user && (
        <div className="nav-user">
          <span className="badge">{user.role}</span>
          <span className="username">{user.username}</span>
          <button onClick={() => setToken(null)}>Logout</button>
        </div>
      )}
    </div>
  );
}


