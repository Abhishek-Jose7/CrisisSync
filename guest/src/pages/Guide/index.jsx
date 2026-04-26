export function Guide() {
  return (
    <div style={{ paddingBottom: 60 }}>
      <div className="card text-center" style={{ marginTop: 'var(--space-4)' }}>
        <h1 className="card__title">Safety Guide</h1>
        <p className="text-secondary mb-2" style={{ fontSize: '0.875rem' }}>
          General instructions for venue safety.
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Fire Emergency</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          1. Remain calm. Do not run.<br />
          2. Follow the exit signs to the nearest stairwell.<br />
          3. DO NOT use elevators.<br />
          4. Assemble at your designated safe zone.
        </p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Medical Emergency</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          1. Trigger the SOS alarm via the main tab.<br />
          2. Check if the surroundings are safe.<br />
          3. Do not move an injured person unless they are in immediate danger.<br />
        </p>
      </div>
    </div>
  );
}
