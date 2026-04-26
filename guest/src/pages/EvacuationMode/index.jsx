import { useGuestDemo } from '../../context/DemoContext';
import { AlertOctagon, CheckCircle } from 'lucide-react';

export function EvacuationMode() {
  const { state, actions } = useGuestDemo();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div className="text-center" style={{ marginBottom: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
        <AlertOctagon size={64} style={{ display: 'inline-block', marginBottom: 'var(--space-3)' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
          EMERGENCY
        </h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, opacity: 0.9 }}>
          {state.broadcastMessage}
        </p>
      </div>

      <div className="card">
        <h2 className="card__title" style={{ color: 'var(--text-primary)' }}>Evacuate {state.zoneName}</h2>
        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong>Route:</strong> {state.exitRoute}
          <div style={{ marginTop: 'var(--space-2)' }}>
            <strong>Proceed to:</strong> {state.assemblyPoint}
          </div>
        </div>
      </div>

      {state.sosSent ? (
        <div className="card text-center" style={{ background: 'var(--color-success)', color: 'white', marginTop: 'auto' }}>
          <CheckCircle size={32} style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Signal Received</h3>
          <p style={{ opacity: 0.9 }}>Staff have received your location. Help is on the way. Remain calm.</p>
          <button 
            className="btn btn--outline" 
            style={{ marginTop: 'var(--space-4)' }}
            onClick={actions.resolveIncident}
          >
            [Demo] Resolve Incident
          </button>
        </div>
      ) : (
        <div className="mt-auto">
          <p className="text-center mb-2" style={{ fontWeight: 600, fontSize: '0.875rem', opacity: 0.9 }}>
            Do you need immediate help?
          </p>
          <button 
            className="btn btn--white mb-4" 
            style={{ fontWeight: 800, fontSize: '1.25rem', height: 64 }}
            onClick={() => actions.sendSos('help')}
          >
            I NEED HELP NOW
          </button>
          <button 
            className="btn btn--outline" 
            onClick={() => actions.sendSos('safe')}
          >
            I am evacuating safely
          </button>
        </div>
      )}
    </div>
  );
}
