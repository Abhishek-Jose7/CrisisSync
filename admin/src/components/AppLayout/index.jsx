import { Sidebar } from '../Sidebar';

export function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#07090c', color: 'white' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
