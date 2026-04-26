export function Footer() {
  return (
    <footer>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="brand" style={{ marginBottom: 'var(--spacing-4)' }}>CrisisSync</div>
            <p className="footer-text" style={{ maxWidth: '300px' }}>
              We provide digital infrastructure for on-ground synchronization during critical incidents.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-12)' }}>
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-4)', color: 'white' }}>Platform</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://crisis-sync-jovf.vercel.app/" className="footer-text" style={{ textDecoration: 'none' }}>Admin Center</a>
                <a href="https://crisis-sync-usof.vercel.app/login" className="footer-text" style={{ textDecoration: 'none' }}>Staff PWA</a>
                <a href="#guest" className="footer-text" style={{ textDecoration: 'none' }}>Guest Access Map</a>
              </nav>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-4)', color: 'white' }}>Compliance</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="footer-text">Legal Notice</span>
                <span className="footer-text">Security Architecture</span>
                <span className="footer-text">Terms of Service</span>
              </nav>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 'var(--spacing-12)', paddingTop: 'var(--spacing-8)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="footer-text">© {new Date().getFullYear()} CrisisSync Solutions. All rights reserved.</p>
          <div className="footer-text" style={{ fontSize: '0.75rem', opacity: 0.6, maxWidth: '500px', textAlign: 'right' }}>
            <strong>WARNING:</strong> CrisisSync is an operational support tool. It does not replace legally mandated fire panels, 
            emergency service calls (e.g. 911), or physically certified wardens. Always adhere to building compliance laws.
          </div>
        </div>
      </div>
    </footer>
  );
}
