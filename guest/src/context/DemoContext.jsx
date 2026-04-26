/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../shared/firebase/config';

const GuestDemoContext = createContext(null);

const ZONES_BY_TOKEN = {
  'lobby-abc123': {
    venueName: 'Grand Orchid Hotel',
    zoneId: 'zone-lobby',
    zoneName: 'Ground Floor Lobby',
    exitRoute: 'Use the main entrance or east emergency exit. Avoid the lift lobby.',
    assemblyPoint: 'Car park entrance, ground level',
  },
  'kitchen-def456': {
    venueName: 'Grand Orchid Hotel',
    zoneId: 'zone-kitchen',
    zoneName: 'Kitchen',
    exitRoute: 'Exit through the kitchen back door to the service corridor, then turn right to Exit B.',
    assemblyPoint: 'Service yard, north entrance',
  },
  'floor7-ghi789': {
    venueName: 'Grand Orchid Hotel',
    zoneId: 'zone-floor7',
    zoneName: 'Floor 7',
    exitRoute: 'Turn left from the lift lobby and take Stairwell B. Do not use lifts.',
    assemblyPoint: 'Car park entrance, Level 0, Gate B',
  },
  'parking-jkl012': {
    venueName: 'Grand Orchid Hotel',
    zoneId: 'zone-parking',
    zoneName: 'Basement Parking',
    exitRoute: 'Follow green pedestrian walkways to Level 0. Do not use vehicle ramps.',
    assemblyPoint: 'Street level, Gate A',
  },
};

const DEFAULT_ZONE = ZONES_BY_TOKEN['floor7-ghi789'];

const BASE_STATE = {
  mode: 'main',
  guestUser: null,
  authReady: false,
  venueName: 'Grand Orchid Hotel',
  zoneId: null,
  zoneName: null,
  qrToken: null,
  sessionId: null,
  exitRoute: null,
  assemblyPoint: null,
  
  // Incident State
  activeIncident: null, // null | 'fire' | 'medical' | 'security'
  severityLevel: null,
  broadcastMessage: null,
  
  // User interaction
  sosSent: false,
  sosUrgency: null, // 'safe', 'help'
};

function createInitialState(mode) {
  return {
    ...BASE_STATE,
    mode,
    authReady: mode === 'demo',
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_GUEST':
      return {
        ...state,
        authReady: true,
        guestUser: {
          uid: action.payload.uid,
          email: action.payload.email,
          name: action.payload.displayName || 'Guest',
        },
      };
    case 'AUTH_READY':
      return { ...state, authReady: true, guestUser: null };
    case 'START_SESSION': {
      const zone = ZONES_BY_TOKEN[action.payload] || DEFAULT_ZONE;
      return {
        ...state,
        ...zone,
        qrToken: action.payload,
        sessionId: `guest-session-${action.payload}`,
        activeIncident: null,
        severityLevel: null,
        broadcastMessage: null,
        sosSent: false,
        sosUrgency: null,
      };
    }
    case 'TRIGGER_INCIDENT':
      return { 
        ...state, 
        activeIncident: 'fire',
        severityLevel: 3,
        broadcastMessage: 'EVACUATE IMMEDIATELY VIA STAIRS.'
      };
    case 'SEND_SOS':
      return { ...state, sosSent: true, sosUrgency: action.payload };
    case 'RESOLVE_INCIDENT':
      return { ...state, activeIncident: null, severityLevel: null, broadcastMessage: null, sosSent: false };
    default:
      return state;
  }
}

export function GuestDemoProvider({ children, mode = 'main' }) {
  const [state, dispatch] = useReducer(reducer, mode, createInitialState);

  useEffect(() => {
    if (mode === 'demo') return undefined;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) dispatch({ type: 'LOGIN_GUEST', payload: user });
      else dispatch({ type: 'AUTH_READY' });
    });
    return unsubscribe;
  }, [mode]);

  const actions = useMemo(() => ({
    loginGuest: (user) => dispatch({ type: 'LOGIN_GUEST', payload: user }),
    startSession: (token) => dispatch({ type: 'START_SESSION', payload: token }),
    triggerIncident: () => dispatch({ type: 'TRIGGER_INCIDENT' }),
    sendSos: (urgency) => dispatch({ type: 'SEND_SOS', payload: urgency }),
    resolveIncident: () => dispatch({ type: 'RESOLVE_INCIDENT' })
  }), []);

  return (
    <GuestDemoContext.Provider value={{ state, actions }}>
      {children}
    </GuestDemoContext.Provider>
  );
}

export function useGuestDemo() {
  const ctx = useContext(GuestDemoContext);
  if (!ctx) return { state: createInitialState('main'), actions: {} };
  return ctx;
}
