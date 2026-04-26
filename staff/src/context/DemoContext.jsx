import { createContext, useContext, useReducer, useCallback } from 'react';

const StaffDemoContext = createContext(null);

const INITIAL_STATE = {
  venueId: 'demo-venue-001',
  staffUser: null, // Set on login
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
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, staffUser: { staffId: 'warden-001', name: 'Ravi Sharma', role: 'warden', assignedZoneId: 'zone-floor7' } };
    case 'LOGOUT':
      return INITIAL_STATE;
    case 'SET_INCIDENT':
      return { ...state, activeIncident: action.payload, zoneStatus: 'notified', completedTaskIds: [] };
    case 'MARK_TASK':
      return { ...state, completedTaskIds: [...state.completedTaskIds, action.payload] };
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
      return { ...state, activeIncident: null, completedTaskIds: [], zoneStatus: 'clear' };
    default:
      return state;
  }
}

export function StaffDemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const actions = {
    login: () => dispatch({ type: 'LOGIN' }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    setIncident: (sys) => dispatch({ type: 'SET_INCIDENT', payload: sys }),
    markTask: (id) => dispatch({ type: 'MARK_TASK', payload: id }),
    updateStatus: (status) => dispatch({ type: 'UPDATE_STATUS', payload: status }),
    clearIncident: () => dispatch({ type: 'CLEAR_INCIDENT' })
  };

  return (
    <StaffDemoContext.Provider value={{ state, actions }}>
      {children}
    </StaffDemoContext.Provider>
  );
}

export function useStaffDemo() {
  return useContext(StaffDemoContext);
}
