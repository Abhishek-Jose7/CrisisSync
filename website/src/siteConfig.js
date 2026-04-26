const trimSlash = (value) => value.replace(/\/$/, '');

export const appUrls = {
  admin: trimSlash(import.meta.env.VITE_ADMIN_URL || 'https://crisis-sync-jovf.vercel.app'),
  staff: trimSlash(import.meta.env.VITE_STAFF_URL || 'https://crisis-sync-usof.vercel.app'),
  guest: trimSlash(import.meta.env.VITE_GUEST_URL || 'https://crisis-sync-vvh5.vercel.app'),
};

export const roleLinks = {
  admin: {
    label: 'Admin',
    production: `${appUrls.admin}/login`,
    onboarding: `${appUrls.admin}/onboarding`,
    demo: `${appUrls.admin}/demo`,
  },
  staff: {
    label: 'Staff',
    production: `${appUrls.staff}/login`,
    demo: `${appUrls.staff}/demo`,
  },
  guest: {
    label: 'Guest',
    production: `${appUrls.guest}/demo/floor7-ghi789`,
    demo: `${appUrls.guest}/demo/floor7-ghi789`,
  },
};

export const guestDemoZones = [
  {
    name: 'Floor 7',
    zone: 'Floor 7 — Guest Rooms',
    token: 'floor7-ghi789',
    url: `${appUrls.guest}/demo/floor7-ghi789`,
  },
  {
    name: 'Kitchen',
    zone: 'Kitchen — Back of House',
    token: 'kitchen-def456',
    url: `${appUrls.guest}/demo/kitchen-def456`,
  },
  {
    name: 'Lobby',
    zone: 'Ground Floor Lobby',
    token: 'lobby-abc123',
    url: `${appUrls.guest}/demo/lobby-abc123`,
  },
  {
    name: 'Parking',
    zone: 'Basement Parking',
    token: 'parking-jkl012',
    url: `${appUrls.guest}/demo/parking-jkl012`,
  },
];

export const orgTypes = [
  { id: 'hotel', label: 'Hotel / Resort', icon: '🏨', desc: 'Full-service hospitality with floor zones, kitchen, lobby, and parking' },
  { id: 'mall', label: 'Shopping Mall', icon: '🛍️', desc: 'Multi-tenant retail with food courts, anchor stores, and parking decks' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️', desc: 'Dining operations with kitchen, dining hall, and outdoor areas' },
  { id: 'hospital', label: 'Hospital', icon: '🏥', desc: 'Healthcare facility with ICU, wards, OPD, and emergency block' },
  { id: 'event', label: 'Event Venue', icon: '🎪', desc: 'Concert halls, stadiums, and conference centers with crowd zones' },
  { id: 'corporate', label: 'Corporate Building', icon: '🏢', desc: 'Office floors with server rooms, lobbies, and parking structures' },
  { id: 'cowork', label: 'Co-working Space', icon: '💼', desc: 'Shared workspaces with hot desks, meeting rooms, and common areas' },
  { id: 'other', label: 'Other', icon: '🏗️', desc: 'Custom venue type with configurable zone structure' },
];
