import { useState } from 'react';
import { Radio } from 'lucide-react';

export function BroadcastBar() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    // In production, this calls /api/broadcast
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <section className="broadcast-bar" aria-label="Guest broadcast">
      <Radio size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input
        type="text"
        className="broadcast-bar__input"
        placeholder="Broadcast message to all guest devices…"
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        aria-label="Broadcast message"
      />
      <button
        className="btn btn--primary btn--sm"
        onClick={handleSend}
        disabled={!message.trim()}
      >
        {sent ? 'Sent ✓' : 'Broadcast'}
      </button>
    </section>
  );
}
