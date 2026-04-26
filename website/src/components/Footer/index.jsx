import { Link } from 'react-router-dom';
import { roleLinks } from '../../siteConfig';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link to="/" className="brand footer__brand">CrisisSync</Link>
          <p className="footer-text">
            Enterprise emergency coordination infrastructure for hospitality, healthcare, retail, and corporate venues.
          </p>
        </div>

        <nav aria-label="Platform">
          <h2>Platform</h2>
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/solutions">Solutions</Link>
          <Link to="/compliance">Compliance</Link>
        </nav>

        <nav aria-label="Access">
          <h2>Access</h2>
          <a href={roleLinks.admin.production} target="_blank" rel="noreferrer">Admin Portal</a>
          <a href={roleLinks.staff.production} target="_blank" rel="noreferrer">Staff Access</a>
          <Link to="/guest-access">Guest Access</Link>
          <Link to="/demo">Demo Environment</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="footer__notice">
          <h2>Safety Notice</h2>
          <p>
            CrisisSync is an operational coordination tool. It does not replace legally mandated fire safety systems, emergency service dispatch, certified wardens, or building compliance inspections. Venues remain fully responsible for their legal safety obligations.
          </p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} CrisisSync. All rights reserved.</span>
        <span>Enterprise venue emergency coordination.</span>
      </div>
    </footer>
  );
}
