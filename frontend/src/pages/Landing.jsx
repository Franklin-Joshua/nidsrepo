import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="login-hero landing">
      <div className="container" style={{ maxWidth: 520, width: '100%' }}>
        <div className="card login-card" style={{ textAlign: 'center' }}>
          <h1>Welcome to NIDS</h1>
          <p className="hint">Choose your portal</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 12 }}>
            <Link to="/login-admin"><button className="primary">Admin Login</button></Link>
            <Link to="/login-user"><button className="primary">User Login</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}


