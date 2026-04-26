import { createContext, useContext, useReducer, useCallback } from 'react';

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
  ],

  staff: [
    { staffId: 'admin-001', name: 'Priya Kapoor', role: 'admin', assignedZones: [], isOnDuty: true, currentShift: 'evening' },
    { staffId: 'manager-001', name: 'Anil Mehta', role: 'dutyManager', assignedZones: [], isOnDuty: true, currentShift: 'evening' },
    { staffId: 'warden-001', name: 'Ravi Sharma', role: 'warden', assignedZones: ['zone-floor7'], isOnDuty: true, currentShift: 'evening' },
    { staffId: 'warden-002', name: 'Meena Patel', role: 'warden', assignedZones: ['zone-kitchen'], isOnDuty: true, currentShift: 'evening' },
    { staffId: 'warden-003', name: 'Suresh Nair', role: 'seniorWarden', assignedZones: ['zone-lobby'], isOnDuty: true, currentShift: 'evening' },
    { staffId: 'warden-004', name: 'Deepa Joshi', role: 'warden', assignedZones: ['zone-parking'], isOnDuty: true, currentShift: 'evening' },
    { staffId: 'warden-005', name: 'Vikram Singh', role: 'warden', assignedZones: ['zone-pool'], isOnDuty: true, currentShift: 'evening' },
  ],

  activeIncident: null,
  zoneStatuses: {},
  alertFeed: [],
  timeline: [],
  aiSuggestions: [],
  cameraEvents: [],
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

      return {
        ...state,
        activeIncident: incident,
        zoneStatuses,
        timeline: [timelineEntry],
        alertFeed: [],
        aiSuggestions: [],
        cameraEvents: [],
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

      return {
        ...state,
        activeIncident: {
          ...state.activeIncident,
          status: 'resolved',
          resolvedAt: now(),
        },
        timeline: [...state.timeline, timelineEntry],
      };
    }

    case 'RESET': {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(demoReducer, INITIAL_STATE);

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
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
  };

  return (
    <DemoContext.Provider value={{ state, actions }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
