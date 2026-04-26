import { useDemo } from '../../context/DemoContext';
import { Sparkles } from 'lucide-react';

export function AICommandPanel() {
  const { state } = useDemo();
  const { aiSuggestions } = state;

  return (
    <section className="ai-panel" aria-label="AI decision support">
      <div className="ai-panel__header">
        <Sparkles size={14} />
        AI Decision Support
        <span className="ai-panel__badge">GEMINI</span>
      </div>
      <div className="ai-panel__body">
        {aiSuggestions.length === 0 ? (
          <div style={{ padding: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            AI suggestions will appear here during an active incident.
            <br />Refreshed every 30 seconds.
          </div>
        ) : (
          aiSuggestions.map((s, i) => (
            <div key={i} className="ai-suggestion">
              <div className="ai-suggestion__text">{s.suggestion}</div>
              <div className="ai-suggestion__data">
                {s.dataPoint}
                <span className={`ai-suggestion__urgency ai-suggestion__urgency--${s.urgency}`}>
                  {s.urgency}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
