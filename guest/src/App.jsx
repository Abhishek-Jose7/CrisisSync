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
  const { state } = useGuestDemo();

  useEffect(() => {
    if (state.activeIncident) {
      document.body.classList.add('theme-danger');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ea4335');
    } else {
      document.body.classList.remove('theme-danger');
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
    }
  }, [state.activeIncident]);

  return (
    <div className="container">
      <header className="header">
        <div className="header__brand">CrisisSync</div>
        <div className="header__zone">{state.zoneName}</div>
      </header>

      <Routes>
        <Route path="/" element={state.activeIncident ? <EvacuationMode /> : <ZoneLanding />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/guide" element={<Guide />} />
      </Routes>
      
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <GuestDemoProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </GuestDemoProvider>
  );
}
