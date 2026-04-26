# CrisisSync — Revised Build Instructions (v2.0)

**Version:** 2.0 — Revised for Deployability and Realism  
**Project:** Google Solution Challenge 2025  
**Stack:** React (Admin + Guest PWA) · Flutter Web or React (Staff PWA) · Firebase · Gemini API · Google Maps SDK  
**Changelog from v1.0:** Firebase architecture simplified to Firestore-only; Camera AI deferred to Phase 2 with simulated MVP fallback; Guest SOS hardened with QR token validation and rate limiting; Venue setup onboarding via prebuilt templates; Compliance boundaries defined.

---

## ⚠️ Compliance & Liability Notice

> **Read before building.**

CrisisSync is an **emergency coordination and communication platform** for venue staff. It is **not** a replacement for:

- Legally mandated fire safety systems (fire panels, alarms, sprinklers)
- Emergency services dispatch (always call the local fire brigade / ambulance / police)
- Certified fire safety officers or legally required evacuation wardens
- Building compliance inspections or occupancy certificates

CrisisSync helps wardens communicate faster, coordinate zone responses, and record incident timelines. It **does not guarantee response times, evacuation outcomes, or life safety outcomes**. Venues using CrisisSync remain fully responsible for their legal fire safety obligations.

Include this notice as a visible disclaimer in the Admin dashboard onboarding and in every venue's settings screen.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Firebase Setup — Firestore-Only Architecture](#2-firebase-setup)
3. [Firestore Data Schema](#3-firestore-data-schema)
4. [Guest Session Security — QR Tokens, Rate Limiting, Signed Sessions](#4-guest-session-security)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Staff PWA](#6-staff-pwa)
7. [Guest PWA](#7-guest-pwa)
8. [Severity Model — Cloud Function](#8-severity-model--cloud-function)
9. [Escalation Chain — Cloud Function](#9-escalation-chain--cloud-function)
10. [Gemini AI Integration](#10-gemini-ai-integration)
11. [Camera Integration — Phase 2 (Simulated MVP)](#11-camera-integration--phase-2)
12. [Offline Behaviour](#12-offline-behaviour)
13. [QR Code Generation](#13-qr-code-generation)
14. [Google Maps Integration](#14-google-maps-integration)
15. [Venue Onboarding — Prebuilt Templates](#15-venue-onboarding--prebuilt-templates)
16. [Playbook Configuration](#16-playbook-configuration)
17. [Post-Incident AI Report](#17-post-incident-ai-report)
18. [Environment Variables](#18-environment-variables)
19. [Deployment](#19-deployment)
20. [Demo Setup Guide](#20-demo-setup-guide)
21. [Testing Checklist](#21-testing-checklist)

---

## 1. Project Structure

```
crisissync/
├── admin/                        # React web dashboard (Admin portal)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Setup/            # Venue onboarding wizard, zone builder, playbooks
│   │   │   ├── Command/          # Live incident command board
│   │   │   └── Analytics/        # Post-incident reports, insights
│   │   ├── components/
│   │   │   ├── ZoneGrid/         # Live zone status cards
│   │   │   ├── AlertFeed/        # Real-time SOS feed
│   │   │   ├── SimulatedAnomalyPanel/  # Phase 1 MVP — simulated camera events
│   │   │   ├── AICommandPanel/   # Gemini suggestions
│   │   │   └── MapOverlay/       # Google Maps with pins
│   │   └── firebase/             # Firebase config + hooks
├── staff/                        # Staff PWA (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── ZoneHome/         # Normal state — quiet dashboard
│   │   │   └── Incident/         # Active incident view
│   │   └── components/
│   │       ├── Checklist/
│   │       ├── AITipsPanel/
│   │       ├── ZoneStatusStrip/
│   │       └── QuickStatusButtons/
├── guest/                        # Guest PWA (React, minimal bundle)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ZoneLanding/      # Normal state — SOS button + info
│   │   │   └── IncidentActive/   # Evacuation mode
│   │   └── sw.js                 # Service worker for offline caching
├── functions/                    # Cloud Functions (Node.js 18)
│   ├── src/
│   │   ├── severity.js           # Severity model computation
│   │   ├── escalation.js         # Escalation chain + autonomous mode
│   │   ├── guestAuth.js          # QR token validation + signed guest sessions + rate limiting
│   │   ├── gemini/
│   │   │   ├── guestInstructions.js
│   │   │   ├── staffTips.js
│   │   │   ├── adminSuggestions.js
│   │   │   └── postIncidentReport.js
│   │   ├── simulatedAnomaly.js   # Phase 1 MVP — deterministic anomaly simulation
│   │   └── notifications.js      # FCM push logic
└── shared/
    ├── constants.js              # Crisis types, severity levels, zone types
    └── schema.js                 # Firestore document shapes
```

---

## 2. Firebase Setup

> **Architecture decision (v2.0):** CrisisSync v1.0 used both Firestore and Realtime Database simultaneously. This created synchronisation complexity, dual security rule surfaces, and difficult-to-debug race conditions. **v2.0 uses Firestore exclusively**, relying on `onSnapshot` listeners for real-time updates. Firestore's real-time latency (200–500ms) is sufficient for emergency coordination. Realtime Database is no longer used and should not be enabled.

### 2.1 Create Project

```bash
npm install -g firebase-tools
firebase login
firebase projects:create crisissync-prod

# Initialize in repo root
firebase init
# Select: Firestore, Functions, Hosting (multiple), Emulators
# Do NOT select Realtime Database
```

### 2.2 Enable Services in Firebase Console

Enable only the following services:

- **Authentication** → Email/Password provider
- **Firestore Database** → Start in production mode
- **Cloud Functions** → Node.js 18
- **Firebase Hosting** → Three sites: `crisissync-admin`, `crisissync-staff`, `crisissync-guest`
- **Cloud Messaging** → For push notifications
- **Firebase App Check** → Enforce on Firestore and Functions (prevents unauthorised API access)

**Do not enable Realtime Database.** All live updates go through Firestore `onSnapshot`.

### 2.3 Firebase Config File

```javascript
// shared/firebaseConfig.js
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // No databaseURL — Realtime DB is not used in v2.0
};
```

### 2.4 Firestore Security Rules

Key changes from v1.0: Guest SOS creation now requires a valid signed guest session token instead of `allow create: if true`. All anonymous write paths are closed.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Venue-level access
    match /venues/{venueId} {
      allow read, write: if isAdmin(venueId) || isDutyManager(venueId);

      match /zones/{zoneId} {
        allow read: if isStaffOf(venueId);
        allow write: if isAdmin(venueId);
      }

      match /staff/{staffId} {
        allow read, write: if isAdmin(venueId);
      }

      match /playbooks/{playbookId} {
        allow read: if isStaffOf(venueId);
        allow write: if isAdmin(venueId);
      }

      match /incidents/{incidentId} {
        allow read: if isStaffOf(venueId);
        allow write: if isStaffOf(venueId);

        match /zoneStatuses/{zoneId} {
          allow read: if isStaffOf(venueId);
          allow update: if isWardenOf(venueId, zoneId);
        }

        match /timeline/{eventId} {
          allow read: if isStaffOf(venueId);
          // Timeline is append-only via Cloud Functions — no direct client writes
        }

        match /sos/{sosId} {
          // IMPORTANT: Anonymous guest write is NOT allowed directly.
          // All guest SOS submissions go through the /api/guest/sos Cloud Function endpoint,
          // which validates the signed guest session before writing.
          // This prevents spam, zone-spoofing, and flooding.
          allow read: if isStaffOf(venueId);
          // No allow create for unauthenticated users — handled by Cloud Function
        }
      }
    }

    // Guest session tokens — written by Cloud Function only, readable by bearer
    match /guestSessions/{sessionId} {
      allow read: if resource.data.sessionId == sessionId; // bearer can read their own
      // Writes only via Cloud Function (Admin SDK bypasses rules)
    }

    function isAdmin(venueId) {
      return request.auth != null &&
        get(/databases/$(database)/documents/venues/$(venueId)/staff/$(request.auth.uid)).data.role == 'admin';
    }

    function isDutyManager(venueId) {
      return request.auth != null &&
        get(/databases/$(database)/documents/venues/$(venueId)/staff/$(request.auth.uid)).data.role == 'dutyManager';
    }

    function isStaffOf(venueId) {
      return request.auth != null &&
        exists(/databases/$(database)/documents/venues/$(venueId)/staff/$(request.auth.uid));
    }

    function isWardenOf(venueId, zoneId) {
      return request.auth != null &&
        get(/databases/$(database)/documents/venues/$(venueId)/staff/$(request.auth.uid)).data.assignedZones.hasAny([zoneId]);
    }
  }
}
```

---

## 3. Firestore Data Schema

### 3.1 venues/{venueId}

```javascript
{
  venueId: "auto-generated",
  name: "Grand Orchid Hotel",
  type: "hotel",                     // hotel | mall | event | cowork | restaurant
  address: "123 Marine Drive, Mumbai",
  timezone: "Asia/Kolkata",
  adminUid: "firebase-auth-uid",
  createdAt: Timestamp,
  setupComplete: false,              // set to true after onboarding wizard completes
  complianceAcknowledged: false,     // admin must acknowledge compliance notice before going live
  settings: {
    warden_ack_timeout_seconds: 90,
    admin_command_timeout_seconds: 90,
    full_escalation_timeout_seconds: 180,
    level3_requires_human_confirm: true,
    // Camera settings removed from MVP — see Section 11
  }
}
```

### 3.2 venues/{venueId}/zones/{zoneId}

```javascript
{
  zoneId: "auto-generated",
  name: "Floor 7",
  type: "floor",    // floor | kitchen | lobby | pool | parking | bar | dining | stage | cowork | other
  capacity: 48,
  riskProfile: "medium",
  assemblyPoint: "Car park entrance, Level 0, Gate B",
  exitRoute: "Turn left from lifts, take Stairwell B at end of corridor. Do not use lifts.",
  exitRouteImageUrl: null,
  // cameraIds removed from MVP schema — Phase 2 only
  notes: "AED located at Floor 6 nurse station. CO2 extinguisher at Stairwells 7A and 7B.",
  wardensByShift: {
    morning: "staff-uid-1",
    evening: "staff-uid-2",
    night: "staff-uid-3"
  },
  backupWarden: "staff-uid-4",
  isSeniorZone: false,
  qrToken: "floor7-abc123xyz",
  createdAt: Timestamp
}
```

### 3.3 venues/{venueId}/staff/{staffId}

```javascript
{
  staffId: "firebase-auth-uid",
  name: "Ravi Sharma",
  email: "ravi@grandorchid.com",
  phone: "+919876543210",
  role: "warden",              // admin | dutyManager | warden | seniorWarden
  assignedZones: ["zone-id-1"],
  fcmToken: "firebase-cloud-messaging-token",
  currentShift: "evening",
  isOnDuty: true,
  createdAt: Timestamp
}
```

### 3.4 venues/{venueId}/playbooks/{crisisType}

```javascript
{
  crisisType: "fire",
  zoneNotificationOrder: ["kitchen", "floor", "lobby", "parking"],
  defaultSeverity: 2,
  escalationTriggers: {
    sos_cluster_count: 3,
    sos_cluster_window_seconds: 120,
    warden_ack_timeout_seconds: 90
  },
  guestMessageByLevel: {
    1: "Staff are investigating a report near your area. Please remain calm.",
    2: "An incident is active in your area. Stay in your room. Do not use lifts. Await staff instructions.",
    3: "EVACUATE NOW. Leave immediately via the nearest stairwell. Do not use lifts. Go to the assembly point."
  },
  checklistsByZoneType: {
    floor: [
      { id: "f1", task: "Knock on all room doors. Use master key if no response.", priority: 1 },
      { id: "f2", task: "Direct all guests to the nearest stairwell. Do not allow lift use.", priority: 2 },
      { id: "f3", task: "Conduct a headcount at the stairwell exit.", priority: 3 },
      { id: "f4", task: "Report headcount and zone status to admin board.", priority: 4 },
      { id: "f5", task: "Confirm all rooms are empty. Mark zone CLEAR when done.", priority: 5 }
    ],
    kitchen: [
      { id: "k1", task: "Identify fire source. Do NOT use water on grease or electrical fires.", priority: 1 },
      { id: "k2", task: "Use CO2 extinguisher at Station K2 (east wall) if fire is small and contained.", priority: 2 },
      { id: "k3", task: "If fire is spreading — evacuate all kitchen staff immediately.", priority: 3 },
      { id: "k4", task: "Close all fire doors behind you. Do not lock them.", priority: 4 },
      { id: "k5", task: "Do not re-enter kitchen. Report status to admin board.", priority: 5 }
    ],
    lobby: [
      { id: "l1", task: "Direct all lobby guests away from lifts toward emergency exits.", priority: 1 },
      { id: "l2", task: "Unlock all emergency exit doors.", priority: 2 },
      { id: "l3", task: "Stand at main entrance to redirect arriving guests.", priority: 3 },
      { id: "l4", task: "Assist mobility-impaired guests to designated refuge points.", priority: 4 }
    ],
    parking: [
      { id: "p1", task: "Block entry lanes. Do not allow vehicles in or out.", priority: 1 },
      { id: "p2", task: "Direct anyone in parking to pedestrian exits immediately.", priority: 2 },
      { id: "p3", task: "Raise vehicle barriers if electronically controlled.", priority: 3 }
    ]
  }
}
```

### 3.5 venues/{venueId}/incidents/{incidentId}

```javascript
{
  incidentId: "auto-generated",
  venueId: "venue-id",
  crisisType: "fire",
  triggeredBy: "guestSOS",       // guestSOS | staffReport | systemAutomatic
  // "cameraAnomaly" trigger type is Phase 2 only
  triggeredAt: Timestamp,
  triggeredByZoneId: "zone-id-floor7",
  status: "active",
  resolvedAt: null,
  resolvedByUid: null,
  currentSeverity: 2,
  severityHistory: [
    { level: 1, setAt: Timestamp, setBy: "system" },
    { level: 2, setAt: Timestamp, setBy: "admin-uid" }
  ],
  commandHolder: "admin-uid",
  autonomousModeActive: false,
  affectedZones: ["zone-id-floor7"]
}
```

### 3.6 incidents/{incidentId}/sos/{sosId}

```javascript
{
  sosId: "auto-generated",
  zoneId: "zone-id-floor7",
  zoneQrToken: "floor7-abc123xyz",
  crisisType: "fire",
  urgency: "need_help",
  affectedCount: "many",
  timestamp: Timestamp,
  guestSessionId: "signed-session-id",    // validated signed session, NOT fully anonymous
  ipHashFragment: "a3f2",                 // last 4 chars of hashed IP — for rate limit audit only
  processedBySeverityModel: false
}
```

### 3.7 incidents/{incidentId}/zoneStatuses/{zoneId}

```javascript
{
  zoneId: "zone-id-floor7",
  wardenId: "staff-uid",
  wardenName: "Ravi Sharma",
  notifiedAt: Timestamp,
  acknowledgedAt: null,
  statusLabel: "active",         // notified | acknowledged | active | zone_clear | person_needs_help | request_backup
  checklistCompletion: 40,
  completedTaskIds: ["f1", "f2"],
  lastUpdateAt: Timestamp
}
```

### 3.8 guestSessions/{sessionId}

```javascript
// Written by Cloud Function only. Enables validated-anonymous SOS submissions.
{
  sessionId: "signed-uuid-v4",
  qrToken: "floor7-abc123xyz",
  venueId: "venue-id",
  zoneId: "zone-id-floor7",
  createdAt: Timestamp,
  expiresAt: Timestamp,          // 4-hour TTL
  sosCount: 0,                   // incremented per SOS submission — enforces per-session limit
  ipHashFragment: "a3f2"         // non-reversible, for abuse pattern detection only
}
```

### 3.9 venues/{venueId}/rateLimits/{ipHashFragment}

```javascript
// Written by Cloud Function. Tracks per-IP SOS submissions for spam prevention.
{
  ipHashFragment: "a3f2",
  sosCount: 1,
  windowStart: Timestamp,        // rolling 5-minute window
  lastSeen: Timestamp
}
```

### 3.10 incidents/{incidentId}/timeline/{eventId}

```javascript
{
  eventId: "auto-generated",
  eventType: "sos_received",
  actor: "system",
  description: "Guest SOS received from Zone Floor 7. Crisis type: fire. Urgency: need_help.",
  metadata: { zoneId: "...", sosId: "..." },
  timestamp: Timestamp
}
```

---

## 4. Guest Session Security

> **Problem solved:** The original design allowed `allow create: if true` for guest SOS documents, creating open vectors for spam floods, zone-spoofing (submitting a Floor 7 token to trigger Floor 1), and false alert surges. This section replaces that entirely.

### 4.1 Guest Session Flow

```
Guest scans QR code
      ↓
Guest PWA calls /api/guest/start-session?token=floor7-abc123xyz
      ↓
Cloud Function:
  1. Validates qrToken exists in Firestore zones collection
  2. Hashes request IP (SHA-256, take last 4 chars only)
  3. Checks rateLimits/{ipHash} — if >10 sessions in 5min, reject with 429
  4. Creates guestSessions/{sessionId} document (4hr TTL)
  5. Returns {sessionId, zoneId, venueId, zoneName, exitRoute, assemblyPoint}
      ↓
Guest PWA stores sessionId in memory (not localStorage — not needed across sessions)
      ↓
Guest submits SOS → /api/guest/sos with {sessionId, crisisType, urgency, affectedCount}
      ↓
Cloud Function validates:
  1. sessionId exists and is not expired
  2. Session's qrToken matches the submitted zone
  3. session.sosCount < 3 (prevents same guest flooding)
  4. IP rate limit check: <5 SOSs per IP per 5 minutes
  5. If valid → writes SOS to Firestore using Admin SDK (bypasses rules)
  6. Increments session.sosCount
```

### 4.2 Start Session Cloud Function

```javascript
// functions/src/guestAuth.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const db = admin.firestore();

exports.startGuestSession = functions.https.onRequest(async (req, res) => {
  // CORS for guest PWA
  res.set('Access-Control-Allow-Origin', 'https://guest.crisissync.app');
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  // Hash IP for rate limiting (non-reversible, last 4 chars only for privacy)
  const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
  const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');
  const ipHashFragment = ipHash.slice(-4);

  // Check IP-level rate limit: max 10 session starts per 5 minutes
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  const rateLimitRef = db.doc(`venues/_global/rateLimits/${ipHashFragment}`);
  const rateLimitDoc = await rateLimitRef.get();

  if (rateLimitDoc.exists) {
    const rl = rateLimitDoc.data();
    const windowStart = rl.windowStart.toDate();
    if (windowStart > fiveMinsAgo && rl.sessionCount >= 10) {
      return res.status(429).json({ error: 'Too many requests. Please wait a few minutes.' });
    }
  }

  // Validate QR token — find matching zone
  const zonesSnap = await db.collectionGroup('zones').where('qrToken', '==', token).limit(1).get();
  if (zonesSnap.empty) return res.status(404).json({ error: 'Invalid QR code. Please scan the QR code in your zone.' });

  const zoneDoc = zonesSnap.docs[0];
  const zone = zoneDoc.data();
  const venueId = zoneDoc.ref.parent.parent.id;
  const venueDoc = await db.doc(`venues/${venueId}`).get();
  const venue = venueDoc.data();

  // Create signed guest session (4-hour TTL)
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

  await db.doc(`guestSessions/${sessionId}`).set({
    sessionId,
    qrToken: token,
    venueId,
    zoneId: zoneDoc.id,
    createdAt: admin.firestore.Timestamp.now(),
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    sosCount: 0,
    ipHashFragment
  });

  // Update IP rate limit counter
  await rateLimitRef.set({
    ipHashFragment,
    sessionCount: admin.firestore.FieldValue.increment(1),
    windowStart: rateLimitDoc.exists && rateLimitDoc.data().windowStart.toDate() > fiveMinsAgo
      ? rateLimitDoc.data().windowStart
      : admin.firestore.Timestamp.now(),
    lastSeen: admin.firestore.Timestamp.now()
  }, { merge: true });

  return res.json({
    sessionId,
    zoneName: zone.name,
    venueName: venue.name,
    exitRoute: zone.exitRoute,
    assemblyPoint: zone.assemblyPoint,
    notes: zone.notes || null
  });
});
```

### 4.3 Guest SOS Cloud Function (Validated)

```javascript
// functions/src/guestAuth.js (continued)
exports.submitGuestSOS = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://guest.crisissync.app');
  if (req.method === 'OPTIONS') return res.status(204).send('');

  const { sessionId, crisisType, urgency, affectedCount, browserLanguage } = req.body;

  if (!sessionId || !crisisType || !urgency || !affectedCount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate session
  const sessionDoc = await db.doc(`guestSessions/${sessionId}`).get();
  if (!sessionDoc.exists) return res.status(401).json({ error: 'Invalid session. Please scan the QR code again.' });

  const session = sessionDoc.data();

  // Check session expiry
  if (session.expiresAt.toDate() < new Date()) {
    return res.status(401).json({ error: 'Session expired. Please scan the QR code again.' });
  }

  // Per-session SOS limit: max 3 per session (prevents single device flooding)
  if (session.sosCount >= 3) {
    return res.status(429).json({ error: 'You have already submitted multiple alerts. Staff are responding.' });
  }

  // Per-IP SOS rate limit: max 5 SOSs per IP per 5 minutes
  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
  const sosRlRef = db.doc(`venues/_global/sosRateLimits/${session.ipHashFragment}`);
  const sosRlDoc = await sosRlRef.get();

  if (sosRlDoc.exists) {
    const rl = sosRlDoc.data();
    if (rl.windowStart.toDate() > fiveMinsAgo && rl.sosCount >= 5) {
      return res.status(429).json({ error: 'Alert already submitted. Staff have been notified.' });
    }
  }

  // Find or create active incident for this venue
  const { venueId, zoneId, qrToken } = session;
  const activeIncidentSnap = await db
    .collection(`venues/${venueId}/incidents`)
    .where('status', '==', 'active')
    .limit(1).get();

  let incidentId;
  if (activeIncidentSnap.empty) {
    // Auto-create incident at Level 1 from guest SOS
    const incidentRef = await db.collection(`venues/${venueId}/incidents`).add({
      venueId,
      crisisType,
      triggeredBy: 'guestSOS',
      triggeredAt: admin.firestore.Timestamp.now(),
      triggeredByZoneId: zoneId,
      status: 'active',
      resolvedAt: null,
      resolvedByUid: null,
      currentSeverity: 1,
      severityHistory: [{ level: 1, setAt: admin.firestore.Timestamp.now(), setBy: 'system' }],
      commandHolder: null,
      autonomousModeActive: false,
      affectedZones: [zoneId]
    });
    incidentId = incidentRef.id;
  } else {
    incidentId = activeIncidentSnap.docs[0].id;
  }

  // Write SOS using Admin SDK (bypasses Firestore security rules)
  await db.collection(`venues/${venueId}/incidents/${incidentId}/sos`).add({
    zoneId,
    zoneQrToken: qrToken,
    crisisType,
    urgency,
    affectedCount,
    browserLanguage: browserLanguage || 'en',
    timestamp: admin.firestore.Timestamp.now(),
    guestSessionId: sessionId,
    ipHashFragment: session.ipHashFragment,
    processedBySeverityModel: false
  });

  // Increment session SOS count and IP rate limit
  await Promise.all([
    sessionDoc.ref.update({ sosCount: admin.firestore.FieldValue.increment(1) }),
    sosRlRef.set({
      sosCount: admin.firestore.FieldValue.increment(1),
      windowStart: sosRlDoc.exists && sosRlDoc.data().windowStart.toDate() > fiveMinsAgo
        ? sosRlDoc.data().windowStart
        : admin.firestore.Timestamp.now(),
      lastSeen: admin.firestore.Timestamp.now()
    }, { merge: true })
  ]);

  return res.json({ success: true, message: 'Alert received. Staff have been notified.' });
});
```

---

## 5. Admin Dashboard

### 5.1 Zone Builder Component

```javascript
// admin/src/pages/Setup/ZoneBuilder.jsx
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ZONE_TYPES = ['floor', 'kitchen', 'lobby', 'pool', 'parking', 'bar', 'dining', 'stage', 'gym', 'rooftop', 'cowork', 'other'];
const RISK_PROFILES = ['low', 'medium', 'high'];

export function ZoneBuilder({ venueId }) {
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({
    name: '', type: 'floor', capacity: '', riskProfile: 'medium',
    assemblyPoint: '', exitRoute: '', notes: '', isSeniorZone: false
  });

  async function handleAddZone(e) {
    e.preventDefault();
    const qrToken = `${form.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 9)}`;
    await addDoc(collection(db, `venues/${venueId}/zones`), {
      ...form,
      capacity: parseInt(form.capacity),
      // No cameraIds in MVP schema
      wardensByShift: { morning: null, evening: null, night: null },
      backupWarden: null,
      qrToken,
      createdAt: serverTimestamp()
    });
  }
  // ...
}
```

### 5.2 Incident Command — Firestore-Only Real-Time

```javascript
// admin/src/pages/Command/IncidentCommand.jsx
// NOTE: v2.0 uses Firestore onSnapshot for all live data.
// No Realtime Database. All zone status updates go through Firestore.

import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export function IncidentCommand({ venueId, incidentId }) {
  const [zoneStatuses, setZoneStatuses] = useState({});
  const [alertFeed, setAlertFeed] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  useEffect(() => {
    // Zone statuses via Firestore onSnapshot
    const statusQuery = query(
      collection(db, `venues/${venueId}/incidents/${incidentId}/zoneStatuses`)
    );
    const unsubStatuses = onSnapshot(statusQuery, snap => {
      const statuses = {};
      snap.docs.forEach(d => { statuses[d.id] = d.data(); });
      setZoneStatuses(statuses);
    });

    // SOS alert feed via Firestore onSnapshot
    const sosQuery = query(
      collection(db, `venues/${venueId}/incidents/${incidentId}/sos`),
      orderBy('timestamp', 'desc')
    );
    const unsubSOS = onSnapshot(sosQuery, snap => {
      setAlertFeed(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubStatuses(); unsubSOS(); };
  }, [venueId, incidentId]);

  // AI suggestions — polled every 30s from Cloud Function
  useEffect(() => {
    if (!incidentId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/ai/admin-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await getIdToken()}` },
        body: JSON.stringify({ venueId, incidentId })
      });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    }, 30000);
    return () => clearInterval(interval);
  }, [incidentId]);

  return (
    <div className="command-board">
      <ZoneGrid zoneStatuses={zoneStatuses} />
      <AlertFeed alerts={alertFeed} />
      <AICommandPanel suggestions={aiSuggestions} incidentId={incidentId} venueId={venueId} />
      <SimulatedAnomalyPanel venueId={venueId} incidentId={incidentId} /> {/* Phase 1 MVP */}
      <BroadcastControls venueId={venueId} incidentId={incidentId} />
    </div>
  );
}
```

### 5.3 Zone Grid Card

```javascript
// admin/src/components/ZoneGrid/ZoneCard.jsx
const STATUS_COLOURS = {
  notified: '#EF9F27',
  acknowledged: '#378ADD',
  active: '#378ADD',
  zone_clear: '#1D9E75',
  person_needs_help: '#E24B4A',
  request_backup: '#E24B4A',
  no_warden: '#888780'
};

export function ZoneCard({ zone, status, sosCount, onOverride }) {
  const colour = STATUS_COLOURS[status?.statusLabel || 'no_warden'];
  return (
    <div className="zone-card" style={{ borderLeft: `4px solid ${colour}` }}>
      <div className="zone-name">{zone.name}</div>
      <div className="zone-warden">{status?.wardenName || 'No warden assigned'}</div>
      <div className="zone-sos">SOS alerts: {sosCount || 0}</div>
      <div className="zone-checklist">Tasks: {status?.checklistCompletion || 0}%</div>
      <div className="zone-status" style={{ color: colour }}>{status?.statusLabel || 'No warden'}</div>
      <div className="zone-ack">
        {status?.acknowledgedAt
          ? `Acknowledged ${formatRelativeTime(status.acknowledgedAt)}`
          : status?.notifiedAt ? 'Notified — awaiting acknowledgment' : 'Not notified'
        }
      </div>
      <select onChange={e => onOverride(zone.zoneId, parseInt(e.target.value))}>
        <option value="">Override severity...</option>
        <option value="1">Level 1 — Monitor</option>
        <option value="2">Level 2 — Respond</option>
        <option value="3">Level 3 — Evacuate</option>
      </select>
    </div>
  );
}
```

### 5.4 Broadcast with Auto-Translation

```javascript
// admin/src/components/BroadcastControls/index.jsx
async function sendBroadcast({ venueId, incidentId, message, targetZones }) {
  await fetch('/api/broadcast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await getIdToken()}` },
    body: JSON.stringify({ venueId, incidentId, message, targetZones })
  });
}
```

---

## 6. Staff PWA

### 6.1 Service Worker Registration

```javascript
// staff/public/sw.js
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('crisissync-staff-v2').then(cache =>
      cache.addAll(['/', '/index.html', '/static/js/main.chunk.js', '/static/css/main.chunk.css', '/offline.html'])
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      data: { url: data.url, incidentId: data.incidentId },
      actions: [
        { action: 'open', title: 'Open CrisisSync' },
        { action: 'acknowledge', title: 'Acknowledge' }
      ],
      requireInteraction: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'acknowledge') {
    fetch('/api/warden/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId: event.notification.data.incidentId })
    });
  }
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

### 6.2 FCM Token Registration

```javascript
// staff/src/firebase/messaging.js
import { getMessaging, getToken } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';

export async function registerFCMToken(staffUid, venueId) {
  const messaging = getMessaging();
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('Notification permission denied');
    return;
  }
  const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
  await updateDoc(doc(db, `venues/${venueId}/staff/${staffUid}`), { fcmToken: token });
}
```

### 6.3 Incident View — Firestore-Only

```javascript
// staff/src/pages/Incident/index.jsx
// v2.0: All zone status updates use Firestore onSnapshot, not Realtime Database.

import { db } from '../../firebase/config';
import { doc, collection, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';

export function IncidentView({ venueId, incidentId, zoneId, staffUid }) {
  const [checklist, setChecklist] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [aiTips, setAiTips] = useState(null);
  const [allZoneStatuses, setAllZoneStatuses] = useState({});

  useEffect(() => {
    loadChecklist(venueId, incidentId, zoneId).then(setChecklist);
    fetchStaffTips(venueId, incidentId, zoneId).then(setAiTips);

    // All zone statuses via Firestore onSnapshot
    const unsubStatuses = onSnapshot(
      collection(db, `venues/${venueId}/incidents/${incidentId}/zoneStatuses`),
      snap => {
        const statuses = {};
        snap.docs.forEach(d => { statuses[d.id] = d.data(); });
        setAllZoneStatuses(statuses);
      }
    );
    return () => unsubStatuses();
  }, []);

  async function markTask(taskId) {
    const newCompleted = [...completedIds, taskId];
    setCompletedIds(newCompleted);
    const completion = Math.round((newCompleted.length / checklist.length) * 100);
    await updateDoc(doc(db, `venues/${venueId}/incidents/${incidentId}/zoneStatuses/${zoneId}`), {
      checklistCompletion: completion,
      completedTaskIds: newCompleted,
      lastUpdateAt: serverTimestamp()
    });
  }

  async function broadcastStatus(statusLabel) {
    await updateDoc(doc(db, `venues/${venueId}/incidents/${incidentId}/zoneStatuses/${zoneId}`), {
      statusLabel,
      lastUpdateAt: serverTimestamp()
    });
  }

  return (
    <div className="incident-view">
      <ZoneStatusStrip allStatuses={allZoneStatuses} currentZoneId={zoneId} />
      <Checklist items={checklist} completedIds={completedIds} onMarkDone={markTask} />
      {aiTips && <AITipsPanel tips={aiTips} />}
      <div className="quick-status">
        <button onClick={() => broadcastStatus('zone_clear')} className="btn-clear">Zone Clear</button>
        <button onClick={() => broadcastStatus('active')} className="btn-active">Active Situation</button>
        <button onClick={() => broadcastStatus('person_needs_help')} className="btn-help">Person Needs Help</button>
        <button onClick={() => broadcastStatus('request_backup')} className="btn-backup">Request Backup</button>
      </div>
    </div>
  );
}
```

---

## 7. Guest PWA

### 7.1 URL Structure

Each QR code encodes:

```
https://guest.crisissync.app/zone?token=floor7-abc123xyz
```

On load, the Guest PWA calls `/api/guest/start-session?token=floor7-abc123xyz` which validates the token and returns a `sessionId`. There is no direct Firestore access from the guest client.

### 7.2 Zone Landing Page

```javascript
// guest/src/pages/ZoneLanding/index.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function ZoneLanding() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [sessionId, setSessionId] = useState(null);
  const [zoneInfo, setZoneInfo] = useState(null);
  const [incidentLevel, setIncidentLevel] = useState(null);
  const [guestInstructions, setGuestInstructions] = useState(null);
  const [sosSubmitted, setSosSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) { setError('No zone QR token found. Please scan the QR code in your zone.'); return; }

    fetch(`/api/guest/start-session?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return; }
        setSessionId(data.sessionId);
        setZoneInfo(data);
        // Cache zone info for offline access
        if ('caches' in window) {
          caches.open('crisissync-guest-v2').then(cache => {
            cache.put(`zone-info-${token}`, new Response(JSON.stringify(data)));
          });
        }
      })
      .catch(() => {
        // Offline fallback — try cache
        if ('caches' in window) {
          caches.open('crisissync-guest-v2').then(async cache => {
            const cached = await cache.match(`zone-info-${token}`);
            if (cached) setZoneInfo(await cached.json());
          });
        }
      });

    subscribeToZoneIncident(token, (level, instructions) => {
      setIncidentLevel(level);
      setGuestInstructions(instructions);
    });
  }, [token]);

  async function submitSOS({ crisisType, urgency, affectedCount }) {
    if (!sessionId) { setError('Cannot submit alert — no active session. Please reload the page.'); return; }
    const res = await fetch('/api/guest/sos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        crisisType,
        urgency,
        affectedCount,
        browserLanguage: navigator.language || 'en'
      })
    });
    const data = await res.json();
    if (res.status === 429) {
      setSosSubmitted(true); // Show "Staff are responding" even on rate limit
      return;
    }
    if (data.success) setSosSubmitted(true);
  }

  if (error) return <div className="error-state">{error}</div>;
  if (incidentLevel === 3) return <EvacuationMode zoneInfo={zoneInfo} instructions={guestInstructions} />;

  return (
    <div className="zone-landing">
      <div className="venue-name">{zoneInfo?.venueName}</div>
      <div className="zone-name">{zoneInfo?.zoneName}</div>
      {incidentLevel === 1 && <div className="status-banner level-1">Staff are aware. Please remain calm.</div>}
      {incidentLevel === 2 && <div className="status-banner level-2">{guestInstructions || "An incident is active. Await staff instructions."}</div>}
      {!sosSubmitted ? (
        <SOSForm onSubmit={submitSOS} />
      ) : (
        <div className="sos-confirmed">Your alert has been received. Staff are responding.</div>
      )}
      <div className="safety-info">
        <h3>Your exit route</h3>
        <p>{zoneInfo?.exitRoute}</p>
        <h3>Assembly point</h3>
        <p>{zoneInfo?.assemblyPoint}</p>
      </div>
    </div>
  );
}
```

### 7.3 SOS Form (Structured, no free text)

```javascript
// guest/src/pages/ZoneLanding/SOSForm.jsx
const CRISIS_TYPES = [
  { value: 'fire', label: '🔥 Fire' },
  { value: 'medical', label: '🚑 Medical emergency' },
  { value: 'security', label: '🚨 Security threat' },
  { value: 'flood', label: '💧 Flooding / water' },
  { value: 'power', label: '⚡ Power outage' },
  { value: 'other', label: '⚠️ Other' }
];

export function SOSForm({ onSubmit }) {
  const [crisisType, setCrisisType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [step, setStep] = useState(1);

  if (step === 1) return (
    <div className="sos-step">
      <h2>What is happening?</h2>
      {CRISIS_TYPES.map(ct => (
        <button key={ct.value} className="crisis-btn"
          onClick={() => { setCrisisType(ct.value); setStep(2); }}>
          {ct.label}
        </button>
      ))}
    </div>
  );

  if (step === 2) return (
    <div className="sos-step">
      <h2>Are you in immediate danger?</h2>
      <button className="urgency-btn" onClick={() => { setUrgency('need_help'); setStep(3); }}>I need help NOW</button>
      <button className="urgency-btn" onClick={() => { setUrgency('safe_reporting'); setStep(3); }}>I am safe but reporting</button>
    </div>
  );

  return (
    <div className="sos-step">
      <h2>How many people are affected?</h2>
      <button className="count-btn" onClick={() => onSubmit({ crisisType, urgency, affectedCount: 'just_me' })}>Just me</button>
      <button className="count-btn" onClick={() => onSubmit({ crisisType, urgency, affectedCount: 'few' })}>A few people</button>
      <button className="count-btn" onClick={() => onSubmit({ crisisType, urgency, affectedCount: 'many' })}>Many people</button>
    </div>
  );
}
```

---

## 8. Severity Model — Cloud Function

> **Change from v1.0:** Camera event scoring is removed from this function for MVP. The camera confidence score input will be re-added in Phase 2 when real camera integration is available.

```javascript
// functions/src/severity.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

exports.computeSeverity = functions.firestore
  .document('venues/{venueId}/incidents/{incidentId}/sos/{sosId}')
  .onCreate(async (snap, context) => {
    const { venueId, incidentId } = context.params;
    const sos = snap.data();

    // --- SIGNAL INPUTS ---
    let signalScore = 0;

    const crisisTypeScores = {
      fire: 3, medical: 3, security: 3,
      flood: 2, crowd_surge: 3, gas_leak: 3,
      power: 1, lift: 2, suspicious_package: 2, other: 1
    };
    signalScore += crisisTypeScores[sos.crisisType] || 1;

    if (sos.urgency === 'need_help') signalScore += 2;

    if (sos.affectedCount === 'many') signalScore += 2;
    else if (sos.affectedCount === 'few') signalScore += 1;

    // --- CONTEXT INPUTS ---
    let contextScore = 0;

    const zoneDoc = await db.doc(`venues/${venueId}/zones/${sos.zoneId}`).get();
    const zone = zoneDoc.data();

    if (zone.riskProfile === 'high') contextScore += 2;
    else if (zone.riskProfile === 'medium') contextScore += 1;

    if (zone.capacity > 200) contextScore += 2;
    else if (zone.capacity > 50) contextScore += 1;

    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 5) contextScore += 1;

    // SOS cluster count — same zone, last 2 minutes
    const twoMinsAgo = new Date(Date.now() - 120000);
    const recentSOSQuery = await db
      .collection(`venues/${venueId}/incidents/${incidentId}/sos`)
      .where('zoneId', '==', sos.zoneId)
      .where('timestamp', '>=', twoMinsAgo)
      .get();
    const clusterCount = recentSOSQuery.size;
    if (clusterCount >= 3) contextScore += 3;
    else if (clusterCount >= 2) contextScore += 1;

    // NOTE: Camera event scoring removed for MVP (Phase 1).
    // Will be re-added in Phase 2 once real camera integration is available.

    const totalScore = signalScore + contextScore;
    let suggestedSeverity;
    if (totalScore <= 4) suggestedSeverity = 1;
    else if (totalScore <= 8) suggestedSeverity = 2;
    else suggestedSeverity = 3;

    const incidentRef = db.doc(`venues/${venueId}/incidents/${incidentId}`);
    const incident = (await incidentRef.get()).data();

    if (suggestedSeverity > (incident.currentSeverity || 0)) {
      const settings = (await db.doc(`venues/${venueId}`).get()).data().settings;

      if (suggestedSeverity === 3 && settings.level3_requires_human_confirm) {
        await incidentRef.update({
          pendingLevel3Confirm: true,
          pendingLevel3Reason: `Score: signal ${signalScore} + context ${contextScore}. SOS cluster: ${clusterCount}`
        });
        await notifyForConfirmation(venueId, incidentId, suggestedSeverity);
      } else {
        await incidentRef.update({
          currentSeverity: suggestedSeverity,
          severityHistory: admin.firestore.FieldValue.arrayUnion({
            level: suggestedSeverity,
            setAt: admin.firestore.Timestamp.now(),
            setBy: 'system',
            reason: `Signal: ${signalScore}, Context: ${contextScore}`
          })
        });
      }
    }

    await snap.ref.update({ processedBySeverityModel: true });
  });
```

---

## 9. Escalation Chain — Cloud Function

```javascript
// functions/src/escalation.js
// v2.0: No Realtime Database reads. All zone status reads come from Firestore.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const { sendPushNotification } = require('./notifications');

exports.escalationCheck = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async () => {
    const activeIncidents = await db.collectionGroup('incidents')
      .where('status', '==', 'active').get();

    for (const incidentDoc of activeIncidents.docs) {
      const incident = incidentDoc.data();
      const venueId = incidentDoc.ref.parent.parent.id;
      const incidentId = incidentDoc.id;
      const venue = (await db.doc(`venues/${venueId}`).get()).data();
      const settings = venue.settings;
      const now = Date.now();
      const elapsed = (now - incident.triggeredAt.toMillis()) / 1000;

      // Step 1: Admin silent for 90s → notify duty manager
      if (elapsed > settings.admin_command_timeout_seconds && !incident.dutyManagerNotified) {
        const dutyManager = await getDutyManagerForCurrentShift(venueId);
        if (dutyManager) {
          await sendPushNotification(dutyManager.fcmToken, {
            title: `⚠️ EMERGENCY — ${incident.crisisType.toUpperCase()}`,
            body: `Admin unreachable. You are now in command. Open CrisisSync immediately.`,
            url: `https://staff.crisissync.app/command/${venueId}/${incidentId}`,
            incidentId
          });
          await incidentDoc.ref.update({ dutyManagerNotified: true, commandHolder: dutyManager.staffId });
        }
      }

      // Step 2: Both silent for 3min → notify senior warden + autonomous mode
      if (elapsed > settings.full_escalation_timeout_seconds && !incident.seniorWardenNotified) {
        const seniorWarden = await getSeniorWardenForCurrentShift(venueId);
        if (seniorWarden) {
          await sendPushNotification(seniorWarden.fcmToken, {
            title: `🚨 EMERGENCY — Command handover to you`,
            body: `Admin and Duty Manager unreachable. You have command. Open CrisisSync now.`,
            url: `https://staff.crisissync.app/command/${venueId}/${incidentId}`,
            incidentId
          });
          await incidentDoc.ref.update({
            seniorWardenNotified: true,
            autonomousModeActive: true,
            commandHolder: seniorWarden.staffId
          });
          await runAutonomousPlaybook(venueId, incidentId, incident.crisisType);
        }
      }

      // Step 3: Check individual warden acknowledgment timeouts from Firestore
      const zoneStatusesSnap = await db
        .collection(`venues/${venueId}/incidents/${incidentId}/zoneStatuses`).get();

      for (const zoneStatusDoc of zoneStatusesSnap.docs) {
        const status = zoneStatusDoc.data();
        if (status.notifiedAt && !status.acknowledgedAt) {
          const notifiedElapsed = (now - status.notifiedAt.toMillis()) / 1000;
          if (notifiedElapsed > settings.warden_ack_timeout_seconds && !status.backupNotified) {
            const zone = (await db.doc(`venues/${venueId}/zones/${zoneStatusDoc.id}`).get()).data();
            if (zone.backupWarden) {
              const backupWarden = (await db.doc(`venues/${venueId}/staff/${zone.backupWarden}`).get()).data();
              if (backupWarden?.fcmToken) {
                await sendPushNotification(backupWarden.fcmToken, {
                  title: `⚠️ Backup needed — ${zone.name}`,
                  body: `Primary warden unreachable. Please cover ${zone.name} immediately.`,
                  url: `https://staff.crisissync.app/incident/${venueId}/${incidentId}/${zoneStatusDoc.id}`,
                  incidentId
                });
                await zoneStatusDoc.ref.update({ backupNotified: true });
              }
            }
          }
        }
      }
    }
  });
```

---

## 10. Gemini AI Integration

### 10.1 Staff Tips

```javascript
// functions/src/gemini/staffTips.js
const { VertexAI } = require('@google-cloud/vertexai');
const vertexAI = new VertexAI({ project: process.env.GCLOUD_PROJECT, location: 'us-central1' });
const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.getStaffTips = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { venueId, incidentId, zoneId } = data;
  const zone = (await db.doc(`venues/${venueId}/zones/${zoneId}`).get()).data();
  const incident = (await db.doc(`venues/${venueId}/incidents/${incidentId}`).get()).data();
  const venue = (await db.doc(`venues/${venueId}`).get()).data();

  const prompt = `You are a hotel and hospitality emergency safety expert. A staff member (zone warden) needs immediate, practical safety guidance.

Context:
- Venue type: ${venue.type}
- Zone name: ${zone.name}
- Zone type: ${zone.type}
- Zone capacity: ${zone.capacity}
- Zone risk profile: ${zone.riskProfile}
- Zone notes from management: ${zone.notes || 'None'}
- Crisis type: ${incident.crisisType}
- Current severity level: ${incident.currentSeverity}
- Time: ${new Date().toLocaleTimeString()}

Generate exactly 3 safety tips for this warden. Each tip must be:
1. Specific to this zone type and crisis type combination
2. Immediately actionable (not general knowledge)
3. Reference specific equipment or locations from the zone notes where relevant
4. Under 40 words

Format as JSON array: [{"tip": "...", "priority": 1}, {"tip": "...", "priority": 2}, {"tip": "...", "priority": 3}]
Respond with JSON only, no preamble or markdown.`;

  const result = await model.generateContent(prompt);
  const text = result.response.candidates[0].content.parts[0].text;

  try {
    return { tips: JSON.parse(text.replace(/```json|```/g, '').trim()) };
  } catch {
    return { tips: [{ tip: text, priority: 1 }] };
  }
});
```

### 10.2 Guest Multilingual Instructions

```javascript
// functions/src/gemini/guestInstructions.js
exports.getGuestInstructions = functions.https.onRequest(async (req, res) => {
  const { sessionId, incidentId, browserLanguage } = req.body;

  // Validate session before serving instructions
  const sessionDoc = await db.doc(`guestSessions/${sessionId}`).get();
  if (!sessionDoc.exists || sessionDoc.data().expiresAt.toDate() < new Date()) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const { venueId, zoneId } = sessionDoc.data();
  const zone = (await db.doc(`venues/${venueId}/zones/${zoneId}`).get()).data();
  const incident = (await db.doc(`venues/${venueId}/incidents/${incidentId}`).get()).data();
  const severity = incident.currentSeverity;

  // Cache key — same instructions for same zone/incident/language/severity
  const cacheKey = `${incidentId}-${zoneId}-${browserLanguage}-${severity}`;
  const cached = await db.doc(`aiInsights/guestInstructions/cache/${cacheKey}`).get();
  if (cached.exists) return res.json({ instructions: cached.data().instructions });

  const languageNames = {
    'hi': 'Hindi', 'fr': 'French', 'de': 'German', 'zh': 'Mandarin Chinese',
    'ja': 'Japanese', 'ko': 'Korean', 'ar': 'Arabic', 'es': 'Spanish',
    'pt': 'Portuguese', 'ru': 'Russian', 'en': 'English'
  };
  const targetLanguage = languageNames[browserLanguage.split('-')[0]] || 'English';

  const prompt = `You are a hotel guest safety system. Write emergency instructions for a hotel guest.

The guest is in: ${zone.name}
Emergency type: ${incident.crisisType}
Severity level: ${severity} (1=monitor, 2=respond, 3=evacuate)
Their exit route: ${zone.exitRoute}
Assembly point: ${zone.assemblyPoint}
Target language: ${targetLanguage}

Rules:
- Severity 1: Reassurance and awareness only
- Severity 2: Stay in room / move per crisis type
- Severity 3: Full evacuation with specific route
- Do NOT use alarming language. Be calm and directive.
- Maximum 80 words. Write in ${targetLanguage}. No preamble.`;

  const result = await model.generateContent(prompt);
  const instructions = result.response.candidates[0].content.parts[0].text.trim();

  await db.doc(`aiInsights/guestInstructions/cache/${cacheKey}`).set({
    instructions,
    generatedAt: admin.firestore.Timestamp.now()
  });

  return res.json({ instructions });
});
```

### 10.3 Admin Decision Support

```javascript
// functions/src/gemini/adminSuggestions.js
exports.getAdminSuggestions = functions.https.onCall(async (data, context) => {
  const { venueId, incidentId } = data;

  const [incidentDoc, zoneStatusesSnap, sosSnap, timelineSnap] = await Promise.all([
    db.doc(`venues/${venueId}/incidents/${incidentId}`).get(),
    db.collection(`venues/${venueId}/incidents/${incidentId}/zoneStatuses`).get(),
    db.collection(`venues/${venueId}/incidents/${incidentId}/sos`).orderBy('timestamp', 'desc').limit(20).get(),
    db.collection(`venues/${venueId}/incidents/${incidentId}/timeline`).orderBy('timestamp', 'desc').limit(30).get()
  ]);

  const incident = incidentDoc.data();
  const zoneStatuses = zoneStatusesSnap.docs.map(d => ({ zoneId: d.id, ...d.data() }));
  const sosList = sosSnap.docs.map(d => d.data());
  const unackedWardens = zoneStatuses.filter(z => z.notifiedAt && !z.acknowledgedAt);

  const prompt = `You are an emergency management AI assistant helping a hotel manager command an active incident.

Active incident:
- Crisis type: ${incident.crisisType}
- Severity: Level ${incident.currentSeverity}
- Triggered: ${minutesAgo(incident.triggeredAt)} minutes ago

Zone warden status:
${zoneStatuses.map(z => `- ${z.zoneId}: ${z.statusLabel || 'unknown'}, ack: ${z.acknowledgedAt ? 'yes' : 'NO'}, tasks: ${z.checklistCompletion || 0}%`).join('\n')}

Recent SOS alerts (last 20):
${sosList.map(s => `- Zone ${s.zoneId}: ${s.crisisType}, ${s.urgency}, ${s.affectedCount}, ${minutesAgo(s.timestamp)}min ago`).join('\n')}

Unacknowledged wardens: ${unackedWardens.length} zones with no warden response

Generate up to 3 actionable suggestions. Each must cite a specific data point and be under 50 words.
Format as JSON: [{"suggestion": "...", "dataPoint": "...", "urgency": "high|medium|low"}]
JSON only.`;

  const result = await model.generateContent(prompt);
  const text = result.response.candidates[0].content.parts[0].text;
  const suggestions = JSON.parse(text.replace(/```json|```/g, '').trim());
  return { suggestions };
});
```

---

## 11. Camera Integration — Phase 2

> **Architecture decision (v2.0):** Real-time Vision AI camera integration is deferred to Phase 2. Here's why:

> **Why this was a problem:** Most hospitality venues (hotels, malls, restaurants) use legacy CCTV systems — HIKVISION, Dahua, CP Plus — that do not expose RTSP streams or HTTP snapshot endpoints without significant hardware upgrades, network reconfiguration, and IT involvement. Retrofitting this for an MVP creates a hard deployment dependency that blocks the entire product for the majority of target venues. Additionally, running Cloud Vision API on every zone at 30-second intervals during active incidents creates unpredictable Cloud API costs.

> **Phase 1 (MVP):** A deterministic simulated anomaly system is used for demo purposes. It generates realistic-looking camera events based on the current incident type and severity, without any real camera hardware. This lets the demo flow and admin dashboard work end-to-end.

> **Phase 2 (post-MVP):** Real camera integration supports venues that can provide static JPEG snapshot URLs (even basic IP cameras with HTTP snapshot endpoints will work — no RTSP required).

### 11.1 Simulated Anomaly System (Phase 1 MVP)

```javascript
// functions/src/simulatedAnomaly.js
// Generates deterministic, realistic-looking anomaly events for MVP demo.
// Triggered when admin manually activates the simulation in the demo panel.

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

const SIMULATED_ANOMALIES = {
  fire: [
    { observation: 'Smoke-like haze detected in upper frame', confidence: 0.83 },
    { observation: 'Possible fire detected near ceiling area', confidence: 0.79 },
    { observation: 'Elevated heat signature pattern', confidence: 0.76 }
  ],
  medical: [
    { observation: 'Person in prone position detected', confidence: 0.81 },
    { observation: 'Stationary figure detected for extended period', confidence: 0.78 }
  ],
  security: [
    { observation: 'Elevated crowd density near exit', confidence: 0.77 },
    { observation: 'Rapid movement pattern detected', confidence: 0.74 }
  ],
  flood: [
    { observation: 'Floor reflectivity anomaly detected — possible liquid', confidence: 0.72 },
    { observation: 'Unusual floor surface pattern', confidence: 0.69 }
  ]
};

exports.triggerSimulatedAnomaly = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { venueId, incidentId, zoneId, crisisType } = data;
  const anomalyList = SIMULATED_ANOMALIES[crisisType] || SIMULATED_ANOMALIES.fire;
  const anomaly = anomalyList[Math.floor(Math.random() * anomalyList.length)];

  await db.collection(`venues/${venueId}/incidents/${incidentId}/cameraEvents`).add({
    zoneId,
    cameraId: 'SIMULATED',
    observation: anomaly.observation,
    confidence: anomaly.confidence,
    rawLabels: ['simulated'],
    imageUrl: null,
    isSimulated: true,             // clearly flagged — admin dashboard shows "SIM" badge
    timestamp: admin.firestore.Timestamp.now(),
    flaggedToAdmin: true,
    flaggedToWarden: false         // simulated events do not push to wardens
  });

  return { success: true };
});
```

### 11.2 Simulated Anomaly Panel (Admin Dashboard)

```javascript
// admin/src/components/SimulatedAnomalyPanel/index.jsx
// Shows camera events in the admin dashboard with clear "SIMULATED" labelling.
// In Phase 2, this component is replaced by real CameraPanel with live snapshot URLs.

