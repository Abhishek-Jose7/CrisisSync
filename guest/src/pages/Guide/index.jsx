import { useLocation } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, DoorOpen, HandHeart, Navigation } from 'lucide-react';
import { useGuestDemo } from '../../context/DemoContext';

export function Guide() {
  const { state } = useGuestDemo();
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get('mode');
  const whatToDo = mode === 'what-to-do';

  return (
    <div style={{ paddingBottom: 60 }}>
      <div className="card text-center" style={{ marginTop: 'var(--space-4)' }}>
        <h1 className="card__title">{whatToDo ? 'What to do now' : 'Safety Guide'}</h1>
        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem' }}>
          {whatToDo
            ? `${state.zoneName || 'Your zone'} has an active alert. Follow these immediate steps in order.`
            : 'Prepared guidance for common venue emergencies.'}
        </p>
      </div>

      {whatToDo ? (
        <>
          <ActionStep icon={AlertTriangle} title="Move away from danger" text="Leave smoke, heat, crowding, broken glass, water, or electrical hazards behind you before checking your phone again." />
          <ActionStep icon={DoorOpen} title="Use the assigned exit route" text={state.exitRoute || 'Follow lit exit signs to the nearest stairwell. Do not use lifts.'} />
          <ActionStep icon={HandHeart} title="Help only if it is safe" text="Guide nearby children, elderly guests, or injured people, but do not delay evacuation if conditions are worsening." />
          <ActionStep icon={Navigation} title="Go to assembly point" text={state.assemblyPoint || 'Proceed to the designated assembly area and wait for staff instructions.'} />
          <ActionStep icon={CheckCircle2} title="Keep this session open" text="Staff can send updated instructions to this QR session while the incident is active." />
        </>
      ) : (
        <>
          <GuideCard title="Fire Emergency" lines={['Stay low if there is smoke.', 'Use stairs only.', 'Close doors behind you if safe.', 'Proceed to your assembly point.']} />
          <GuideCard title="Medical Emergency" lines={['Send SOS with medical selected.', 'Check that the area is safe.', 'Do not move an injured person unless they are in danger.', 'Wait for trained staff or emergency services.']} />
        </>
      )}
    </div>
  );
}

function ActionStep({ icon: Icon, title, text }) {
  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 14, alignItems: 'start' }}>
      <div style={{ width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'rgba(66, 133, 244, 0.12)', color: 'var(--color-info)' }}>
        <Icon size={22} />
      </div>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4, color: '#12121a' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: '#5a5a73', lineHeight: 1.55 }}>{text}</p>
      </div>
    </div>
  );
}

function GuideCard({ title, lines }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{title}</h3>
      <ul style={{ display: 'grid', gap: 8, paddingLeft: 18, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        {lines.map(line => <li key={line}>{line}</li>)}
      </ul>
    </div>
  );
}
