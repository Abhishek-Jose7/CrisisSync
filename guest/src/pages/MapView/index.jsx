import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useGuestDemo } from '../../context/DemoContext';

const ME_ICON = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #4285f4; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(66,133,244,0.8);"></div>',
  iconSize: [22, 22],
});

const EXIT_ICON = L.divIcon({
  className: 'custom-icon',
  html: '<div style="background-color: #34a853; width: 14px; height: 14px; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>',
  iconSize: [18, 18],
});

export function MapView() {
  const { state } = useGuestDemo();
  const bounds = [[0, 0], [1000, 1000]];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, margin: 'calc(-1 * var(--space-4))', paddingBottom: 60 }}>
      <div style={{ padding: 'var(--space-4)', background: state.activeIncident ? 'var(--color-danger)' : 'var(--bg-surface)', zIndex: 10 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Facility Map</h2>
        <p style={{ opacity: 0.8, fontSize: '0.875rem' }}>Find your way to the assembly point.</p>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          center={[500, 500]} 
          zoom={0} 
          maxZoom={2}
          minZoom={-1}
          crs={L.CRS.Simple}
          style={{ height: '100%', width: '100%', background: '#e0e0e0' }}
        >
          <ImageOverlay
            url="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000'><rect width='1000' height='1000' fill='%23f1f3f4'/><path d='M100 100 h300 v300 h-300 z' fill='white' stroke='%23bdc1c6' stroke-width='4'/><path d='M500 100 h300 v300 h-300 z' fill='white' stroke='%23bdc1c6' stroke-width='4'/><path d='M100 500 h700 v300 h-700 z' fill='white' stroke='%23bdc1c6' stroke-width='4'/><text x='250' y='250' fill='%235f6368' font-family='sans-serif' font-size='24' text-anchor='middle'>Lobby</text><text x='650' y='250' fill='%235f6368' font-family='sans-serif' font-size='24' text-anchor='middle'>Kitchen</text><text x='450' y='650' fill='%235f6368' font-family='sans-serif' font-size='24' text-anchor='middle'>Floor 7</text></svg>"
            bounds={bounds}
          />
          <Marker position={[250, 250]} icon={ME_ICON}>
            <Popup>You are here</Popup>
          </Marker>
          <Marker position={[850, 450]} icon={EXIT_ICON}>
            <Popup>Assembly Point</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
