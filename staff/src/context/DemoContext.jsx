/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const StaffDemoContext = createContext(null);

const BASE_STATE = {
  venueId: 'demo-venue-001',
  venueName: 'Grand Orchid Hotel',
  mode: 'main',
  staffUser: null,
  zones: [
    { zoneId: 'zone-lobby', name: 'Ground Floor Lobby', type: 'lobby' },
    { zoneId: 'zone-kitchen', name: 'Kitchen', type: 'kitchen' },
    { zoneId: 'zone-floor7', name: 'Floor 7', type: 'floor' },
    { zoneId: 'zone-parking', name: 'Basement Parking', type: 'parking' },
    { zoneId: 'zone-pool', name: 'Rooftop Pool', type: 'pool' },
    { zoneId: 'zone-restaurant', name: 'Fine Dining Restaurant', type: 'restaurant' },
    { zoneId: 'zone-spa', name: 'Wellness Spa & Gym', type: 'spa' },
    { zoneId: 'zone-conference', name: 'Conference Center', type: 'conference' },
  ],
  activeIncident: { crisisType: 'fire', severity: 3, triggeredByZoneId: 'zone-floor7' },
  checklist: [
    { id: 'f1', task: 'Knock on all room doors. Use master key if no response.', priority: 1 },
    { id: 'f2', task: 'Direct all guests to the nearest stairwell. Do not allow lift use.', priority: 2 },
    { id: 'f3', task: 'Conduct a headcount at the stairwell exit.', priority: 3 },
    { id: 'f4', task: 'Report headcount and zone status to admin board.', priority: 4 },
  ],
  completedTaskIds: [],
  zoneStatus: 'notified',
  aiTips: [
    { tip: 'Check stairwell 7B immediately, smoke reported.', priority: 1 },
    { tip: 'Keep fire doors closed after checking rooms to limit spread.', priority: 2 },
    { tip: 'CO2 extinguisher is located near lift lobby if needed for small electrical fires.', priority: 3 }
  ],
  allZoneStatuses: {
    'zone-lobby': { statusLabel: 'acknowledged' },
    'zone-kitchen': { statusLabel: 'notified' },
    'zone-floor7': { statusLabel: 'notified' },
    'zone-parking': { statusLabel: 'clear' },
    'zone-pool': { statusLabel: 'clear' },
    'zone-restaurant': { statusLabel: 'notified' },
    'zone-spa': { statusLabel: 'clear' },
    'zone-conference': { statusLabel: 'clear' },
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
      eventId: 'staff-demo-shared-001',
      eventType: 'sos_received',
      actor: 'guest',
      description: 'Guest SOS from Floor 7: fire, urgency: high, affected: 3',
      timestamp: new Date(Date.now() - 2 * 60000),
    },
  ],
  broadcastMessage: 'FIRE drill started. Staff and guests should follow posted instructions.'
};

const storageKey = (mode, uid) => `crisissync:staff:${mode}:profile:${uid}`;

