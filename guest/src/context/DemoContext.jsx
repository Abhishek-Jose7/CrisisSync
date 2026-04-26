import { createContext, useContext, useReducer } from 'react';

const GuestDemoContext = createContext(null);

const INITIAL_STATE = {
  venueName: 'Grand Orchid Hotel',
  zoneId: 'zone-lobby',
  zoneName: 'Lobby',
  exitRoute: 'Exit through main glass doors immediately.',
  assemblyPoint: 'Car park assembly area A.',
  
  // Incident State
  activeIncident: null, // null | 'fire' | 'medical' | 'security'
  severityLevel: null,
  broadcastMessage: null,
  
  // User interaction
  sosSent: false,
  sosUrgency: null, // 'safe', 'help'
};

function reducer(state, action) {
  switch (action.type) {
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

export function GuestDemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const actions = {
    triggerIncident: () => dispatch({ type: 'TRIGGER_INCIDENT' }),
    sendSos: (urgency) => dispatch({ type: 'SEND_SOS', payload: urgency }),
    resolveIncident: () => dispatch({ type: 'RESOLVE_INCIDENT' })
  };

  return (
    <GuestDemoContext.Provider value={{ state, actions }}>
      {children}
    </GuestDemoContext.Provider>
  );
}

export function useGuestDemo() {
  const ctx = useContext(GuestDemoContext);
  if (!ctx) return { state: {}, actions: {} };
  return ctx;
}
