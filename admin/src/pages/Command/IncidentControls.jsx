import { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { CRISIS_TYPES, SEVERITY_LEVELS } from '@shared/constants';
import { AlertTriangle, Play, Square, Plus } from 'lucide-react';

export function IncidentControls() {
  const { state, actions } = useDemo();
  const { activeIncident, zones } = state;
  const [showStartForm, setShowStartForm] = useState(false);
  const [crisisType, setCrisisType] = useState('fire');
  const [severity, setSeverity] = useState(2);
  const [triggerZone, setTriggerZone] = useState(zones[2]?.zoneId || zones[0]?.zoneId);

  function handleStart() {
    actions.startIncident({
      crisisType,
      severity,
      triggeredBy: 'staffReport',
      triggeredByZoneId: triggerZone,
    });
    setShowStartForm(false);

    // Auto-generate demo data
    setTimeout(() => {
      actions.addSOS({
        zoneId: triggerZone,
        crisisType,
        urgency: 'need_help',
        affectedCount: 'few',
      });
    }, 1200);

    setTimeout(() => {
      actions.acknowledgeZone({ zoneId: triggerZone });
      actions.updateChecklist({ zoneId: triggerZone, completion: 20 });
    }, 3000);

    setTimeout(() => {
      actions.addSOS({
        zoneId: triggerZone,
        crisisType,
        urgency: 'need_help',
        affectedCount: 'many',
      });
      actions.setAISuggestions([
        {
          suggestion: `Multiple SOS alerts from ${state.zones.find(z => z.zoneId === triggerZone)?.name}. Consider escalating affected adjacent zones and dispatching backup warden.`,
          dataPoint: '2 SOS alerts in 60s, same zone',
          urgency: 'high',
        },
        {
          suggestion: 'Lobby warden has not acknowledged yet. Verify lobby warden is on-shift and push re-notification.',
          dataPoint: 'Lobby zone unacknowledged after 45s',
          urgency: 'medium',
        },
        {
          suggestion: 'Parking zone is low-risk for fire incidents. Consider deprioritizing parking zone notification to avoid alert fatigue.',
          dataPoint: 'Parking risk profile: low, crisis type: fire',
          urgency: 'low',
        },
      ]);
    }, 4500);

    setTimeout(() => {
      actions.updateChecklist({ zoneId: triggerZone, completion: 60 });
      actions.acknowledgeZone({ zoneId: zones[0]?.zoneId });
    }, 6000);

    setTimeout(() => {
      actions.addCameraEvent({
        zoneId: triggerZone,
        cameraId: 'SIMULATED',
        observation: 'Smoke-like haze detected in upper frame',
        confidence: 0.83,
      });
    }, 8000);
  }

  function handleAddSOS() {
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    actions.addSOS({
      zoneId: randomZone.zoneId,
      crisisType: activeIncident?.crisisType || 'fire',
      urgency: Math.random() > 0.5 ? 'need_help' : 'safe_reporting',
      affectedCount: ['just_me', 'few', 'many'][Math.floor(Math.random() * 3)],
    });
  }

  if (activeIncident?.status === 'active') {
    return (
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
        <div style={{ flex: 1 }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <h1 className="section-header__title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <AlertTriangle size={20} style={{ color: 'var(--severity-3)' }} />
              Incident Command
            </h1>
          </div>
        </div>
        <div className="section-header__actions">
          {/* Severity Override */}
          <select
            className="form-select"
            value={activeIncident.currentSeverity}
            onChange={e => actions.setSeverity({ severity: parseInt(e.target.value), setBy: 'admin' })}
            aria-label="Override severity level"
            style={{ minWidth: 160 }}
          >
            {Object.entries(SEVERITY_LEVELS).map(([level, info]) => (
              <option key={level} value={level}>{info.label}</option>
            ))}
          </select>

          <button className="btn btn--ghost btn--sm" onClick={handleAddSOS} title="Simulate guest SOS">
            <Plus size={14} />
            Add SOS
          </button>

          <button className="btn btn--danger btn--sm" onClick={actions.resolveIncident}>
            <Square size={14} />
            Resolve Incident
          </button>
        </div>
      </div>
    );
  }

  if (showStartForm) {
    return (
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        maxWidth: 520,
      }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>
          Start Incident
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="crisis-type">Crisis Type</label>
            <select
              id="crisis-type"
              className="form-select"
              value={crisisType}
              onChange={e => setCrisisType(e.target.value)}
            >
              {CRISIS_TYPES.map(ct => (
                <option key={ct.value} value={ct.value}>
                  {ct.icon} {ct.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="severity-level">Initial Severity</label>
            <select
              id="severity-level"
              className="form-select"
              value={severity}
              onChange={e => setSeverity(parseInt(e.target.value))}
            >
              {Object.entries(SEVERITY_LEVELS).map(([level, info]) => (
                <option key={level} value={level}>{info.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="trigger-zone">Trigger Zone</label>
            <select
              id="trigger-zone"
              className="form-select"
              value={triggerZone}
              onChange={e => setTriggerZone(e.target.value)}
            >
              {zones.map(z => (
                <option key={z.zoneId} value={z.zoneId}>{z.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <button className="btn btn--danger" onClick={handleStart}>
              <Play size={14} />
              Activate Incident
            </button>
            <button className="btn btn--ghost" onClick={() => setShowStartForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <div className="section-header">
        <div>
          <h1 className="section-header__title">Command Center</h1>
          <p className="section-header__subtitle">Incident command board — activate to begin coordination</p>
        </div>
        <div className="section-header__actions">
          <button className="btn btn--danger btn--lg" onClick={() => setShowStartForm(true)}>
            <AlertTriangle size={16} />
            Start Incident
          </button>
        </div>
      </div>
    </div>
  );
}
