import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../shared/firebase/config';

export const venueDocIdFor = (uid) => uid;

export function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function makeQrToken(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 18) || 'zone';
  return `${slug}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getAdminVenueSummary(uid) {
  if (!uid) return null;
  const directRef = doc(db, 'venues', venueDocIdFor(uid));
  const directSnap = await getDocs(query(collection(db, 'venues'), where('adminUid', '==', uid), limit(1)));
  if (!directSnap.empty) {
    return { venueId: directSnap.docs[0].id, ...directSnap.docs[0].data() };
  }
  return null;
}

export function subscribeVenueData(uid, onData, onError) {
  const venueId = venueDocIdFor(uid);
  const venueRef = doc(db, 'venues', venueId);
  const zonesRef = collection(db, 'venues', venueId, 'zones');
  const staffRef = collection(db, 'venues', venueId, 'staff');
  const playbooksRef = collection(db, 'venues', venueId, 'playbooks');

  const data = { venue: null, zones: [], staff: [], playbooks: [] };
  const emit = () => {
    if (!data.venue) {
      onData(null);
      return;
    }
    onData({
      venue: { venueId, ...data.venue },
      zones: data.zones,
      staff: data.staff,
      playbooks: data.playbooks,
    });
  };

  const unsubs = [
    onSnapshot(venueRef, (snap) => {
      data.venue = snap.exists() ? snap.data() : null;
      emit();
    }, onError),
    onSnapshot(zonesRef, (snap) => {
      data.zones = snap.docs.map(d => ({ zoneId: d.id, ...d.data() }));
      emit();
    }, onError),
    onSnapshot(staffRef, (snap) => {
      data.staff = snap.docs.map(d => ({ staffId: d.id, ...d.data() }));
      emit();
    }, onError),
    onSnapshot(playbooksRef, (snap) => {
      data.playbooks = snap.docs.map(d => ({ playbookId: d.id, ...d.data() }));
      emit();
    }, onError),
  ];

  return () => unsubs.forEach(unsub => unsub());
}

export async function saveOnboardingToFirestore(uid, setup) {
  const venueId = venueDocIdFor(uid);
  const batch = writeBatch(db);
  const venueRef = doc(db, 'venues', venueId);

  batch.set(venueRef, {
    venueId,
    name: setup.venue.name,
    type: setup.venue.type,
    address: setup.venue.address,
    timezone: setup.venue.timezone,
    adminUid: uid,
    setupComplete: true,
    complianceAcknowledged: Boolean(setup.venue.complianceAcknowledged),
    settings: setup.venue.settings,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });

  setup.zones.forEach((zone) => {
    const zoneId = zone.zoneId || makeId('zone');
    batch.set(doc(db, 'venues', venueId, 'zones', zoneId), {
      ...zone,
      zoneId,
      qrToken: zone.qrToken || makeQrToken(zone.name),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });

  setup.staff.forEach((member) => {
    const staffId = member.staffId || makeId('staff');
    batch.set(doc(db, 'venues', venueId, 'staff', staffId), {
      ...member,
      staffId,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });

  setup.playbooks.forEach((playbook) => {
    const playbookId = playbook.playbookId || playbook.crisisType || makeId('playbook');
    batch.set(doc(db, 'venues', venueId, 'playbooks', playbookId), {
      ...playbook,
      playbookId,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  });

  await batch.commit();
  return venueId;
}

export async function createStaffInvite({ venueId, staffId: providedStaffId, email, name, role, assignedZones, shift }) {
  const staffId = providedStaffId || makeId('staff');
  const inviteId = makeId('invite');
  const token = `${inviteId}-${Math.random().toString(36).slice(2, 12)}`;
  const batch = writeBatch(db);

  batch.set(doc(db, 'venues', venueId, 'staff', staffId), {
    staffId,
    email,
    name: name || email.split('@')[0],
    role,
    assignedZones,
    currentShift: shift,
    isOnDuty: false,
    inviteStatus: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  batch.set(doc(db, 'staffInvites', inviteId), {
    inviteId,
    token,
    venueId,
    staffId,
    email,
    role,
    assignedZones,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  await batch.commit();
  return {
    staffId,
    inviteId,
    inviteUrl: `${import.meta.env.VITE_STAFF_URL || window.location.origin.replace('admin', 'staff')}/login?invite=${token}`,
  };
}

export async function updateStaffMember(venueId, staffId, patch) {
  await updateDoc(doc(db, 'venues', venueId, 'staff', staffId), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function updatePlaybook(venueId, playbookId, patch) {
  await setDoc(doc(db, 'venues', venueId, 'playbooks', playbookId), {
    ...patch,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
