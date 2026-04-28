import { useStaffDemo } from '../../context/DemoContext';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export function Incident() {
  const { state, actions } = useStaffDemo();
  const [activeTab, setActiveTab] = useState('tasks');
  const [statusNotice, setStatusNotice] = useState(null);

  const actInc = state.activeIncident || { crisisType: 'FIRE', severity: 2 };
  const tasks = state.checklist || [];
  const completedCount = tasks.filter(task => state.completedTaskIds.includes(task.id)).length;
  const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  function handleQuickStatus(status, label) {
    actions.updateStatus(status);
    setStatusNotice(label);
  }

  return (
    <>
      <div className="main-content" style={{ padding: 0, paddingBottom: 100 }}>
        
        {/* Top Header */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>Zone: {state.zones.find(z => z.zoneId === state.staffUser?.assignedZoneId)?.name || 'Floor 7'} <span style={{fontSize: '12px'}}>∨</span></div>
          <div style={{ position: 'relative' }}>
            <Bell size={24} />
            <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--severity-3)', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</span>
          </div>
        </div>

        {/* Global Incident Banner */}
        <div style={{ margin: '0 var(--space-4)', padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--severity-3)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Active Incident</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{actInc.crisisType} - LEVEL {actInc.severity} <span style={{ color: 'var(--severity-3)' }}>HIGH</span></div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginTop: 'var(--space-4)' }}>
          <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>OVERVIEW</Tab>
          <Tab active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>TASKS ({tasks.length})</Tab>
          <Tab active={activeTab === 'comms'} onClick={() => setActiveTab('comms')}>COMMUNICATION</Tab>
        </div>

        {/* Tab Content */}
        <div style={{ padding: 'var(--space-4)' }}>
          
          {activeTab === 'overview' && (
            <div style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏢</div>
              <h3 style={{ color: 'white', marginBottom: '4px' }}>Zone Level Overview</h3>
              <p style={{ fontSize: '0.875rem' }}>Assigned route: check rooms, guide guests to Stairwell B, and report headcount. Current status: {state.zoneStatus.replaceAll('_', ' ')}.</p>
            </div>
          )}

          {activeTab === 'tasks' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>ZONE STATUS</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{completedCount} / {tasks.length} Completed</div>
              </div>
              <div style={{ color: 'var(--severity-3)', fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>{state.zoneStatus.replaceAll('_', ' ')}</div>
              {statusNotice && (
                <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', color: '#93c5fd', fontSize: '0.8125rem', fontWeight: 700 }}>
                  Status sent to command: {statusNotice}
                </div>
              )}
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                 <div style={{ width: `${completion}%`, height: '100%', background: completion === 100 ? '#10b981' : '#f59e0b' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'var(--space-6)', marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>MY TASKS</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{completedCount} of {tasks.length} completed</div>
              </div>

              {/* Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasks.map(task => {
                  const done = state.completedTaskIds.includes(task.id);
                  return (
                    <TaskItem
                      key={task.id}
                      label={task.task}
                      status={done ? 'Completed just now' : (task.priority <= 2 ? 'High Priority' : 'Pending')}
                      done={done}
                      urgent={!done && task.priority <= 2}
                      onClick={() => actions.toggleTask(task.id)}
                    />
                  );
                })}
              </div>

              {/* AI Tip */}
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span>💡</span> AI SAFETY TIP
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>Close doors behind you to slow smoke spread. Stay low and guide guests calmly.</p>
              </div>
            </>
          )}

          {activeTab === 'comms' && (
            <div style={{ display: 'grid', gap: '10px' }}>
              {[
                ['Command', 'Proceed with Floor 7 sweep. Report blockers immediately.'],
                ['Lobby', 'Assembly point Gate B is open and receiving guests.'],
                ['System', `${completedCount}/${tasks.length} checklist items complete for your zone.`],
              ].map(([sender, text]) => (
                <div key={text} style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 12 }}>
                  <strong style={{ color: 'white', fontSize: '0.8rem' }}>{sender}</strong>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions always visible */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>QUICK ACTIONS</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleQuickStatus('zone_clear', 'Zone Safe')} style={{ flex: 1, padding: '12px 8px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', color: '#10b981', fontWeight: 600, fontSize: '0.875rem' }}>Zone Safe</button>
              <button onClick={() => handleQuickStatus('request_backup', 'Assistance Needed')} style={{ flex: 1, padding: '12px 8px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '8px', color: '#f59e0b', fontWeight: 600, fontSize: '0.875rem' }}>Assistance Needed</button>
              <button onClick={() => handleQuickStatus('person_needs_help', 'Emergency Now')} style={{ flex: 1, padding: '12px 8px', background: 'var(--severity-3-bg)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '8px', color: 'var(--severity-3)', fontWeight: 600, fontSize: '0.875rem' }}>Emergency Now</button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

function Tab({ active, children, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      flex: 1, textAlign: 'center', padding: '12px 0', fontSize: '0.75rem', fontWeight: 700, 
      letterSpacing: '0.05em', color: active ? 'white' : 'var(--text-secondary)',
      borderBottom: `2px solid ${active ? '#f59e0b' : 'transparent'}`,
      cursor: 'pointer', background: 'transparent', borderTop: 0, borderLeft: 0, borderRight: 0
    }}>
      {children}
    </button>
  );
}

function TaskItem({ label, status, done, urgent, onClick }) {
  return (
    <button onClick={onClick} style={{ 
      display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', 
      background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
      border: urgent ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent',
      textAlign: 'left', cursor: 'pointer', width: '100%'
    }}>
      <div style={{ 
        width: 20, height: 20, borderRadius: '4px', 
        border: done ? 'none' : '2px solid var(--text-muted)',
        background: done ? '#f59e0b' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
      }}>
        {done && <span style={{ fontSize: '14px' }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 500, color: done ? 'var(--text-secondary)' : 'white', textDecoration: done ? 'line-through' : 'none' }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: done ? '#10b981' : (urgent ? 'var(--severity-3)' : 'var(--text-secondary)'), marginTop: '2px' }}>{status}</div>
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>&gt;</div>
    </button>
  );
}
