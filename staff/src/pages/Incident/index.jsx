import { useNavigate } from 'react-router-dom';
import { useStaffDemo } from '../../context/DemoContext';
import { TopBar } from '../../components/TopBar';
import { Check } from 'lucide-react';
import { useState } from 'react';

export function Incident() {
  const { state, actions } = useStaffDemo();
  const navigate = useNavigate();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (!state.activeIncident) {
    navigate('/');
    return null;
  }

  const actInc = state.activeIncident;

  return (
    <>
      <TopBar />
      <div className="main-content">
        
        {/* Priority Directive */}
        <div style={{ 
          background: 'var(--severity-3-bg)', 
          border: '1px solid var(--severity-3)', 
          borderRadius: 'var(--radius-md)', 
          padding: 'var(--space-4)',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--severity-3)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
            {actInc.crisisType} INCIDENT — LEVEL {actInc.severity}
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.4 }}>
            Execute emergency playbook for your zone immediately. Do not use elevators.
          </p>
        </div>

        {/* Action Checklist */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
            Warden Checklist
          </h3>
          <div className="checklist">
            {state.checklist.map((task) => {
              const isDone = state.completedTaskIds.includes(task.id);
              return (
                <div 
                  key={task.id} 
                  className={`checklist-item ${isDone ? 'checklist-item--done' : ''}`}
                  onClick={() => !isDone && actions.markTask(task.id)}
                >
                  <div className="checklist-item__checkbox">
                    {isDone && <Check size={16} strokeWidth={3} />}
                  </div>
                  <div className="checklist-item__text">{task.task}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Assistant Context */}
        <div className="tips-panel">
          <div className="tips-panel__title">
            <span>✨</span> Gemini Support Context
          </div>
          <div className="tips-list">
            {state.aiTips.map((tip, i) => (
              <div key={i} className="tip-item">{tip.tip}</div>
            ))}
          </div>
        </div>

      </div>

      {/* Fixed Bottom Action */}
      <div className="bottom-actions">
        <button 
          className="btn btn--danger" 
          onClick={() => setShowStatusMenu(true)}
          style={{ width: '100%', gridColumn: 'span 2' }}
        >
          Update Zone Status: {state.zoneStatus.toUpperCase()}
        </button>
      </div>

      {showStatusMenu && (
        <div style={{
          position: 'fixed', inset: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 100,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end'
        }}>
          <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>Set Zone Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <button className="btn btn--success" onClick={() => { actions.updateStatus('zone_clear'); setShowStatusMenu(false); }}>Zone Clear (Evacuated)</button>
              <button className="btn btn--danger" onClick={() => { actions.updateStatus('person_needs_help'); setShowStatusMenu(false); }}>Person Needs Help</button>
              <button className="btn btn--primary" onClick={() => { actions.updateStatus('active'); setShowStatusMenu(false); }}>Active Evacuation</button>
              <button className="btn btn--ghost" onClick={() => setShowStatusMenu(false)}>Cancel</button>
            </div>
            
            <button 
              className="btn btn--ghost btn--block" 
              style={{ marginTop: 'var(--space-6)', opacity: 0.5 }}
              onClick={() => { actions.clearIncident(); setShowStatusMenu(false); }}
            >
              [Demo] Resolve System Incident
            </button>
          </div>
        </div>
      )}
    </>
  );
}
