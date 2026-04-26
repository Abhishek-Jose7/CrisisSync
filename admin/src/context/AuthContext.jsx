/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../shared/firebase/config';

const AdminAuthContext = createContext(null);

const storageKeyFor = (uid) => `crisissync:admin:onboarding:${uid}`;

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setSetupComplete(firebaseUser ? localStorage.getItem(storageKeyFor(firebaseUser.uid)) === 'complete' : false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshSetupState = useCallback((firebaseUser = auth.currentUser) => {
    setUser(firebaseUser);
    setSetupComplete(firebaseUser ? localStorage.getItem(storageKeyFor(firebaseUser.uid)) === 'complete' : false);
  }, []);

  const completeOnboarding = useCallback(() => {
    const current = auth.currentUser || user;
    if (!current) return;
    localStorage.setItem(storageKeyFor(current.uid), 'complete');
    setSetupComplete(true);
  }, [user]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setSetupComplete(false);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    setupComplete,
    completeOnboarding,
    refreshSetupState,
    logout,
  }), [completeOnboarding, loading, logout, refreshSetupState, setupComplete, user]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
