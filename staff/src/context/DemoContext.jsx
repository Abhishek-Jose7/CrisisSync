/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useReducer } from 'react';

const StaffDemoContext = createContext(null);

const BASE_STATE = {
  venueId: 'demo-venue-001',
  mode: 'main',
  staffUser: null,
  zones: [
    { zoneId: 'zone-floor7', name: 'Floor 7', type: 'floor' },
    { zoneId: 'zone-lobby', name: 'Lobby', type: 'lobby' },
  ],
  activeIncident: null,
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
    'zone-floor7': { statusLabel: 'notified' },
    'zone-lobby': { statusLabel: 'acknowledged' }
  },
  alertFeed: [],
  timeline: []
};

const storageKey = (mode, uid) => `crisissync:staff:${mode}:profile:${uid}`;

function createInitialState(mode) {
  return {
    ...BASE_STATE,
    mode,
    staffUser: null,
  };
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
