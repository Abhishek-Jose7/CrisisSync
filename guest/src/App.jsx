import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { GuestDemoProvider, useGuestDemo } from './context/DemoContext';
import { initAccessibility, setupOfflineDetection, announceToScreenReader } from '../../shared/accessibility';
import { GuestLogin } from './pages/Login';
import { Scanner } from './pages/Scanner';
import { ZoneLanding } from './pages/ZoneLanding';
import { EnhancedZoneLanding } from './pages/ZoneLanding/Enhanced';
import { SOS } from './pages/SOS';
import { EvacuationMode } from './pages/EvacuationMode';
import { Guide } from './pages/Guide';
import { PlaceholderView } from './pages/PlaceholderView';
import './index.css';
import './safety-card.css';
import './sos.css';
import './pages/ZoneLanding/enhanced-zone.css';
import '../../shared/accessibility.css';

function ZoneSession({ basePath = '' }) {
  const { token } = useParams();
  const { state, actions } = useGuestDemo();

  useEffect(() => {
    actions.startSession(token || 'floor7-ghi789');
  }, [actions, token]);

  if (!state.sessionId) return <div className="guest-loading">Loading zone session...</div>;

  return <EnhancedZoneLanding basePath={basePath} />;
}

function GuestRoutes({ basePath = '', demoMode = false }) {
  if (demoMode) {
    return (
      <Routes>
        <Route index element={<Navigate to={`${basePath}/floor7-ghi789`} replace />} />
        <Route path=":token" element={<ZoneSession basePath={basePath} />} />
        <Route path=":token/sos" element={<SOS basePath={basePath} />} />
        <Route path=":token/evacuate" element={<EvacuationMode basePath={basePath} />} />
        <Route path=":token/guide" element={<Guide />} />
        <Route path=":token/assembly" element={<PlaceholderView title="Assembly Point" icon="📍" description="Proceed to the zone assembly point shown on your QR session." />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="login" element={<GuestLogin basePath={basePath} />} />
      <Route path="scan" element={<Scanner basePath={basePath} />} />
      <Route path="zone/:token" element={<ZoneSession basePath={basePath} />} />
      <Route path="zone/:token/sos" element={<SOS basePath={basePath} />} />
      <Route path="evacuate" element={<EvacuationMode basePath={basePath} />} />
      <Route path="guide" element={<Guide />} />
      <Route path="assembly" element={<PlaceholderView title="Assembly Point" icon="📍" description="Your designated safe zone will appear after QR scan." />} />
      <Route index element={<Navigate to={`${basePath}/login`} replace />} />
    </Routes>
  );
}

function GuestShell({ basePath = '', mode = 'main', demoMode = false }) {
  return (
    <GuestDemoProvider mode={mode}>
      <div className="app-layout">
        <GuestRoutes basePath={basePath} demoMode={demoMode} />
      </div>
    </GuestDemoProvider>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize accessibility features
    initAccessibility();
    
    // Setup offline detection
    const cleanupOffline = setupOfflineDetection((isOnline) => {
      if (!isOnline) {
        announceToScreenReader('You are now offline. Some features may be limited.', 'assertive');
      }
    });
    
    return cleanupOffline;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo/*" element={<GuestShell basePath="/demo" mode="demo" demoMode />} />
        <Route path="/*" element={<GuestShell />} />
      </Routes>
    </BrowserRouter>
  );
}
