/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../shared/firebase/config';

const AdminAuthContext = createContext(null);

const storageKeyFor = (uid) => `crisissync:admin:onboarding:${uid}`;
const orgTypeKeyFor = (uid) => `crisissync:admin:orgtype:${uid}`;
const localAccountsKey = 'crisissync:admin:localAccounts';
const localSessionKey = 'crisissync:admin:localSession';

function readLocalAccounts() {
  try {
    return JSON.parse(localStorage.getItem(localAccountsKey) || '{}');
  } catch {
    return {};
  }
}

function createLocalUser(email) {
  return {
    uid: `local-${email.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    email,
    displayName: email.split('@')[0],
    isLocalFallback: true,
  };
}

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [orgType, setOrgType] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const localSession = !firebaseUser ? localStorage.getItem(localSessionKey) : null;
      const activeUser = firebaseUser || (localSession ? createLocalUser(localSession) : null);
      setUser(activeUser);
      if (activeUser) {
        setSetupComplete(localStorage.getItem(storageKeyFor(activeUser.uid)) === 'complete');
        setOrgType(localStorage.getItem(orgTypeKeyFor(activeUser.uid)) || null);
      } else {
        setSetupComplete(false);
        setOrgType(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithEmail = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const complete = localStorage.getItem(storageKeyFor(result.user.uid)) === 'complete';
      setUser(result.user);
      setSetupComplete(complete);
      setOrgType(localStorage.getItem(orgTypeKeyFor(result.user.uid)) || null);
      return { user: result.user, setupComplete: complete };
    } catch (error) {
      const localAccounts = readLocalAccounts();
      const localAccount = localAccounts[email.toLowerCase()];
      if (localAccount?.password === password) {
        const localUser = createLocalUser(email);
        localStorage.setItem(localSessionKey, email.toLowerCase());
        const complete = localStorage.getItem(storageKeyFor(localUser.uid)) === 'complete';
        setUser(localUser);
        setSetupComplete(complete);
        setOrgType(localStorage.getItem(orgTypeKeyFor(localUser.uid)) || null);
        return { user: localUser, setupComplete: complete };
      }
      const msg = error.code === 'auth/user-not-found' ? 'No account found with this email.'
        : error.code === 'auth/wrong-password' ? 'Incorrect password.'
        : error.code === 'auth/invalid-credential' ? 'Invalid email or password.'
        : error.code === 'auth/too-many-requests' ? 'Too many attempts. Please wait and try again.'
        : 'Authentication failed. Please try again.';
      setAuthError(msg);
      throw new Error(msg);
    }
  }, []);

  const registerWithEmail = useCallback(async (email, password) => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setSetupComplete(false);
      return { user: result.user, setupComplete: false };
    } catch (error) {
      if (!['auth/email-already-in-use', 'auth/weak-password', 'auth/invalid-email'].includes(error.code)) {
        const accounts = readLocalAccounts();
        const key = email.toLowerCase();
        if (accounts[key]) {
          const msg = 'An account with this email already exists.';
          setAuthError(msg);
          throw new Error(msg);
        }
        accounts[key] = { email, password, createdAt: new Date().toISOString() };
        localStorage.setItem(localAccountsKey, JSON.stringify(accounts));
        localStorage.setItem(localSessionKey, key);
        const localUser = createLocalUser(email);
        setUser(localUser);
        setSetupComplete(false);
        return { user: localUser, setupComplete: false };
      }
      const msg = error.code === 'auth/email-already-in-use' ? 'An account with this email already exists.'
        : error.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : error.code === 'auth/invalid-email' ? 'Invalid email address.'
        : 'Registration failed. Please try again.';
      setAuthError(msg);
      throw new Error(msg);
    }
  }, []);

  const refreshSetupState = useCallback((firebaseUser = auth.currentUser) => {
    setUser(firebaseUser);
    setSetupComplete(firebaseUser ? localStorage.getItem(storageKeyFor(firebaseUser.uid)) === 'complete' : false);
    setOrgType(firebaseUser ? localStorage.getItem(orgTypeKeyFor(firebaseUser.uid)) || null : null);
  }, []);

  const completeOnboarding = useCallback((selectedOrgType) => {
    const current = auth.currentUser || user;
    if (!current) return;
    localStorage.setItem(storageKeyFor(current.uid), 'complete');
    if (selectedOrgType) {
      localStorage.setItem(orgTypeKeyFor(current.uid), selectedOrgType);
      setOrgType(selectedOrgType);
    }
    setSetupComplete(true);
  }, [user]);

  const logout = useCallback(async () => {
    localStorage.removeItem(localSessionKey);
    await signOut(auth).catch(() => {});
    setUser(null);
    setSetupComplete(false);
    setOrgType(null);
    setAuthError(null);
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  const value = useMemo(() => ({
    user,
    loading,
    setupComplete,
    orgType,
    authError,
    loginWithEmail,
    registerWithEmail,
    completeOnboarding,
    refreshSetupState,
    logout,
    clearError,
  }), [clearError, completeOnboarding, loading, loginWithEmail, logout, orgType, authError, refreshSetupState, registerWithEmail, setupComplete, user]);

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
