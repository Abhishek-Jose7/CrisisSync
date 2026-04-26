const trimSlash = (value) => value.replace(/\/$/, '');

export const appUrls = {
  admin: trimSlash(import.meta.env.VITE_ADMIN_URL || 'https://crisis-sync-jovf.vercel.app'),
  staff: trimSlash(import.meta.env.VITE_STAFF_URL || 'https://crisis-sync-usof.vercel.app'),
  guest: trimSlash(import.meta.env.VITE_GUEST_URL || 'https://crisis-sync-7y89.vercel.app'),
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
    production: `${appUrls.guest}/login`,
    scanner: `${appUrls.guest}/scan`,
    demo: `${appUrls.guest}/demo/floor7-ghi789`,
  },
};

export const guestDemoZones = [
  {
    name: 'Floor 7 guest',
    zone: 'Floor 7',
    token: 'floor7-ghi789',
    url: `${appUrls.guest}/demo/floor7-ghi789`,
  },
  {
    name: 'Kitchen visitor',
    zone: 'Kitchen',
    token: 'kitchen-def456',
    url: `${appUrls.guest}/demo/kitchen-def456`,
  },
  {
    name: 'Lobby guest',
    zone: 'Ground Floor Lobby',
    token: 'lobby-abc123',
    url: `${appUrls.guest}/demo/lobby-abc123`,
  },
];
