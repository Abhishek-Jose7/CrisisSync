import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGuestDemo } from '../../context/DemoContext';
import { 
  Map, 
  AlertTriangle, 
  Info, 
  Users, 
  Navigation,
  Phone,
  Shield,
  Bell,
  Route,
  MapPin,
  Clock3
} from 'lucide-react';
import './enhanced-zone.css';

export function EnhancedZoneLanding({ basePath = '' }) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const { state } = useGuestDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', icon: Info, label: 'Info' },
    { id: 'map', icon: Map, label: 'Map' },
    { id: 'safety', icon: Shield, label: 'Safety' },
    { id: 'contacts', icon: Phone, label: 'Help' },
  ];

  function handleSOS() {
    const token = state.qrToken || location.pathname.split('/').filter(Boolean).at(-1) || 'floor7-ghi789';
    const routePrefix = basePath === '/demo' ? `${basePath}/${token}` : `${basePath}/zone/${token}`;
    navigate(`${routePrefix}/sos`);
  }

  function handleEvacuation() {
    const token = state.qrToken || location.pathname.split('/').filter(Boolean).at(-1) || 'floor7-ghi789';
    const routePrefix = basePath === '/demo' ? `${basePath}/${token}` : '';
    navigate(`${routePrefix}/evacuate`);
  }

  function handleGuide() {
    const token = state.qrToken || location.pathname.split('/').filter(Boolean).at(-1) || 'floor7-ghi789';
    const routePrefix = basePath === '/demo' ? `${basePath}/${token}` : '';
    navigate(`${routePrefix}/guide`);
  }

  // Building map data
  const buildingMap = {
    floors: [
      {
        id: 'ground',
        name: 'Ground Floor',
        zones: [
          { id: 'lobby', name: 'Lobby', x: 50, y: 50, current: state.zoneId === 'zone-lobby' },
          { id: 'restaurant', name: 'Restaurant', x: 20, y: 70, current: state.zoneId === 'zone-restaurant' },
          { id: 'kitchen', name: 'Kitchen', x: 80, y: 70, current: state.zoneId === 'zone-kitchen' },
        ]
      },
      {
        id: 'floor7',
        name: 'Floor 7',
        zones: [
          { id: 'floor7', name: 'Guest Rooms', x: 50, y: 50, current: state.zoneId === 'zone-floor7' },
        ]
      },
      {
        id: 'roof',
        name: 'Rooftop',
        zones: [
          { id: 'pool', name: 'Pool Area', x: 50, y: 50, current: state.zoneId === 'zone-pool' },
        ]
      },
      {
        id: 'level1',
        name: 'Level 1',
        zones: [
          { id: 'spa', name: 'Spa & Gym', x: 30, y: 50, current: state.zoneId === 'zone-spa' },
          { id: 'conference', name: 'Conference', x: 70, y: 50, current: state.zoneId === 'zone-conference' },
        ]
      },
      {
        id: 'basement',
        name: 'Basement',
        zones: [
          { id: 'parking', name: 'Parking', x: 50, y: 50, current: state.zoneId === 'zone-parking' },
        ]
      }
    ],
    exits: [
      { id: 'main', name: 'Main Exit', x: 10, y: 50 },
      { id: 'emergency1', name: 'Emergency Exit A', x: 90, y: 30 },
      { id: 'emergency2', name: 'Emergency Exit B', x: 90, y: 70 },
    ],
    assembly: { id: 'assembly', name: 'Assembly Point', x: 50, y: 90 }
  };

  const currentFloor = buildingMap.floors.find(floor => 
    floor.zones.some(zone => zone.current)
  ) || buildingMap.floors[0];
  const visibleFloor = buildingMap.floors.find(floor => floor.id === (selectedFloorId || currentFloor.id)) || currentFloor;

  useEffect(() => {
    setSelectedFloorId(currentFloor.id);
  }, [currentFloor.id]);

  return (
    <div className="enhanced-zone-container">
      {/* Header */}
      <div className="zone-header">
        <div className="zone-header-content">
          <h1 className="zone-title">{state.venueName}</h1>
          <div className="zone-badge">
            <Navigation size={16} />
            <span>{state.zoneName || 'Current Location'}</span>
          </div>
        </div>
        
        {state.activeIncident && (
          <div className="incident-alert">
            <Bell size={20} />
            <span>Emergency Active</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="zone-content">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="tab-content">
            <div className="welcome-card">
              <h2>Welcome to {state.zoneName || 'Your Zone'}</h2>
              <p className="text-muted">
                Your QR session is active. Keep this page open to receive important updates and instructions.
              </p>
            </div>

            <div className="guest-info-grid" aria-label="Current safety details">
              <div className="guest-info-card">
                <Route size={20} />
                <span>Exit Route</span>
                <strong>{state.exitRoute}</strong>
              </div>
              <div className="guest-info-card">
                <MapPin size={20} />
                <span>Assembly Point</span>
                <strong>{state.assemblyPoint}</strong>
              </div>
              <div className="guest-info-card">
                <Clock3 size={20} />
                <span>Session Status</span>
                <strong>Live zone updates enabled</strong>
              </div>
            </div>

            <div className="quick-actions">
              <button className="action-card emergency" onClick={handleSOS}>
                <div className="action-icon">
                  <AlertTriangle size={32} />
                </div>
                <div className="action-content">
                  <h3>Emergency SOS</h3>
                  <p>Report an emergency</p>
                </div>
              </button>

              <button className="action-card" onClick={handleEvacuation}>
                <div className="action-icon">
                  <Navigation size={32} />
                </div>
                <div className="action-content">
                  <h3>Evacuation Guide</h3>
                  <p>View evacuation routes</p>
                </div>
              </button>

              <button className="action-card" onClick={handleGuide}>
                <div className="action-icon">
                  <Info size={32} />
                </div>
                <div className="action-content">
                  <h3>Safety Guide</h3>
                  <p>Safety procedures</p>
                </div>
              </button>
            </div>

            {state.broadcastMessage && (
              <div className="broadcast-message">
                <Bell size={20} />
                <p>{state.broadcastMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="tab-content">
            <div className="map-container">
              <div className="map-header">
                <h3>Building Map</h3>
                <div className="floor-selector">
                  {buildingMap.floors.map(floor => (
                    <button
                      key={floor.id}
                      className={`floor-btn ${visibleFloor.id === floor.id ? 'active' : ''}`}
                      onClick={() => setSelectedFloorId(floor.id)}
                    >
                      {floor.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="map-view">
                <svg viewBox="0 0 100 100" className="building-map">
                  {/* Building outline */}
                  <rect x="5" y="5" width="90" height="90" fill="none" stroke="#666" strokeWidth="1" />
                  
                  {/* Current floor zones */}
                  {visibleFloor.zones.map(zone => (
                    <g key={zone.id}>
                      <rect
                        x={zone.x - 15}
                        y={zone.y - 10}
                        width="30"
                        height="20"
                        fill={zone.current ? '#dc4242' : '#e8edf2'}
                        stroke="#333"
                        strokeWidth="1"
                        rx="2"
                      />
                      <text
                        x={zone.x}
                        y={zone.y + 4}
                        textAnchor="middle"
                        fontSize="4"
                        fill={zone.current ? '#fff' : '#333'}
                        fontWeight={zone.current ? 'bold' : 'normal'}
                      >
                        {zone.name}
                      </text>
                    </g>
                  ))}

                  {/* Exits */}
                  {buildingMap.exits.map(exit => (
                    <g key={exit.id}>
                      <circle
                        cx={exit.x}
                        cy={exit.y}
                        r="3"
                        fill="#22a86b"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      <text
                        x={exit.x}
                        y={exit.y - 5}
                        textAnchor="middle"
                        fontSize="3"
                        fill="#22a86b"
                        fontWeight="bold"
                      >
                        EXIT
                      </text>
                    </g>
                  ))}

                  {/* Assembly point */}
                  <g>
                    <circle
                      cx={buildingMap.assembly.x}
                      cy={buildingMap.assembly.y}
                      r="4"
                      fill="#3d8de9"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      x={buildingMap.assembly.x}
                      y={buildingMap.assembly.y - 6}
                      textAnchor="middle"
                      fontSize="3"
                      fill="#3d8de9"
                      fontWeight="bold"
                    >
                      ASSEMBLY
                    </text>
                  </g>

                  {/* Your location indicator */}
                  <circle cx="50" cy="50" r="2" fill="#dc4242">
                    <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-dot current"></div>
                  <span>Your Location</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot exit"></div>
                  <span>Emergency Exit</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot assembly"></div>
                  <span>Assembly Point</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tab */}
        {activeTab === 'safety' && (
          <div className="tab-content">
            <div className="safety-info">
              <h3>Safety Information</h3>
              
              <div className="safety-card">
                <h4>Exit Route</h4>
                <p>{state.exitRoute}</p>
              </div>

              <div className="safety-card">
                <h4>Assembly Point</h4>
                <p>{state.assemblyPoint}</p>
              </div>

              <div className="safety-card">
                <h4>Emergency Procedures</h4>
                <ul>
                  <li>Stay calm and follow instructions</li>
                  <li>Use stairs, not elevators</li>
                  <li>Help others if safe to do so</li>
                  <li>Proceed to assembly point</li>
                </ul>
              </div>

              <div className="safety-card">
                <h4>Important Contacts</h4>
                <div className="contact-list">
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>Emergency: 911</span>
                  </div>
                  <div className="contact-item">
                    <Shield size={16} />
                    <span>Hotel Security: Ext. 5555</span>
                  </div>
                  <div className="contact-item">
                    <Users size={16} />
                    <span>Front Desk: Ext. 0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="tab-content">
            <div className="contacts-section">
              <h3>Emergency Contacts</h3>
              
              <div className="contact-grid">
                <button className="contact-card emergency">
                  <Phone size={24} />
                  <h4>Emergency Services</h4>
                  <p>911</p>
                  <small>Police, Fire, Medical</small>
                </button>

                <button className="contact-card">
                  <Shield size={24} />
                  <h4>Hotel Security</h4>
                  <p>Ext. 5555</p>
                  <small>24/7 Security Desk</small>
                </button>

                <button className="contact-card">
                  <Users size={24} />
                  <h4>Front Desk</h4>
                  <p>Ext. 0</p>
                  <small>General Assistance</small>
                </button>

                <button className="contact-card">
                  <AlertTriangle size={24} />
                  <h4>Medical Emergency</h4>
                  <p>Ext. 1234</p>
                  <small>First Aid Response</small>
                </button>
              </div>

              <div className="help-tips">
                <h4>When to Call for Help</h4>
                <ul>
                  <li>Medical emergencies or injuries</li>
                  <li>Fires, smoke, or burning smells</li>
                  <li>Suspicious activity or security concerns</li>
                  <li>Power outages or building issues</li>
                  <li>If you feel unsafe at any time</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
