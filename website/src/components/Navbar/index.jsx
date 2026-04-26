import { Link } from 'react-router-dom';
import { ShieldAlert, ExternalLink, LogIn } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          <ShieldAlert size={24} color="var(--accent-brand)" />
          CrisisSync
        </Link>
        <div className="nav-links">
          <Link to="#solutions" className="nav-link">Solutions</Link>
          <Link to="#how-it-works" className="nav-link">Platform</Link>
          <Link to="#compliance" className="nav-link">Compliance</Link>
          
          <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
            <a href="http://localhost:5174/" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              <LogIn size={16} /> Staff Portal
            </a>
            <a href="http://localhost:5173/" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Admin Console <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
