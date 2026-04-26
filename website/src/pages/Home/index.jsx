import { ShieldCheck, Map, Activity, Users } from 'lucide-react';

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <span className="hero-tag">Enterprise Safety Infrastructure</span>
          <h1>Unified Emergency<br />Coordination Platform</h1>
          <p>
            The operational central nervous system for hotels, hospitals, and commercial venues.
            Synchronize wardens, automate escalations, and issue precise guest guidance in real-time.
          </p>
          <div className="hero-actions">
            <a href="https://crisis-sync-jovf.vercel.app/onboarding" className="btn btn-primary" style={{ height: '48px', padding: '0 32px' }} target="_blank" rel="noopener noreferrer">
              Start Organization Onboarding
            </a>
            <a href="https://crisis-sync-jovf.vercel.app/demo" className="btn btn-outline" style={{ height: '48px', padding: '0 32px', borderColor: 'var(--accent-brand)', color: 'var(--accent-brand)' }} target="_blank" rel="noopener noreferrer">
              Interactive Live Demo
            </a>
            <a href="#sales" className="btn btn-outline" style={{ height: '48px', padding: '0 32px' }}>
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Trust / Features Section */}
      <section className="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>Built for Operational Certainty</h2>
            <p style={{ color: 'var(--text-secondary)' }}>CrisisSync separates incident noise from actionable reality.</p>
          </div>
          
          <div className="grid-3">
            <div className="feature-card">
              <Activity size={32} color="var(--accent-brand)" />
              <h3>Real-time Triage Logic</h3>
              <p>Autonomous severity progression tracks concurrent SOS signals and delays, escalating when necessary through the strict chain of command.</p>
            </div>
            <div className="feature-card">
              <Map size={32} color="var(--accent-brand)" />
              <h3>Zone-Specific Deployment</h3>
              <p>No generic dashboards. Field wardens receive checklists and AI constraints specific to their localized layout and the current incident type.</p>
            </div>
            <div className="feature-card">
              <Users size={32} color="var(--accent-brand)" />
              <h3>Frictionless Guest Guidance</h3>
              <p>Guests scan physical QR codes in their zone to receive unauthenticated, translated, and deterministic evacuation paths mapped dynamically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Demo Section */}
      <section style={{ padding: 'var(--spacing-20) 0', backgroundColor: 'var(--bg-card)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--spacing-2)' }}>Try the Guest Evacuation Setup</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-8)' }}>
            Because Guests never sign up. Test the friction-free QR access via the URL link manually below.
          </p>
          <a href="http://localhost:5175/" className="btn btn-danger" style={{ height: '48px', padding: '0 32px' }} target="_blank" rel="noopener noreferrer">
            <ShieldCheck size={20} /> Access Guest Emergency PWA Demo 
          </a>
        </div>
      </section>
    </div>
  );
}
