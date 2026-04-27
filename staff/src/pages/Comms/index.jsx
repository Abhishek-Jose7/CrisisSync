import { useState } from 'react';
import { useStaffDemo } from '../../context/DemoContext';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Send, Radio, Shield, AlertTriangle, Clock } from 'lucide-react';

const DEMO_BROADCASTS = [
  {
    id: 'bc-001',
    from: 'Admin Command',
    type: 'command',
    message: 'All wardens: Fire incident on Floor 7. Begin zone sweep immediately. Use stairwells only. Elevators are locked.',
    timestamp: new Date(Date.now() - 12 * 60000),
    priority: 'high',
  },
  {
    id: 'bc-002',
    from: 'Admin Command',
    type: 'update',
    message: 'Kitchen has been cleared by Meena Patel. Lobby sweep is at 75%. Floor 7 is still active.',
    timestamp: new Date(Date.now() - 8 * 60000),
    priority: 'medium',
  },
  {
    id: 'bc-003',
    from: 'Suresh Nair',
    type: 'warden',
    message: 'Lobby clear. All guests accounted for and directed to assembly point. Fire doors sealed.',
    timestamp: new Date(Date.now() - 5 * 60000),
    priority: 'info',
  },
  {
    id: 'bc-004',
    from: 'Admin Command',
    type: 'command',
    message: 'Medical team positioned at Gate B. Stairwell B is the primary evacuation route for Floor 7.',
    timestamp: new Date(Date.now() - 3 * 60000),
    priority: 'high',
  },
  {
    id: 'bc-005',
    from: 'System',
    type: 'system',
    message: 'Escalation timer: Admin command acknowledged. 90s warden ACK window active.',
    timestamp: new Date(Date.now() - 15 * 60000),
    priority: 'info',
  },
];

export function CommsPage() {
  const { state } = useStaffDemo();
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');
  const [messages] = useState(isDemo ? DEMO_BROADCASTS : []);
  const [draft, setDraft] = useState('');

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    info: '#3b82f6',
  };

  const typeIcons = {
    command: AlertTriangle,
    update: Radio,
    warden: Shield,
    system: Clock,
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', padding: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <MessageCircle size={20} style={{ color: 'var(--severity-info)' }} />
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Communications</h1>
          <span style={{ fontSize: '0.6875rem', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
            {messages.length} messages
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Secure warden broadcast channel · Zone: {state.staffUser?.assignedZoneId ? state.zones?.find(z => z.zoneId === state.staffUser.assignedZoneId)?.name || state.staffUser.assignedZoneId : 'All'}</p>
      </div>

      {/* Channel Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-4)' }}>
        {['All', 'Command', 'Wardens', 'System'].map(tab => (
          <button key={tab} style={{
            padding: '6px 14px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            background: tab === 'All' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${tab === 'All' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
            color: tab === 'All' ? '#3b82f6' : 'var(--text-secondary)', cursor: 'pointer',
          }}>{tab}</button>
        ))}
      </div>

      {/* Messages Feed */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '16px' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '8px' }}>
            <MessageCircle size={40} />
            <h3 style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No broadcasts yet</h3>
            <p style={{ fontSize: '0.8125rem' }}>Messages from command and other wardens will appear here during an incident.</p>
          </div>
        ) : messages.map(msg => {
          const Icon = typeIcons[msg.type] || Radio;
          return (
            <div key={msg.id} style={{
              background: msg.priority === 'high' ? 'rgba(239,68,68,0.06)' : 'var(--bg-card)',
              border: `1px solid ${msg.priority === 'high' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
              borderLeft: `3px solid ${priorityColors[msg.priority]}`,
              borderRadius: '8px', padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={14} style={{ color: priorityColors[msg.priority] }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{msg.from}</span>
                  <span style={{ fontSize: '0.625rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{msg.type}</span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{msg.message}</p>
            </div>
          );
        })}
      </div>

      {/* Compose */}
      <div style={{ display: 'flex', gap: '8px', padding: '12px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Type a message to broadcast..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 14px', color: 'white', fontSize: '0.8125rem', outline: 'none' }}
        />
        <button style={{ background: 'var(--severity-info)', border: 'none', borderRadius: '8px', padding: '10px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
          <Send size={14} /> Send
        </button>
      </div>
    </div>
  );
}
