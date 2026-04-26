import { useDemo } from '../../context/DemoContext';
import { formatRelativeTime } from '../../services/utils';
import { Camera, Plus } from 'lucide-react';

const SIMULATED_ANOMALIES = {
  fire: [
    { observation: 'Smoke-like haze detected in upper frame', confidence: 0.83 },
    { observation: 'Possible fire detected near ceiling area', confidence: 0.79 },
    { observation: 'Elevated heat signature pattern', confidence: 0.76 },
  ],
  medical: [
    { observation: 'Person in prone position detected', confidence: 0.81 },
    { observation: 'Stationary figure detected for extended period', confidence: 0.78 },
  ],
  security: [
    { observation: 'Elevated crowd density near exit', confidence: 0.77 },
    { observation: 'Rapid movement pattern detected', confidence: 0.74 },
  ],
  flood: [
    { observation: 'Floor reflectivity anomaly detected — possible liquid', confidence: 0.72 },
  ],
};

export function SimulatedAnomalyPanel() {
  const { state, actions } = useDemo();
  const { cameraEvents, activeIncident, zones } = state;

  function handleSimulate() {
    if (!activeIncident) return;
    const crisisType = activeIncident.crisisType;
    const anomalies = SIMULATED_ANOMALIES[crisisType] || SIMULATED_ANOMALIES.fire;
    const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
    const randomZone = zones[Math.floor(Math.random() * zones.length)];

    actions.addCameraEvent({
      zoneId: randomZone.zoneId,
      cameraId: 'SIMULATED',
      observation: anomaly.observation,
      confidence: anomaly.confidence,
    });
  }

  return (
    <section className="camera-panel" aria-label="Camera vision AI">
      <div className="camera-panel__header">
        <Camera size={14} style={{ color: 'var(--text-secondary)' }} />
        <span className="camera-panel__title">Vision AI</span>
        <span className="sim-badge">DEMO MODE</span>
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn--ghost btn--sm" onClick={handleSimulate}>
            <Plus size={12} />
            Simulate
          </button>
        </div>
      </div>
      <div className="camera-panel__notice">
        Camera integration requires Phase 2 hardware setup. Using simulated anomaly detection for demo.
      </div>
      {cameraEvents.length === 0 ? (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          No camera events. Click "Simulate" to generate a demo anomaly.
        </div>
      ) : (
        cameraEvents.map(event => {
          const zone = zones.find(z => z.zoneId === event.zoneId);
          return (
            <div key={event.id} className="camera-event">
              <span className="camera-event__sim-tag">SIM</span>
              <div className="camera-event__content">
                <div className="camera-event__observation">{event.observation}</div>
                <div className="camera-event__meta">
                  <span className="camera-event__confidence">
                    {Math.round(event.confidence * 100)}% confidence
                  </span>
                  <span>Zone: {zone?.name || event.zoneId}</span>
                  <span>{formatRelativeTime(event.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}
