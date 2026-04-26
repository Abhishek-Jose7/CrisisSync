import { useState } from 'react';
import { useStaffDemo } from '../../context/DemoContext';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TopBar } from '../../components/TopBar';

// Map markers
const RED_ICON = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #ff5252; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
  iconSize: [20, 20],
});

const GREEN_ICON = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #20b888; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
  iconSize: [20, 20],
});

export function MapView() {
  const { state } = useStaffDemo();
  // Using a solid dark grey rectangle as a mock blueprint if you don't have an asset
  const bounds = [[0, 0], [1000, 1000]];

  return (
    <>
      <TopBar />
      <div className="main-content" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Facility Map</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>View zones and hazards</p>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <MapContainer 
            center={[500, 500]} 
            zoom={0} 
            maxZoom={2}
            minZoom={-1}
            crs={L.CRS.Simple}
            style={{ height: '100%', width: '100%', background: '#111' }}
          >
             <ImageOverlay
              url="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><rect width='1000' height='1000' fill='%231a1a2e'/><path d='M100 100 h300 v300 h-300 z' fill='%2322223b' stroke='%234a4e69' stroke-width='4'/><path d='M500 100 h300 v300 h-300 z' fill='%2322223b' stroke='%234a4e69' stroke-width='4'/><path d='M100 500 h700 v300 h-700 z' fill='%2322223b' stroke='%234a4e69' stroke-width='4'/><text x='250' y='250' fill='white' font-family='sans-serif' font-size='24' text-anchor='middle'>Zone: Lobby</text><text x='650' y='250' fill='white' font-family='sans-serif' font-size='24' text-anchor='middle'>Zone: Kitchen</text><text x='450' y='650' fill='white' font-family='sans-serif' font-size='24' text-anchor='middle'>Zone: Floor 7</text></svg>"
              bounds={bounds}
            />
            {/* Example markers based on status */}
            {state.activeIncident && (
              <Marker position={[250, 250]} icon={RED_ICON}>
                <Popup>SOS Alert Reported Here</Popup>
              </Marker>
            )}
            <Marker position={[650, 450]} icon={GREEN_ICON}>
              <Popup>Warden Assigned</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
}
