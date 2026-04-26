import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GuestDemoProvider, useGuestDemo } from './context/DemoContext';
import { ZoneLanding } from './pages/ZoneLanding';
import { EvacuationMode } from './pages/EvacuationMode';
import { MapView } from './pages/MapView';
import { Guide } from './pages/Guide';
import { BottomNav } from './components/BottomNav';
import './index.css';

function MainApp() {
  return (
    <div className="app-layout">
      <Routes>
        {/* Isolated Demo Environment */}
        <Route path="/demo/*" element={
          <GuestDemoProvider>
            <Routes>
              <Route path="/" element={<EvacuationMode />} />
              <Route path="/guide" element={<PlaceholderView title="Evacuation Guide" icon="🚶‍♂️" description="Turn right at the hallway and proceed down Staircase A." />} />
              <Route path="/assembly" element={<PlaceholderView title="Assembly Point" icon="📍" description="Proceed to Primary Assembly Point: North Parking Lot." />} />
            </Routes>
          </GuestDemoProvider>
        } />
        
        {/* Production Environment */}
        <Route path="/*" element={
          <Routes>
            <Route path="/" element={<EvacuationMode />} />
            <Route path="/guide" element={<PlaceholderView title="Evacuation Guide" icon="🚶‍♂️" description="Real-time safe routing will appear here." />} />
            <Route path="/assembly" element={<PlaceholderView title="Assembly Point" icon="📍" description="Your designated safe zone will highlight here." />} />
          </Routes>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
