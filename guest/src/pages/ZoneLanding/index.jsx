import { useGuestDemo } from '../../context/DemoContext';

export function ZoneLanding() {
  const { state, actions } = useGuestDemo();

  return (
    <>
      <div className="card text-center" style={{ marginTop: 'var(--space-4)' }}>
        <h1 className="card__title">{state.venueName}</h1>
        <p className="text-secondary mb-4">
          You are currently in: <strong>{state.zoneName}</strong>
        </p>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
          This page connects you directly to venue safety staff. Keep this page open if you need assistance.
        </p>
      </div>

      <button className="sos-trigger" onClick={actions.triggerIncident}>
        <span>SOS</span>
        <small>Tap for Emergency</small>
      </button>

      <div className="card mt-auto" style={{ background: '#f8f9fa' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Safety Information</h2>
        <div style={{ fontSize: '0.875rem', color: '#555' }}>
          <strong>Exit Route:</strong> {state.exitRoute}
          <br /><br />
          <strong>Assembly Point:</strong> {state.assemblyPoint}
        </div>
      </div>
    </>
  );
}
