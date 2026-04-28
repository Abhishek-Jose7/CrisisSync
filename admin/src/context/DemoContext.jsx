/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { auth } from '../../../shared/firebase/config';
import { subscribeVenueData, updatePlaybook, updateStaffMember } from '../services/firestoreData';

const DemoContext = createContext(null);

// Demo data models the exact Firestore schema from agent.md
const INITIAL_STATE = {
  venue: {
    venueId: 'demo-venue-001',
    name: 'Grand Orchid Hotel',
    type: 'hotel',
    address: '123 Marine Drive, Mumbai',
    timezone: 'Asia/Kolkata',
    adminUid: 'admin-001',
    setupComplete: true,
    complianceAcknowledged: true,
    settings: {
      warden_ack_timeout_seconds: 90,
      admin_command_timeout_seconds: 90,
      full_escalation_timeout_seconds: 180,
      level3_requires_human_confirm: true,
    },
  },

  zones: [
    {
      zoneId: 'zone-lobby',
      name: 'Ground Floor Lobby',
      type: 'lobby',
      capacity: 80,
      riskProfile: 'medium',
      assemblyPoint: 'Car park entrance, ground level',
      exitRoute: 'Direct guests through main entrance or east/west emergency exits.',
      notes: 'AED at reception desk. Mobility-impaired refuge at east lobby stairwell.',
      isSeniorZone: true,
      qrToken: 'lobby-abc123',
    },
    {
      zoneId: 'zone-kitchen',
      name: 'Kitchen',
      type: 'kitchen',
      capacity: 12,
      riskProfile: 'high',
      assemblyPoint: 'Service yard, north entrance',
      exitRoute: 'Exit via kitchen back door to service corridor. Turn right to Exit B.',
      notes: 'CO2 extinguisher at Station K2 (east wall). Gas shutoff behind oven station.',
      isSeniorZone: false,
      qrToken: 'kitchen-def456',
    },
    {
      zoneId: 'zone-floor7',
      name: 'Floor 7',
      type: 'floor',
      capacity: 48,
      riskProfile: 'medium',
      assemblyPoint: 'Car park entrance, Level 0, Gate B',
      exitRoute: 'Turn left from lifts, take Stairwell B at end of corridor. Do not use lifts.',
      notes: 'AED at Floor 6 nurse station. CO2 extinguisher at Stairwells 7A and 7B.',
      isSeniorZone: false,
      qrToken: 'floor7-ghi789',
    },
    {
      zoneId: 'zone-parking',
      name: 'Basement Parking',
      type: 'parking',
      capacity: 120,
      riskProfile: 'low',
      assemblyPoint: 'Street level, Gate A (main road)',
      exitRoute: 'Follow green pedestrian walkways to Level 0. Do not use vehicle ramps.',
      notes: 'CO2 extinguisher at Parking Level B1, Column P4.',
      isSeniorZone: false,
      qrToken: 'parking-jkl012',
    },
    {
      zoneId: 'zone-pool',
      name: 'Rooftop Pool',
      type: 'pool',
      capacity: 30,
      riskProfile: 'medium',
      assemblyPoint: 'Car park entrance, Level 0, Gate A',
      exitRoute: 'Exit through rooftop fire door to Stairwell C. Do not use lifts.',
      notes: 'Defibrillator at poolside guard station. Pool chemical storage locked.',
      isSeniorZone: false,
      qrToken: 'pool-mno345',
    },
    {
      zoneId: 'zone-restaurant',
      name: 'Fine Dining Restaurant',
      type: 'restaurant',
      capacity: 65,
      riskProfile: 'medium',
      assemblyPoint: 'Garden terrace, west side',
      exitRoute: 'Exit through restaurant terrace doors to garden. Proceed to west gate.',
      notes: 'Fire blanket at service station. Emergency lighting installed.',
      isSeniorZone: false,
      qrToken: 'restaurant-pqr678',
    },
    {
      zoneId: 'zone-spa',
      name: 'Wellness Spa & Gym',
      type: 'spa',
      capacity: 25,
      riskProfile: 'low',
      assemblyPoint: 'Main lobby, ground level',
      exitRoute: 'Exit through spa main entrance to corridor. Turn right to main lobby.',
      notes: 'First aid kit at reception. Emergency shower in treatment room.',
      isSeniorZone: false,
      qrToken: 'spa-stu901',
    },
    {
      zoneId: 'zone-conference',
      name: 'Conference Center',
      type: 'conference',
      capacity: 150,
      riskProfile: 'medium',
      assemblyPoint: 'Main entrance plaza',
      exitRoute: 'Use conference center emergency exits. Proceed to main plaza.',
      notes: 'Multiple emergency exits. AED at registration desk.',
      isSeniorZone: false,
      qrToken: 'conference-vwx234',
    },
  ],

  staff: [
    { staffId: 'admin-001', name: 'Priya Kapoor', role: 'admin', assignedZones: [], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23456', email: 'priya.kapoor@grandorchid.com' },
    { staffId: 'manager-001', name: 'Anil Mehta', role: 'dutyManager', assignedZones: [], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23457', email: 'anil.mehta@grandorchid.com' },
    { staffId: 'warden-001', name: 'Ravi Sharma', role: 'warden', assignedZones: ['zone-floor7'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23458', email: 'ravi.sharma@grandorchid.com' },
    { staffId: 'warden-002', name: 'Meena Patel', role: 'warden', assignedZones: ['zone-kitchen'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23459', email: 'meena.patel@grandorchid.com' },
    { staffId: 'warden-003', name: 'Suresh Nair', role: 'seniorWarden', assignedZones: ['zone-lobby'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23460', email: 'suresh.nair@grandorchid.com' },
    { staffId: 'warden-004', name: 'Deepa Joshi', role: 'warden', assignedZones: ['zone-parking'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23461', email: 'deepa.joshi@grandorchid.com' },
    { staffId: 'warden-005', name: 'Vikram Singh', role: 'warden', assignedZones: ['zone-pool'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23462', email: 'vikram.singh@grandorchid.com' },
    { staffId: 'warden-006', name: 'Amit Kumar', role: 'warden', assignedZones: ['zone-restaurant'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23463', email: 'amit.kumar@grandorchid.com' },
    { staffId: 'warden-007', name: 'Nisha Verma', role: 'warden', assignedZones: ['zone-spa'], isOnDuty: false, currentShift: 'morning', phone: '+91-98201-23464', email: 'nisha.verma@grandorchid.com' },
    { staffId: 'warden-008', name: 'Rohit Gupta', role: 'seniorWarden', assignedZones: ['zone-conference'], isOnDuty: true, currentShift: 'evening', phone: '+91-98201-23465', email: 'rohit.gupta@grandorchid.com' },
  ],

  activeIncident: {
    incidentId: 'incident-demo-shared-001',
    venueId: 'demo-venue-001',
    crisisType: 'fire',
    triggeredBy: 'guestSOS',
    triggeredAt: new Date(Date.now() - 2 * 60000),
    triggeredByZoneId: 'zone-floor7',
    status: 'active',
    resolvedAt: null,
    currentSeverity: 3,
    severityHistory: [{ level: 3, setAt: new Date(Date.now() - 2 * 60000), setBy: 'system' }],
    commandHolder: 'admin-001',
    autonomousModeActive: false,
    affectedZones: ['zone-floor7'],
  },
  zoneStatuses: {
    'zone-lobby': { zoneId: 'zone-lobby', wardenId: 'warden-003', wardenName: 'Suresh Nair', notifiedAt: new Date(Date.now() - 2 * 60000), acknowledgedAt: null, statusLabel: 'notified', checklistCompletion: 0, completedTaskIds: [], lastUpdateAt: new Date(Date.now() - 2 * 60000) },
    'zone-kitchen': { zoneId: 'zone-kitchen', wardenId: 'warden-002', wardenName: 'Meena Patel', notifiedAt: new Date(Date.now() - 2 * 60000), acknowledgedAt: null, statusLabel: 'notified', checklistCompletion: 0, completedTaskIds: [], lastUpdateAt: new Date(Date.now() - 2 * 60000) },
    'zone-floor7': { zoneId: 'zone-floor7', wardenId: 'warden-001', wardenName: 'Ravi Sharma', notifiedAt: new Date(Date.now() - 2 * 60000), acknowledgedAt: null, statusLabel: 'notified', checklistCompletion: 0, completedTaskIds: [], lastUpdateAt: new Date(Date.now() - 2 * 60000) },
    'zone-parking': { zoneId: 'zone-parking', wardenId: 'warden-004', wardenName: 'Deepa Joshi', notifiedAt: new Date(Date.now() - 2 * 60000), acknowledgedAt: null, statusLabel: 'standby', checklistCompletion: 0, completedTaskIds: [], lastUpdateAt: new Date(Date.now() - 2 * 60000) },
  },
  alertFeed: [
    {
      sosId: 'sos-demo-shared-001',
      zoneId: 'zone-floor7',
      crisisType: 'fire',
      urgency: 'high',
      affectedCount: 3,
      timestamp: new Date(Date.now() - 2 * 60000),
      guestSessionId: 'guest-session-floor7-ghi789',
    },
  ],
  timeline: [
    {
      eventId: 'event-demo-001',
      eventType: 'sos_received',
      actor: 'guest',
      description: 'Guest SOS from Floor 7: fire, urgency: high, affected: 3',
      timestamp: new Date(Date.now() - 2 * 60000),
    },
  ],
  aiSuggestions: [
    {
      id: 'ai-suggestion-001',
      type: 'risk_assessment',
      text: 'Zone Floor 7 shows elevated temperature patterns. Recommend HVAC inspection.',
      urgency: 'low',
      data: 'Zone: Floor 7 | Temp: +2.3°C | Humidity: 65%',
      timestamp: new Date(Date.now() - 15 * 60000),
    },
    {
      id: 'ai-suggestion-002', 
      type: 'capacity_warning',
      text: 'Restaurant zone approaching 85% capacity. Consider crowd management.',
      urgency: 'medium',
      data: 'Zone: Restaurant | Current: 55/65 | Peak: 18:30',
      timestamp: new Date(Date.now() - 8 * 60000),
    },
  ],
  cameraEvents: [
    {
      id: 'camera-event-001',
      cameraId: 'CAM-LOBBY-01',
      location: 'Main Lobby Entrance',
      observation: 'Increased foot traffic detected',
      confidence: 92,
      timestamp: new Date(Date.now() - 3 * 60000),
    },
    {
      id: 'camera-event-002',
      cameraId: 'CAM-PARKING-01',
      location: 'Basement Parking Level B1',
      observation: 'Vehicle blocking emergency exit route',
      confidence: 87,
      timestamp: new Date(Date.now() - 7 * 60000),
    },
  ],
  broadcastMessage: 'FIRE drill started. Staff and guests should follow posted instructions.',
};

const EMPTY_STATE = {
  venue: {
    venueId: null,
    name: 'Unconfigured Venue',
    type: 'other',
    address: '',
    timezone: 'Asia/Kolkata',
    setupComplete: false,
    complianceAcknowledged: false,
    settings: {
      warden_ack_timeout_seconds: 90,
      admin_command_timeout_seconds: 90,
      full_escalation_timeout_seconds: 180,
      level3_requires_human_confirm: true,
    },
  },
  zones: [],
  staff: [],
  playbooks: [],
  activeIncident: null,
  zoneStatuses: {},
  alertFeed: [],
  timeline: [],
  aiSuggestions: [],
  cameraEvents: [],
  loading: true,
};

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function now() {
  return new Date();
}

function demoReducer(state, action) {
  switch (action.type) {
    case 'START_INCIDENT': {
      const { crisisType, severity, triggeredBy, triggeredByZoneId } = action.payload;
      const incident = {
        incidentId: `incident-${generateId()}`,
        venueId: state.venue.venueId,
        crisisType,
        triggeredBy: triggeredBy || 'staffReport',
        triggeredAt: now(),
        triggeredByZoneId: triggeredByZoneId || state.zones[0].zoneId,
        status: 'active',
        resolvedAt: null,
        currentSeverity: severity || 2,
        severityHistory: [{ level: severity || 2, setAt: now(), setBy: 'system' }],
        commandHolder: 'admin-001',
        autonomousModeActive: false,
        affectedZones: [triggeredByZoneId || state.zones[0].zoneId],
      };

      // Initialize zone statuses
      const zoneStatuses = {};
      state.zones.forEach(zone => {
        const warden = state.staff.find(s => s.assignedZones.includes(zone.zoneId));
        zoneStatuses[zone.zoneId] = {
          zoneId: zone.zoneId,
          wardenId: warden?.staffId || null,
          wardenName: warden?.name || null,
          notifiedAt: now(),
          acknowledgedAt: null,
          statusLabel: 'notified',
          checklistCompletion: 0,
          completedTaskIds: [],
          lastUpdateAt: now(),
        };
      });

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'incident_started',
        actor: 'system',
        description: `Incident started: ${crisisType.toUpperCase()} at Level ${severity || 2}. Triggered by ${triggeredBy || 'staff report'}.`,
        timestamp: now(),
      };

      const triggerZone = state.zones.find(z => z.zoneId === (triggeredByZoneId || state.zones[0].zoneId));

      const aiSuggestions = [
        {
          id: `ai-${generateId()}`,
          type: 'response_recommendation',
          text: `${crisisType === 'fire' ? 'Smoke spreading from ' + (triggerZone?.name || 'affected zone') + '. Recommend isolating elevators and routing guests to stairwells.' : crisisType === 'medical' ? 'Medical emergency at ' + (triggerZone?.name || 'zone') + '. Nearest AED is at reception desk. Ambulance staging at Gate B.' : crisisType === 'security' ? 'Security event at ' + (triggerZone?.name || 'zone') + '. Silent alert activated. Recommend zone containment.' : 'Flooding detected at ' + (triggerZone?.name || 'zone') + '. Check electrical panels and drainage systems.'}`,
          urgency: severity >= 3 ? 'high' : 'medium',
          data: `Zone: ${triggerZone?.name || 'Zone'} | Severity: Level ${severity || 2}`,
          timestamp: now(),
        },
        {
          id: `ai-${generateId()}`,
          type: 'capacity_warning',
          text: `${triggerZone?.name || 'Zone'} has ${triggerZone?.capacity || 0} max capacity. Ensure evacuation routes can handle full load.`,
          urgency: 'medium',
          data: `Exit route: ${triggerZone?.exitRoute || 'Check venue map'}`,
          timestamp: now(),
        },
      ];

      const cameraEvents = [
        {
          id: `cam-${generateId()}`,
          cameraId: `CAM-${(triggerZone?.type || 'zone').toUpperCase()}-01`,
          location: triggerZone?.name || 'Affected Zone',
          observation: crisisType === 'fire' ? 'Smoke detected in corridor' : crisisType === 'medical' ? 'Person down detected' : 'Unusual activity detected',
          confidence: 89,
          timestamp: now(),
          isSimulated: true,
        },
      ];

      try {
        localStorage.setItem('crisissync:demo:incident', JSON.stringify({
          action: 'start',
          incident: { crisisType, severity: severity || 2, triggeredByZoneId: triggeredByZoneId || state.zones[0].zoneId },
          timestamp: now().toISOString(),
        }));
      } catch {
        // Storage unavailable.
      }

      return {
        ...state,
        activeIncident: incident,
        zoneStatuses,
        timeline: [timelineEntry],
        alertFeed: [{
          sosId: `drill-${generateId()}`,
          zoneId: triggeredByZoneId || state.zones[0].zoneId,
          crisisType,
          urgency: severity >= 3 ? 'high' : 'medium',
          affectedCount: 3,
          timestamp: now(),
          guestSessionId: 'admin-drill',
        }],
        aiSuggestions,
        cameraEvents,
        broadcastMessage: `${crisisType.toUpperCase()} drill started. Staff and guests should follow posted instructions.`,
      };
    }

    case 'ADD_SOS': {
      const { zoneId, crisisType, urgency, affectedCount } = action.payload;
      const zone = state.zones.find(z => z.zoneId === zoneId);
      const sos = {
        sosId: `sos-${generateId()}`,
        zoneId,
        crisisType,
        urgency,
        affectedCount,
        timestamp: now(),
        guestSessionId: `session-${generateId()}`,
      };

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'sos_received',
        actor: 'guest',
        description: `Guest SOS from ${zone?.name || zoneId}: ${crisisType}, urgency: ${urgency}, affected: ${affectedCount}`,
        timestamp: now(),
      };

      // Update affected zones
      const affectedZones = state.activeIncident
        ? [...new Set([...state.activeIncident.affectedZones, zoneId])]
        : [zoneId];

      return {
        ...state,
        alertFeed: [sos, ...state.alertFeed],
        timeline: [...state.timeline, timelineEntry],
        activeIncident: state.activeIncident
          ? { ...state.activeIncident, affectedZones }
          : state.activeIncident,
      };
    }

    case 'UPDATE_ZONE_STATUS': {
      const { zoneId, statusLabel } = action.payload;
      const zone = state.zones.find(z => z.zoneId === zoneId);
      const prevStatus = state.zoneStatuses[zoneId];

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'zone_status_changed',
        actor: prevStatus?.wardenName || 'warden',
        description: `${zone?.name || zoneId} status changed to: ${statusLabel}`,
        timestamp: now(),
      };

      return {
        ...state,
        zoneStatuses: {
          ...state.zoneStatuses,
          [zoneId]: {
            ...prevStatus,
            statusLabel,
            lastUpdateAt: now(),
          },
        },
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'ACKNOWLEDGE_ZONE': {
      const { zoneId } = action.payload;
      const zone = state.zones.find(z => z.zoneId === zoneId);
      const prevStatus = state.zoneStatuses[zoneId];

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'warden_acknowledged',
        actor: prevStatus?.wardenName || 'warden',
        description: `${prevStatus?.wardenName || 'Warden'} acknowledged for ${zone?.name || zoneId}`,
        timestamp: now(),
      };

      return {
        ...state,
        zoneStatuses: {
          ...state.zoneStatuses,
          [zoneId]: {
            ...prevStatus,
            acknowledgedAt: now(),
            statusLabel: 'acknowledged',
            lastUpdateAt: now(),
          },
        },
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'UPDATE_CHECKLIST': {
      const { zoneId, completion, completedTaskIds } = action.payload;
      const prevStatus = state.zoneStatuses[zoneId];

      return {
        ...state,
        zoneStatuses: {
          ...state.zoneStatuses,
          [zoneId]: {
            ...prevStatus,
            checklistCompletion: completion,
            completedTaskIds: completedTaskIds || prevStatus?.completedTaskIds || [],
            lastUpdateAt: now(),
          },
        },
      };
    }

    case 'SET_SEVERITY': {
      const { severity, setBy } = action.payload;
      if (!state.activeIncident) return state;

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'severity_changed',
        actor: setBy || 'admin',
        description: `Severity changed to Level ${severity}`,
        timestamp: now(),
      };

      return {
        ...state,
        activeIncident: {
          ...state.activeIncident,
          currentSeverity: severity,
          severityHistory: [
            ...state.activeIncident.severityHistory,
            { level: severity, setAt: now(), setBy: setBy || 'admin' },
          ],
        },
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'SET_AI_SUGGESTIONS': {
      return { ...state, aiSuggestions: action.payload };
    }

    case 'ADD_CAMERA_EVENT': {
      const event = {
        id: generateId(),
        ...action.payload,
        isSimulated: true,
        timestamp: now(),
      };
      return {
        ...state,
        cameraEvents: [event, ...state.cameraEvents],
      };
    }

    case 'RESOLVE_INCIDENT': {
      if (!state.activeIncident) return state;

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'incident_resolved',
        actor: 'admin',
        description: 'Incident marked as resolved.',
        timestamp: now(),
      };

      try {
        localStorage.setItem('crisissync:demo:incident', JSON.stringify({
          action: 'resolve',
          timestamp: now().toISOString(),
        }));
      } catch {
        // Storage unavailable.
      }

      return {
        ...state,
        activeIncident: {
          ...state.activeIncident,
          status: 'resolved',
          resolvedAt: now(),
        },
        broadcastMessage: 'Drill resolved. Staff and guests may return to normal operations.',
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'BROADCAST': {
      const timelineEntry = {
        eventId: generateId(),
        eventType: action.payload.type || 'broadcast_sent',
        actor: 'admin',
        description: `Broadcast sent: ${action.payload.message}`,
        timestamp: now(),
      };

      try {
        localStorage.setItem('crisissync:demo:broadcast', JSON.stringify({
          ...action.payload,
          timestamp: now().toISOString(),
        }));
      } catch {
        // Demo broadcast still updates in-memory state if storage is unavailable.
      }

      return {
        ...state,
        broadcastMessage: action.payload.message,
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'RESET': {
      return INITIAL_STATE;
    }

    case 'LOAD_FIRESTORE': {
      const payload = action.payload;
      if (!payload) return { ...EMPTY_STATE, loading: false };
      return {
        ...state,
        ...payload,
        activeIncident: state.activeIncident,
        zoneStatuses: state.zoneStatuses,
        alertFeed: state.alertFeed,
        timeline: state.timeline,
        aiSuggestions: state.aiSuggestions,
        cameraEvents: state.cameraEvents,
        loading: false,
      };
    }

    case 'UPDATE_STAFF_LOCAL': {
      const { staffId, patch } = action.payload;
      return {
        ...state,
        staff: state.staff.map(member => member.staffId === staffId ? { ...member, ...patch } : member),
      };
    }

    case 'UPDATE_PLAYBOOK_LOCAL': {
      const { playbookId, patch } = action.payload;
      return {
        ...state,
        playbooks: state.playbooks.map(book => book.playbookId === playbookId ? { ...book, ...patch } : book),
      };
    }

    case 'SYNC_ZONE_STATUS': {
      const { zoneId, statusLabel, wardenName } = action.payload;
      const zone = state.zones.find(z => z.zoneId === zoneId);
      const prevStatus = state.zoneStatuses[zoneId];

      const timelineEntry = {
        eventId: generateId(),
        eventType: 'zone_status_changed',
        actor: wardenName || prevStatus?.wardenName || 'warden',
        description: `${zone?.name || zoneId} status changed to: ${statusLabel}`,
        timestamp: now(),
      };

      return {
        ...state,
        zoneStatuses: {
          ...state.zoneStatuses,
          [zoneId]: {
            ...prevStatus,
            statusLabel,
            lastUpdateAt: now(),
          },
        },
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'SYNC_CHECKLIST': {
      const { zoneId, completion, completedTaskIds } = action.payload;
      const prevStatus = state.zoneStatuses[zoneId];
      return {
        ...state,
        zoneStatuses: {
          ...state.zoneStatuses,
          [zoneId]: {
            ...prevStatus,
            checklistCompletion: completion,
            completedTaskIds: completedTaskIds || prevStatus?.completedTaskIds || [],
            lastUpdateAt: now(),
          },
        },
      };
    }

    default:
      return state;
  }
}

export function DemoProvider({ children, seedDemo = true }) {
  const [state, dispatch] = useReducer(demoReducer, seedDemo ? INITIAL_STATE : EMPTY_STATE);

  useEffect(() => {
    if (seedDemo) return undefined;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      dispatch({ type: 'LOAD_FIRESTORE', payload: null });
      return undefined;
    }
    return subscribeVenueData(uid, (payload) => {
      dispatch({ type: 'LOAD_FIRESTORE', payload });
    }, (error) => {
      console.error(error);
      dispatch({ type: 'LOAD_FIRESTORE', payload: null });
    });
  }, [seedDemo]);

  // Listen for cross-dashboard demo sync events from staff PWA
  useEffect(() => {
    if (!seedDemo) return undefined;

    // Apply any zone status that was set before admin opened
    try {
      const storedZoneStatus = localStorage.getItem('crisissync:demo:zoneStatus');
      if (storedZoneStatus) {
        dispatch({ type: 'SYNC_ZONE_STATUS', payload: JSON.parse(storedZoneStatus) });
      }
      const storedChecklist = localStorage.getItem('crisissync:demo:checklist');
      if (storedChecklist) {
        dispatch({ type: 'SYNC_CHECKLIST', payload: JSON.parse(storedChecklist) });
      }
    } catch {
      // Ignore malformed stored data.
    }

    const handleStorage = (event) => {
      try {
        if (event.key === 'crisissync:demo:zoneStatus' && event.newValue) {
          dispatch({ type: 'SYNC_ZONE_STATUS', payload: JSON.parse(event.newValue) });
        }
        if (event.key === 'crisissync:demo:checklist' && event.newValue) {
          dispatch({ type: 'SYNC_CHECKLIST', payload: JSON.parse(event.newValue) });
        }
      } catch {
        // Ignore malformed events.
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [seedDemo]);

  const actions = {
    startIncident: useCallback((payload) => dispatch({ type: 'START_INCIDENT', payload }), []),
    addSOS: useCallback((payload) => dispatch({ type: 'ADD_SOS', payload }), []),
    updateZoneStatus: useCallback((payload) => dispatch({ type: 'UPDATE_ZONE_STATUS', payload }), []),
    acknowledgeZone: useCallback((payload) => dispatch({ type: 'ACKNOWLEDGE_ZONE', payload }), []),
    updateChecklist: useCallback((payload) => dispatch({ type: 'UPDATE_CHECKLIST', payload }), []),
    setSeverity: useCallback((payload) => dispatch({ type: 'SET_SEVERITY', payload }), []),
    setAISuggestions: useCallback((payload) => dispatch({ type: 'SET_AI_SUGGESTIONS', payload }), []),
    addCameraEvent: useCallback((payload) => dispatch({ type: 'ADD_CAMERA_EVENT', payload }), []),
    resolveIncident: useCallback(() => dispatch({ type: 'RESOLVE_INCIDENT' }), []),
    broadcast: useCallback((payload) => dispatch({ type: 'BROADCAST', payload }), []),
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
    updateStaffMember: useCallback(async ({ staffId, patch }) => {
      dispatch({ type: 'UPDATE_STAFF_LOCAL', payload: { staffId, patch } });
      if (!seedDemo && state.venue?.venueId) {
        await updateStaffMember(state.venue.venueId, staffId, patch);
      }
    }, [seedDemo, state.venue?.venueId]),
    updatePlaybook: useCallback(async ({ playbookId, patch }) => {
      dispatch({ type: 'UPDATE_PLAYBOOK_LOCAL', payload: { playbookId, patch } });
      if (!seedDemo && state.venue?.venueId) {
        await updatePlaybook(state.venue.venueId, playbookId, patch);
      }
    }, [seedDemo, state.venue?.venueId]),
  };

  return (
    <DemoContext.Provider value={{ state, actions }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) return { state: {}, actions: {} };
  return ctx;
}
