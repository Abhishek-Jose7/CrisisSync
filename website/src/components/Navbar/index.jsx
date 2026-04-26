import { NavLink } from 'react-router-dom';
import { Building2, ExternalLink, ShieldAlert } from 'lucide-react';
import { roleLinks } from '../../siteConfig';

const navItems = [
  { to: '/platform', label: 'Platform' },
  { to: '/roles', label: 'Role Access' },
  { to: '/compliance', label: 'Compliance' },
  { to: '/demo', label: 'Demo' },
];

export function Navbar() {
  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="container navbar__inner">
        <NavLink to="/" className="brand" aria-label="CrisisSync home">
          <ShieldAlert size={24} />
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
          <a className="btn btn-outline btn-small" href={roleLinks.staff.production} target="_blank" rel="noreferrer">
            Staff <ExternalLink size={15} />
          </a>
          <a className="btn btn-primary btn-small" href={roleLinks.admin.production} target="_blank" rel="noreferrer">
            <Building2 size={15} /> Admin
          </a>
        </div>
      </div>
    </nav>
  );
}