function createInitialState(mode) {
  const base = {
    ...BASE_STATE,
    mode,
    staffUser: null,
  };
  return mode === 'demo' ? base : { ...base, activeIncident: null, alertFeed: [], timeline: [] };
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, staffUser: action.payload };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        staffUser: {
          ...state.staffUser,
          ...action.payload,
          profileComplete: true,
        },
      };
    case 'LOGOUT':
      return createInitialState(state.mode);
    case 'SET_INCIDENT':
      return { ...state, activeIncident: action.payload, zoneStatus: 'notified', completedTaskIds: [] };
    case 'TOGGLE_TASK': {
      const done = state.completedTaskIds.includes(action.payload);
      const completedTaskIds = done
        ? state.completedTaskIds.filter(id => id !== action.payload)
        : [...state.completedTaskIds, action.payload];
      return { ...state, completedTaskIds };
    }
    case 'UPDATE_STATUS':
      return { 
        ...state, 
        zoneStatus: action.payload,
        allZoneStatuses: {
            ...state.allZoneStatuses,
            [state.staffUser?.assignedZoneId]: { statusLabel: action.payload }
        }
      };
    case 'CLEAR_INCIDENT':
      return { ...state, activeIncident: null, completedTaskIds: [], zoneStatus: 'clear', alertFeed: [], timeline: [] };
    case 'DEMO_BROADCAST':
      return {
        ...state,
        broadcastMessage: action.payload.message,
        activeIncident: action.payload.type === 'drill_resolved' ? null : state.activeIncident,
        zoneStatus: action.payload.type === 'drill_resolved' ? 'clear' : state.zoneStatus,
      };
    case 'ADD_SOS': {
      const { zoneId, crisisType, urgency, affectedCount } = action.payload;
      const zone = state.zones.find(z => z.zoneId === zoneId);
      const sos = {
        sosId: `sos-${Math.random().toString(36).slice(2, 11)}`,
        zoneId,
        crisisType,
        urgency,
        affectedCount,
        timestamp: new Date(),
        guestSessionId: `session-${Math.random().toString(36).slice(2, 11)}`,
      };

      const timelineEntry = {
        eventId: Math.random().toString(36).slice(2, 11),
        eventType: 'sos_received',
        actor: 'guest',
        description: `Guest SOS from ${zone?.name || zoneId}: ${crisisType}, urgency: ${urgency}, affected: ${affectedCount}`,
        timestamp: new Date(),
      };

      return {
        ...state,
        alertFeed: [sos, ...state.alertFeed],
        timeline: [timelineEntry, ...state.timeline],
      };
    }
    default:
      return state;
  }
}

export function StaffDemoProvider({ children, mode = 'main' }) {
  const [state, dispatch] = useReducer(reducer, mode, createInitialState);

  const actions = useMemo(() => ({
    login: (firebaseUser) => {
      const savedProfile = localStorage.getItem(storageKey(mode, firebaseUser.uid));
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      dispatch({
        type: 'LOGIN',
        payload: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || profile.name || 'Staff member',
          role: profile.role || 'warden',
          assignedZoneId: profile.assignedZoneId || 'zone-floor7',
          currentShift: profile.currentShift || 'evening',
          profileComplete: Boolean(profile.profileComplete),
        },
      });
      return Boolean(profile.profileComplete);
    },
    completeOnboarding: (profile) => {
      if (!state.staffUser?.uid) return;
      const completedProfile = { ...state.staffUser, ...profile, profileComplete: true };
      localStorage.setItem(storageKey(mode, state.staffUser.uid), JSON.stringify(completedProfile));
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: completedProfile });
    },
    hasCompletedProfile: (uid) => {
      const savedProfile = localStorage.getItem(storageKey(mode, uid));
      if (!savedProfile) return false;
      return Boolean(JSON.parse(savedProfile).profileComplete);
    },
    logout: () => {
      localStorage.removeItem(storageKey(mode, state.staffUser?.uid));
      dispatch({ type: 'LOGOUT' });
    },
    setIncident: (sys) => dispatch({ type: 'SET_INCIDENT', payload: sys }),
    toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
    markTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
    updateStatus: (status) => dispatch({ type: 'UPDATE_STATUS', payload: status }),
    clearIncident: () => dispatch({ type: 'CLEAR_INCIDENT' }),
    addSOS: (payload) => dispatch({ type: 'ADD_SOS', payload })
  }), [mode, state.staffUser]);

  useEffect(() => {
    if (mode !== 'demo') return undefined;

    const applyStoredBroadcast = () => {
      try {
        const raw = localStorage.getItem('crisissync:demo:broadcast');
        if (raw) dispatch({ type: 'DEMO_BROADCAST', payload: JSON.parse(raw) });
      } catch {
        // Ignore malformed demo broadcast data.
      }
    };

    const handleStorage = (event) => {
      if (event.key === 'crisissync:demo:broadcast' && event.newValue) {
        dispatch({ type: 'DEMO_BROADCAST', payload: JSON.parse(event.newValue) });
      }
    };

    applyStoredBroadcast();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [mode]);

  return (
    <StaffDemoContext.Provider value={{ state, actions }}>
      {children}
    </StaffDemoContext.Provider>
  );
}

export function useStaffDemo() {
  const ctx = useContext(StaffDemoContext);
  if (!ctx) return { state: createInitialState('main'), actions: {} };
  return ctx;
}
