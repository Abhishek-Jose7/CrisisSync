import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, Building2, Users, MapPin, Play, ChevronDown } from 'lucide-react';
import { roleLinks } from '../../siteConfig';

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/compliance', label: 'Compliance' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [demoOpen, setDemoOpen] = useState(false);
  const demoRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (demoRef.current && !demoRef.current.contains(e.target)) {
        setDemoOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="container navbar__inner">
        <NavLink to="/" className="brand" aria-label="CrisisSync home">
          <ShieldAlert size={22} />
          <span>CrisisSync</span>
        </NavLink>

        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {/* Role Access Buttons */}
          <a className="btn btn-ghost btn-small" href={roleLinks.guest.production} target="_blank" rel="noreferrer" title="Guest Access">
            <MapPin size={14} /> Guest
          </a>
          <a className="btn btn-ghost btn-small" href={roleLinks.staff.production} target="_blank" rel="noreferrer" title="Staff Login">
            <Users size={14} /> Staff
          </a>
          <a className="btn btn-outline btn-small" href={roleLinks.admin.production} target="_blank" rel="noreferrer" title="Admin Login">
            <Building2 size={14} /> Admin
          </a>

          {/* Demo Dropdown */}
          <div className="demo-dropdown" ref={demoRef}>
            <button
              className="btn btn-demo btn-small"
              onClick={() => setDemoOpen(!demoOpen)}
              aria-expanded={demoOpen}
              aria-haspopup="true"
            >
              <Play size={12} /> Demo <ChevronDown size={12} className={`demo-chevron ${demoOpen ? 'open' : ''}`} />
            </button>
            {demoOpen && (
              <div className="demo-dropdown__menu" role="menu">
                <div className="demo-dropdown__header">Try Demo Environments</div>
                <a
                  className="demo-dropdown__item"
                  href={roleLinks.admin.demo}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => setDemoOpen(false)}
                >
                  <Building2 size={16} />
                  <div>
                    <strong>Admin Demo</strong>
                    <span>Command center with seeded data</span>
                  </div>
                </a>
                <a
                  className="demo-dropdown__item"
                  href={roleLinks.staff.demo}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => setDemoOpen(false)}
                >
                  <Users size={16} />
                  <div>
                    <strong>Staff Demo</strong>
                    <span>Warden zone dashboard</span>
                  </div>
                </a>
                <a
                  className="demo-dropdown__item"
                  href={roleLinks.guest.demo}
                  target="_blank"
                  rel="noreferrer"
                  role="menuitem"
                  onClick={() => setDemoOpen(false)}
                >
                  <MapPin size={16} />
                  <div>
                    <strong>Guest Demo</strong>
                    <span>QR zone safety interface</span>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
