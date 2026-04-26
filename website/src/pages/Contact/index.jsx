import { useState } from 'react';
import { Send } from 'lucide-react';
import { orgTypes } from '../../siteConfig';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Contact & Demo Request</span>
          <h1>Schedule a walkthrough or request deployment.</h1>
          <p>
            Contact us to schedule a live demonstration, discuss deployment requirements for your venue type, or ask questions about CrisisSync integration.
          </p>
        </div>

        <div className="split">
          <div>
            {!submitted ? (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-name">Full Name</label>
                    <input type="text" id="contact-name" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-email">Work Email</label>
                    <input type="email" id="contact-email" placeholder="you@company.com" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contact-org">Organization Name</label>
                    <input type="text" id="contact-org" placeholder="Organization name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact-type">Organization Type</label>
                    <select id="contact-type">
                      <option value="">Select type...</option>
                      {orgTypes.map(org => (
                        <option key={org.id} value={org.id}>{org.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="contact-role">Your Role</label>
                  <input type="text" id="contact-role" placeholder="e.g. Safety Manager, Operations Director" />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" placeholder="Tell us about your deployment needs, venue structure, or questions..." rows={5} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Send size={16} /> Submit Request
                </button>
              </form>
            ) : (
              <div className="info-card" style={{ textAlign: 'center', padding: '48px 32px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>✓</div>
                <h3 style={{ marginTop: '0' }}>Request received</h3>
                <p>We will review your inquiry and respond within 24 hours. For urgent deployment questions, refer to the documentation in the demo environment.</p>
              </div>
            )}
          </div>

          <div>
            <div className="info-card" style={{ marginBottom: '16px' }}>
              <h3 style={{ marginTop: 0, fontSize: '1rem' }}>What to expect</h3>
              <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Live walkthrough of the Admin command center</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Zone configuration for your venue type</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>QR deployment strategy discussion</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Staff onboarding and role assignment review</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Compliance and liability boundary review</li>
              </ul>
            </div>
            <div className="info-card">
              <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Deployment requirements</h3>
              <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Venue floor plan or zone map</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Staff roster with shift information</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Existing emergency procedures document</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>IT contact for Firebase project setup</li>
                <li style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Building compliance officer sign-off</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