export function SimulatedAnomalyPanel({ venueId, incidentId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubEvents = onSnapshot(
      query(
        collection(db, `venues/${venueId}/incidents/${incidentId}/cameraEvents`),
        orderBy('timestamp', 'desc')
      ),
      snap => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => unsubEvents();
  }, [venueId, incidentId]);

  async function triggerSimulation(zoneId, crisisType) {
    const triggerFn = httpsCallable(functions, 'triggerSimulatedAnomaly');
    await triggerFn({ venueId, incidentId, zoneId, crisisType });
  }

  return (
    <div className="camera-panel">
      <h3>Vision AI — <span className="sim-badge">DEMO MODE</span></h3>
      <p className="sim-notice">Camera integration requires Phase 2 hardware setup. Using simulated anomaly detection for demo.</p>
      <button onClick={() => triggerSimulation(targetZoneId, currentCrisisType)} className="btn-simulate">
        Simulate Camera Anomaly
      </button>
      <div className="camera-events">
        {events.map(e => (
          <div key={e.id} className={`camera-event ${e.isSimulated ? 'simulated' : 'live'}`}>
            {e.isSimulated && <span className="sim-tag">SIM</span>}
            <strong>{e.observation}</strong>
            <span>{Math.round(e.confidence * 100)}% confidence</span>
            <span>Zone: {e.zoneId} · {formatRelativeTime(e.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 11.3 Phase 2 Real Camera Integration (Reference)

When a venue can provide HTTP snapshot URLs from their IP cameras (even basic HTTP snapshot — no RTSP required), Phase 2 enables real Vision AI:

```javascript
// Phase 2 camera schema addition to zone document:
// cameraConfigs: [
//   { cameraId: "cam_07A", snapshotUrl: "http://192.168.1.100/snapshot.jpg", label: "Floor 7 Corridor" }
// ]
// No RTSP required — any camera that exposes a static JPEG snapshot URL over HTTP works.
```

---

## 12. Offline Behaviour

### 12.1 Firestore Offline Persistence (Staff PWA)

```javascript
// staff/src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open — offline persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support offline persistence');
  }
});

export { db };
```

### 12.2 Offline SOS Queue (Guest PWA)

```javascript
// guest/src/utils/offlineSOS.js
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('crisissync-guest', 1);
    request.onupgradeneeded = e => {
      e.target.result.createObjectStore('sos-queue', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = e => resolve(e.target.result);
    request.onerror = reject;
  });
}

export async function queueOfflineSOS(sosData) {
  const db = await openDB();
  const tx = db.transaction('sos-queue', 'readwrite');
  tx.objectStore('sos-queue').add({ ...sosData, queuedAt: Date.now() });
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const sw = await navigator.serviceWorker.ready;
    await sw.sync.register('sos-queue');
  }
}

export async function sendQueuedSOSs(sessionId) {
  const db = await openDB();
  const tx = db.transaction('sos-queue', 'readwrite');
  const store = tx.objectStore('sos-queue');
  const all = await new Promise((res, rej) => {
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = rej;
  });
  for (const sos of all) {
    try {
      await fetch('/api/guest/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sos, sessionId })
      });
      store.delete(sos.id);
    } catch {
      break;
    }
  }
}
```

---

## 13. QR Code Generation

```javascript
// admin/src/components/QRGenerator/index.jsx
import QRCode from 'qrcode';

export async function generateZoneQR(zone, venueId) {
  const url = `https://guest.crisissync.app/zone?token=${zone.qrToken}`;
  const qrDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
  return qrDataUrl;
}

export function QRCard({ zone, qrDataUrl }) {
  return (
    <div className="qr-card" style={{ width: '85mm', height: '55mm', padding: '8mm', border: '1px solid #ccc' }}>
      <div style={{ fontSize: '10pt', fontWeight: 'bold' }}>{zone.venueName}</div>
      <div style={{ fontSize: '8pt', color: '#555', marginBottom: '4mm' }}>{zone.name}</div>
      <div style={{ display: 'flex', gap: '4mm', alignItems: 'center' }}>
        <img src={qrDataUrl} width={80} height={80} alt="QR code" />
        <div>
          <div style={{ fontSize: '8pt', color: '#333', marginBottom: '2mm' }}><strong>In an emergency:</strong></div>
          <div style={{ fontSize: '7pt', color: '#555' }}>
            1. Scan this QR code<br/>
            2. Tap the SOS button<br/>
            3. Follow the instructions
          </div>
        </div>
      </div>
      <div style={{ fontSize: '6pt', color: '#aaa', marginTop: '3mm' }}>
        Exit route: {zone.exitRoute.slice(0, 60)}...
      </div>
    </div>
  );
}
```

---

## 14. Google Maps Integration

```javascript
// admin/src/components/MapOverlay/index.jsx
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const CRISIS_TYPE_ICONS = {
  fire: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  medical: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  security: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
  default: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
};

export function IncidentMap({ venueLocation, sosPins, assemblyPoints }) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY });
  const [selectedPin, setSelectedPin] = useState(null);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap center={venueLocation} zoom={17} mapContainerStyle={{ width: '100%', height: '400px' }}>
      {sosPins.map(pin => (
        <Marker
          key={pin.sosId}
          position={venueLocation}
          icon={CRISIS_TYPE_ICONS[pin.crisisType] || CRISIS_TYPE_ICONS.default}
          onClick={() => setSelectedPin(pin)}
        />
      ))}
      {assemblyPoints.map((ap, i) => (
        <Marker key={i} position={ap.location} label={{ text: 'A', color: 'white', fontWeight: 'bold' }} />
      ))}
      {selectedPin && (
        <InfoWindow position={venueLocation} onCloseClick={() => setSelectedPin(null)}>
          <div>
            <strong>{selectedPin.crisisType}</strong><br/>
            Zone: {selectedPin.zoneId}<br/>
            Urgency: {selectedPin.urgency}<br/>
            {formatRelativeTime(selectedPin.timestamp)} ago
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
```

---

## 15. Venue Onboarding — Prebuilt Templates

> **Problem solved:** The original design required admins to manually configure all zones, wardens, playbooks, and escalation rules from scratch before a venue could go live. For a hotel with 10 floors, kitchen, lobby, pool, and parking, this is hours of setup that blocks adoption. v2.0 introduces a one-click onboarding wizard that seeds the venue with a complete template matched to the venue type.

### 15.1 Onboarding Wizard Flow

```
Step 1: Select venue type (hotel / mall / restaurant / event / cowork)
      ↓
Step 2: Enter venue name, address, admin contact
      ↓
Step 3: Review pre-seeded zones (auto-generated from template)
        — Edit names, capacities, exit routes, assembly points
      ↓
Step 4: Review pre-seeded playbooks (fire, medical, security pre-configured)
        — Edit guest messages and checklist tasks
      ↓
Step 5: Add staff accounts per zone per shift
      ↓
Step 6: Acknowledge compliance notice
      ↓
Step 7: Generate and print QR codes for all zones
      ↓
Venue is live — setupComplete = true
```

### 15.2 Default Zone Templates by Venue Type

```javascript
// functions/src/seedVenue.js
const VENUE_ZONE_TEMPLATES = {
  hotel: [
    { name: 'Ground Floor Lobby', type: 'lobby', capacity: 80, riskProfile: 'medium', isSeniorZone: true,
      exitRoute: 'Direct guests through main entrance or east/west emergency exits.',
      assemblyPoint: 'Car park entrance, ground level — all zones',
      notes: 'Mobility-impaired guest refuge at east lobby stairwell. AED at reception desk.' },
    { name: 'Kitchen', type: 'kitchen', capacity: 12, riskProfile: 'high', isSeniorZone: false,
      exitRoute: 'Exit via kitchen back door to service corridor. Turn right to Exit B.',
      assemblyPoint: 'Service yard, north entrance',
      notes: 'CO2 extinguisher at Station K2 (east wall). Gas shutoff valve behind oven station. Do not use water on grease fires.' },
    { name: 'Floor 1', type: 'floor', capacity: 48, riskProfile: 'medium', isSeniorZone: false,
      exitRoute: 'Turn left from lifts, take Stairwell A. Do not use lifts.',
      assemblyPoint: 'Car park entrance, ground level, Gate A',
      notes: 'Template — update with actual floor details before going live.' },
    { name: 'Basement Parking', type: 'parking', capacity: 120, riskProfile: 'low', isSeniorZone: false,
      exitRoute: 'Follow green pedestrian walkways to Level 0. Do not use vehicle ramps.',
      assemblyPoint: 'Street level, Gate A (main road)',
      notes: 'CO2 extinguisher at Parking Level B1, Column P4.' }
  ],
  mall: [
    { name: 'Ground Floor Atrium', type: 'lobby', capacity: 400, riskProfile: 'high', isSeniorZone: true,
      exitRoute: 'Direct crowd to nearest exit gates. Avoid central escalators in fire.',
      assemblyPoint: 'Car park Level P1 ramp exit, Gate M1',
      notes: 'High crowd density zone. Crowd surge protocol applies. AED at information kiosk.' },
    { name: 'Food Court', type: 'dining', capacity: 200, riskProfile: 'high', isSeniorZone: false,
      exitRoute: 'Exit through fire exit doors at north and south ends of food court.',
      assemblyPoint: 'External plaza, north entry',
      notes: 'Multiple cooking stations — gas shutoff master valve at food court manager office.' },
    { name: 'Anchor Store — Ground', type: 'floor', capacity: 150, riskProfile: 'medium', isSeniorZone: false,
      exitRoute: 'Direct customers to emergency exits on east and west walls.',
      assemblyPoint: 'Car park Level P1 ramp exit',
      notes: 'Template — update with actual store details.' },
    { name: 'Parking Levels P1–P3', type: 'parking', capacity: 600, riskProfile: 'low', isSeniorZone: false,
      exitRoute: 'Follow green emergency lighting to pedestrian stairwells. Do not use vehicle ramps.',
      assemblyPoint: 'Street level entrance, Gate M2',
      notes: 'CO2 extinguisher every 20m at columns.' }
  ],
  restaurant: [
    { name: 'Dining Area', type: 'dining', capacity: 60, riskProfile: 'medium', isSeniorZone: true,
      exitRoute: 'Guide guests through main entrance or emergency exit at rear of dining room.',
      assemblyPoint: 'Pavement outside main entrance',
      notes: 'AED at manager station. Maximum table capacity must not exceed fire rating.' },
    { name: 'Kitchen', type: 'kitchen', capacity: 8, riskProfile: 'high', isSeniorZone: false,
      exitRoute: 'Exit via kitchen back door to service lane.',
      assemblyPoint: 'Service lane, 10m from back door',
      notes: 'CO2 extinguisher at fryer station. Gas shutoff at back wall. Ansul system fitted above grill — do not tamper.' },
    { name: 'Bar Area', type: 'bar', capacity: 30, riskProfile: 'medium', isSeniorZone: false,
      exitRoute: 'Guide guests through side exit door (marked in green) at bar end.',
      assemblyPoint: 'Pavement outside main entrance',
      notes: 'Bar zone shares assembly point with dining area. CO2 extinguisher under bar counter.' }
  ],
  event: [
    { name: 'Main Stage / Floor', type: 'stage', capacity: 500, riskProfile: 'high', isSeniorZone: true,
      exitRoute: 'Activate all exit gates simultaneously. Direct crowd to east and west exits first.',
      assemblyPoint: 'Outer perimeter — designated marshalling areas A, B, C',
      notes: 'Crowd surge protocol: never funnel to single exit. AED at stage manager position.' },
    { name: 'Entry / Ticketing', type: 'lobby', capacity: 200, riskProfile: 'high', isSeniorZone: false,
      exitRoute: 'Reverse crowd flow through entry gates. Open all gates for outflow.',
      assemblyPoint: 'Car park entry, 50m from main gate',
      notes: 'Peak risk zone during ingress/egress. Maintain clear lanes at all times.' },
    { name: 'Backstage / Production', type: 'other', capacity: 30, riskProfile: 'medium', isSeniorZone: false,
      exitRoute: 'Exit via backstage emergency door to service road.',
      assemblyPoint: 'Service road, 20m from backstage door',
      notes: 'High electrical load zone. CO2 extinguisher at production desk.' }
  ],
  cowork: [
    { name: 'Open Workspace', type: 'cowork', capacity: 80, riskProfile: 'low', isSeniorZone: true,
      exitRoute: 'Direct all members to stairwell at north end of floor. Do not use lifts.',
      assemblyPoint: 'Street level, building front entrance',
      notes: 'AED at reception desk. Fire extinguisher at north and south walls.' },
    { name: 'Meeting Rooms', type: 'other', capacity: 20, riskProfile: 'low', isSeniorZone: false,
      exitRoute: 'Exit meeting rooms to corridor. Take north stairwell.',
      assemblyPoint: 'Street level, building front entrance',
      notes: 'Rooms may be occupied with doors closed — warden must check all rooms.' }
  ]
};
```

### 15.3 Seed Venue Cloud Function

```javascript
// functions/src/seedVenue.js (continued)
exports.seedVenueFromTemplate = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { venueId, venueType } = data;
  const db = admin.firestore();

  // Verify caller is admin of this venue
  const staffDoc = await db.doc(`venues/${venueId}/staff/${context.auth.uid}`).get();
  if (!staffDoc.exists || staffDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Must be venue admin');
  }

  const zoneTemplates = VENUE_ZONE_TEMPLATES[venueType] || VENUE_ZONE_TEMPLATES.hotel;
  const playbookTemplates = DEFAULT_PLAYBOOKS[venueType] || DEFAULT_PLAYBOOKS.hotel;

  const batch = db.batch();

  // Seed zones
  for (const zone of zoneTemplates) {
    const zoneRef = db.collection(`venues/${venueId}/zones`).doc();
    const qrToken = `${zone.type}-${Math.random().toString(36).slice(2, 9)}`;
    batch.set(zoneRef, {
      ...zone,
      zoneId: zoneRef.id,
      wardensByShift: { morning: null, evening: null, night: null },
      backupWarden: null,
      qrToken,
      createdAt: admin.firestore.Timestamp.now()
    });
  }

  // Seed playbooks
  for (const [crisisType, playbook] of Object.entries(playbookTemplates)) {
    const playbookRef = db.doc(`venues/${venueId}/playbooks/${crisisType}`);
    batch.set(playbookRef, { crisisType, ...playbook });
  }

  // Mark venue as having a seeded template (still requires admin review before setupComplete)
  batch.update(db.doc(`venues/${venueId}`), { templateSeeded: true });

  await batch.commit();
  return { success: true, zonesCreated: zoneTemplates.length, playbooksCreated: Object.keys(playbookTemplates).length };
});
```

### 15.4 Default Playbook Templates

```javascript
const DEFAULT_PLAYBOOKS = {
  hotel: {
    fire: {
      zoneNotificationOrder: ['kitchen', 'floor', 'lobby', 'parking'],
      defaultSeverity: 2,
      escalationTriggers: { sos_cluster_count: 3, sos_cluster_window_seconds: 120, warden_ack_timeout_seconds: 90 },
      guestMessageByLevel: {
        1: "Staff are investigating a report near your area. Please remain calm and await further information.",
        2: "An incident has been confirmed in the hotel. Please remain in your room. Do not use lifts. Await further instructions.",
        3: "EVACUATE NOW. Leave your room immediately. Use the stairwell — do not use lifts. Proceed to the assembly point."
      },
      checklistsByZoneType: { /* full checklists from Section 3.4 */ }
    },
    medical: {
      zoneNotificationOrder: ['all'],
      defaultSeverity: 2,
      guestMessageByLevel: {
        1: "Staff are assisting a guest nearby. Please allow staff to pass freely in corridors.",
        2: "Medical assistance is in progress. Please remain clear of corridors for emergency access.",
        3: "Please remain in your rooms. Emergency services are on site."
      }
    },
    security: {
      zoneNotificationOrder: ['lobby', 'floor', 'parking'],
      defaultSeverity: 2,
      guestMessageByLevel: {
        1: "A security matter is being investigated. Please remain calm.",
        2: "A security incident is active. Please remain in your room and lock your door until further notice.",
        3: "LOCKDOWN IN EFFECT. Lock your room door. Do not open it for anyone. Call the front desk."
      }
    }
  },
  mall: {
    fire: {
      zoneNotificationOrder: ['food_court', 'ground_atrium', 'anchor_stores', 'parking'],
      defaultSeverity: 2
    },
    crowd_surge: {
      zoneNotificationOrder: ['ground_atrium', 'entry'],
      defaultSeverity: 3,
      guestMessageByLevel: {
        1: "Some congestion has been reported. Security staff are managing the situation.",
        2: "Please move away from crowded areas. Follow staff directions.",
        3: "EVACUATE IMMEDIATELY. Move calmly to the nearest exit. Do not run."
      }
    }
  },
  restaurant: {
    fire: {
      zoneNotificationOrder: ['kitchen', 'dining', 'bar'],
      defaultSeverity: 2,
      guestMessageByLevel: {
        1: "Staff are investigating a report. Please remain calm.",
        2: "Please prepare to leave. Staff will guide you to the nearest exit.",
        3: "Please leave the restaurant now via the nearest exit. Follow staff instructions."
      }
    },
    food_contamination: {
      zoneNotificationOrder: ['kitchen', 'dining'],
      defaultSeverity: 2,
      guestMessageByLevel: {
        1: "We are investigating a report about the food. We will update you shortly.",
        2: "We have paused food service for investigation. We apologise for the inconvenience.",
        3: "Please stop eating and drinking. Staff will assist you. Please do not leave the venue."
      }
    }
  },
  event: {
    crowd_surge: {
      zoneNotificationOrder: ['stage', 'entry'],
      defaultSeverity: 3,
      escalationTriggers: { sos_cluster_count: 2, sos_cluster_window_seconds: 60, warden_ack_timeout_seconds: 60 }
    },
    medical: {
      zoneNotificationOrder: ['all'],
      defaultSeverity: 2
    }
  }
};
```

---

## 16. Playbook Configuration

### 16.1 Minimum Required Setup Before Going Live

Before `setupComplete` can be set to `true` and a venue can go live, the following must be confirmed:

- At least 2 zones configured with names, types, capacity, exit routes, and assembly points
- At least 1 staff member per zone assigned per shift
- Fire playbook fully configured (mandatory minimum)
- Duty manager assigned for current and next shift
- Admin has acknowledged the compliance notice
- QR codes generated and printed for all zones
- At least 1 test incident run using the Demo mode

### 16.2 Setup Completeness Check (Cloud Function)

```javascript
exports.checkSetupReadiness = functions.https.onCall(async (data, context) => {
  const { venueId } = data;
  const db = admin.firestore();
  const issues = [];

  const zonesSnap = await db.collection(`venues/${venueId}/zones`).get();
  if (zonesSnap.size < 2) issues.push('At least 2 zones required');

  const staffSnap = await db.collection(`venues/${venueId}/staff`).get();
  if (staffSnap.size < 1) issues.push('At least 1 staff member required');

  const firePlaybook = await db.doc(`venues/${venueId}/playbooks/fire`).get();
  if (!firePlaybook.exists) issues.push('Fire playbook must be configured');

  const venueDoc = await db.doc(`venues/${venueId}`).get();
  if (!venueDoc.data().complianceAcknowledged) issues.push('Compliance notice must be acknowledged');

  const hasDutyManager = staffSnap.docs.some(d => d.data().role === 'dutyManager');
  if (!hasDutyManager) issues.push('At least one Duty Manager must be assigned');

  if (issues.length === 0) {
    await db.doc(`venues/${venueId}`).update({ setupComplete: true });
  }

  return { ready: issues.length === 0, issues };
});
```

---

## 17. Post-Incident AI Report

```javascript
// functions/src/gemini/postIncidentReport.js
exports.generatePostIncidentReport = functions.firestore
  .document('venues/{venueId}/incidents/{incidentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === 'active' && after.status === 'resolved') {
      const { venueId, incidentId } = context.params;

      const timelineSnap = await db
        .collection(`venues/${venueId}/incidents/${incidentId}/timeline`)
        .orderBy('timestamp', 'asc').get();
      const timeline = timelineSnap.docs.map(d => d.data());

      const zoneStatusesSnap = await db
        .collection(`venues/${venueId}/incidents/${incidentId}/zoneStatuses`).get();
      const zoneStatuses = zoneStatusesSnap.docs.map(d => ({ zoneId: d.id, ...d.data() }));

      const incidentStart = after.triggeredAt.toMillis();
      const incidentEnd = after.resolvedAt.toMillis();
      const durationMinutes = Math.round((incidentEnd - incidentStart) / 60000);

      const avgAckTime = zoneStatuses
        .filter(z => z.acknowledgedAt && z.notifiedAt)
        .reduce((sum, z) => sum + (z.acknowledgedAt.toMillis() - z.notifiedAt.toMillis()), 0)
        / Math.max(1, zoneStatuses.filter(z => z.acknowledgedAt).length) / 1000;

      const prompt = `You are an emergency management consultant. Analyse this completed incident and write a professional post-incident report.

Incident Details:
- Crisis type: ${after.crisisType}
- Duration: ${durationMinutes} minutes
- Maximum severity reached: Level ${Math.max(...after.severityHistory.map(s => s.level))}
- Autonomous mode was active: ${after.autonomousModeActive}

Zone Response Performance:
${zoneStatuses.map(z =>
  `- Zone ${z.zoneId}: Ack in ${z.acknowledgedAt
    ? Math.round((z.acknowledgedAt.toMillis() - z.notifiedAt.toMillis()) / 1000) + 's'
    : 'NEVER'}, Tasks: ${z.checklistCompletion || 0}%, Final status: ${z.statusLabel}`
).join('\n')}

Average warden acknowledgment time: ${Math.round(avgAckTime)}s

Timeline (${timeline.length} events):
${timeline.slice(0, 30).map(e =>
  `[${minutesFromStart(e.timestamp, incidentStart)}min] ${e.eventType}: ${e.description}`
).join('\n')}

Write a structured post-incident report with these sections:
1. Executive Summary (3-4 sentences)
2. Response Timeline (key milestones)
3. Zone Performance (per zone, flag slow or unresponsive)
4. Protocol Gaps Identified (specific, data-backed)
5. Recommended Improvements (3-5 actionable items)

Be specific and data-driven. Reference actual times and zone names.`;

      const result = await model.generateContent(prompt);
      const report = result.response.candidates[0].content.parts[0].text;

      await db.doc(`venues/${venueId}/incidents/${incidentId}/report`).set({
        report,
        generatedAt: admin.firestore.Timestamp.now(),
        metrics: {
          durationMinutes,
          avgAcknowledgmentSeconds: Math.round(avgAckTime),
          zonesWithNoAck: zoneStatuses.filter(z => !z.acknowledgedAt).length,
          totalSOSCount: after.totalSOSCount || 0
        }
      });
    }
  });
```

---

## 18. Environment Variables

### Admin & Staff PWAs (.env)

```bash
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_VAPID_KEY=
REACT_APP_MAPS_API_KEY=
# No REACT_APP_FIREBASE_DATABASE_URL — Realtime DB not used in v2.0
```

### Cloud Functions (.env / Secret Manager)

```bash
GEMINI_API_KEY=
GCLOUD_PROJECT=crisissync-prod
VERTEX_AI_LOCATION=us-central1
# VISION_AI_ENABLED removed — Phase 2 only
```

### Google Cloud APIs to Enable

In Google Cloud Console → APIs & Services:

- Vertex AI API
- Firebase Admin SDK (auto-enabled)
- Maps JavaScript API
- Cloud Functions API
- Cloud Pub/Sub API
- Cloud Scheduler API
- Cloud Vision API is **NOT required** for Phase 1 MVP

---

## 19. Deployment

### 19.1 Firebase Hosting — Multiple Sites

```json
{
  "hosting": [
    {
      "target": "admin",
      "public": "admin/build",
      "ignore": ["firebase.json", "**/.*"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }]
    },
    {
      "target": "staff",
      "public": "staff/build",
      "ignore": ["firebase.json", "**/.*"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }],
      "headers": [{ "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }]
    },
    {
      "target": "guest",
      "public": "guest/build",
      "ignore": ["firebase.json", "**/.*"],
      "rewrites": [{ "source": "**", "destination": "/index.html" }],
      "headers": [{
        "source": "**",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=3600" },
          { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
        ]
      }]
    }
  ],
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
  // No "database" key — Realtime DB not used
}
```

### 19.2 Deploy Commands

```bash
cd admin && npm run build && cd ..
cd staff && npm run build && cd ..
cd guest && npm run build && cd ..

firebase deploy
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only hosting:guest
```

### 19.3 Firebase Hosting Targets

```bash
firebase target:apply hosting admin crisissync-admin
firebase target:apply hosting staff crisissync-staff
firebase target:apply hosting guest crisissync-guest
```

---

## 20. Demo Setup Guide

### 20.1 Demo Venue — Use Template Seeding

For the demo, create the venue using the onboarding wizard (hotel template). This creates all zones and playbooks in one step. Then edit zone details:

```
Venue name: Grand Orchid Hotel (Demo)
Venue type: Hotel → Select "Use Hotel Template"

After seeding, update zone details:
1. Floor 7 (template "Floor 1" renamed)
   Exit route: Turn left from lifts, take Stairwell B at corridor end. Do not use lifts.
   Assembly point: Car park entrance, Level 0, Gate B
   Notes: AED at Floor 6 nurse station. CO2 extinguisher at Stairwells 7A and 7B.

2. Kitchen — already seeded with full details. Review and confirm.

3. Lobby — already seeded. Mark as senior zone.

4. Basement Parking — already seeded. Review and confirm.
```

### 20.2 Demo Staff Accounts

```
Admin:         admin@demo.crisissync.app / Demo@1234
Duty Manager:  manager@demo.crisissync.app / Demo@1234
Floor 7 Warden:   warden1@demo.crisissync.app / Demo@1234
Kitchen Warden:   warden2@demo.crisissync.app / Demo@1234
Lobby Warden (Senior): warden3@demo.crisissync.app / Demo@1234
```

### 20.3 Demo Script (2 minutes)

**Segment 1 — Setup (25 sec)**
- Open Admin dashboard
- Show onboarding wizard completion with hotel template pre-loaded
- Show Zone Grid: 4 zones in green (all clear)
- Show fire playbook pre-configured from template

**Segment 2 — Guest SOS (20 sec)**
- Open Guest PWA in second tab with Floor 7 QR token URL
- Tap SOS → Fire → I need help NOW → Many people
- Switch to Admin dashboard — SOS alert appears in feed within ~2 seconds
- Floor 7 zone card turns amber

**Segment 3 — Incident Activation (15 sec)**
- Admin taps "Activate Incident — Fire — Level 2"
- Switch to warden's device — full-screen push notification arrives
- Tap notification — PWA opens to Floor 7 fire checklist

**Segment 4 — Warden Response (20 sec)**
- Warden marks 2 checklist tasks complete
- Admin dashboard: checklist completion rises (0% → 40%)
- Warden taps "Person Needs Help"
- Admin board: Floor 7 turns red

**Segment 5 — AI in Action (20 sec)**
- Show AI Tips panel on warden's screen
- Switch to Guest PWA — show instructions in guest's browser language
- Show translated evacuation instructions from Gemini
- Admin clicks "Simulate Camera Anomaly" — simulated event appears with SIM badge

**Segment 6 — Close + Report (15 sec)**
- Admin marks incident resolved
- Post-incident AI report generates (3–5 seconds)
- Scroll through: zone performance metrics, protocol gaps, recommendations

---

## 21. Testing Checklist

### Core Flow Tests

- [ ] Guest scans QR → zone info loads correctly and session is created
- [ ] Guest submits SOS with valid session → alert appears on admin board within 2 seconds
- [ ] Guest submits 4 SOSs → 4th submission is rejected with "Staff are responding" message
- [ ] Guest submits SOS with invalid/expired session → returns error prompting re-scan
- [ ] Admin triggers incident → all zone wardens receive push within 5 seconds
- [ ] Warden marks task complete → admin checklist % updates in real time via Firestore
- [ ] Warden taps quick status → admin board reflects within 1 second
- [ ] Severity auto-escalates when 3+ SOSs arrive from same zone within 2 minutes
- [ ] Warden non-acknowledgment after 90s → backup warden notified
- [ ] Admin inactive for 90s → duty manager notified
- [ ] No human active for 3 min → senior warden notified + autonomous mode activates
- [ ] Incident close → post-incident report generated within 10 seconds

### Security Tests

- [ ] Submitting SOS with a valid session token for Zone A to a Zone B endpoint is rejected
- [ ] Expired session (>4 hours) is rejected with re-scan prompt
- [ ] Rate limiting: >5 SOSs from same IP in 5 minutes returns 429
- [ ] Rate limiting: >3 SOSs from same session returns 429
- [ ] Guest cannot read other zones' SOS data via direct Firestore query
- [ ] Staff member cannot access other venues' data
- [ ] Warden cannot update another warden's zone status

### Offline Tests

- [ ] Kill Wi-Fi after Guest PWA first load → zone info still visible from cache
- [ ] Submit SOS while offline → queues and sends on reconnect
- [ ] Kill Wi-Fi after Staff PWA loads checklist → checklist visible and tappable
- [ ] Kill Wi-Fi on admin → offline banner shown, no data corruption

### AI Tests

- [ ] Staff tips load within 3 seconds of opening incident view
- [ ] Guest instructions appear in correct browser language
- [ ] Admin suggestions appear and are relevant to current incident state
- [ ] Post-incident report is generated and saved after incident close

### PWA Tests

- [ ] Guest PWA opens without app store on iOS Safari and Android Chrome
- [ ] Staff PWA receives push when closed
- [ ] Guest PWA QR URL works from any QR scanner
- [ ] Push notification "Acknowledge" action works without opening full PWA

### Onboarding Tests

- [ ] Selecting "hotel" template seeds 4 zones and correct playbooks
- [ ] Setup readiness check correctly blocks go-live when zones < 2
- [ ] Compliance acknowledgment is required before setupComplete = true
- [ ] Duplicate QR tokens are not generated across zones in same venue

---

*CrisisSync — Google Solution Challenge 2025*  
*Build instructions v2.0 — Revised for deployability, security hardening, and realistic MVP scope*
