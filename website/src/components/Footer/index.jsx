import { Link } from 'react-router-dom';
import { roleLinks } from '../../siteConfig';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link to="/" className="brand footer__brand">CrisisSync</Link>
          <p className="footer-text">
            Digital coordination infrastructure for venue teams during critical incidents.
          </p>
        </div>

        <nav aria-label="Production portals">
          <h2>Production</h2>
          <a href={roleLinks.admin.production} target="_blank" rel="noreferrer">Admin portal</a>
          <a href={roleLinks.staff.production} target="_blank" rel="noreferrer">Staff PWA</a>
          <a href={roleLinks.guest.production} target="_blank" rel="noreferrer">Guest scanner</a>
        </nav>

        <nav aria-label="Website pages">
          <h2>Website</h2>
          <Link to="/platform">Platform</Link>
          <Link to="/roles">Role Access</Link>
          <Link to="/demo">Demo URLs</Link>
          <Link to="/compliance">Compliance</Link>
        </nav>

        <div className="footer__notice">
          <h2>Safety Notice</h2>
          <p>
            CrisisSync is an operational support tool. It does not replace legally mandated safety systems, emergency service calls, or certified wardens.
          </p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} CrisisSync.</span>
        <span>Demo and production routes are intentionally separate.</span>
      </div>
    </footer>
  );
}
