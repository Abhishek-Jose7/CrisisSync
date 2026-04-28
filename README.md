<p align="center">
  <img src="https://img.shields.io/badge/Google%20Solution%20Challenge-2026-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Solution Challenge 2026" />
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Gemini%20AI-Integrated-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

# 🚨 CrisisSync

**Real-time emergency coordination platform for venues — hotels, malls, hospitals, restaurants, and event spaces.**

CrisisSync helps venue staff communicate faster, coordinate zone-based emergency responses, and record incident timelines. Built for the **Google Solution Challenge 2026**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Quick Start](#quick-start)
- [Demo Mode](#demo-mode)
- [Environment Variables](#environment-variables)
- [Firebase Setup](#firebase-setup)
- [Deployment](#deployment)
- [Demo Accounts](#demo-accounts)
- [Testing Checklist](#testing-checklist)
- [Compliance Notice](#compliance-notice)

---

## Overview

CrisisSync is a multi-portal emergency coordination system consisting of three Progressive Web Apps and a Cloud Functions backend:

| Portal | Purpose | Users |
|--------|---------|-------|
| **Admin Dashboard** | Incident command center, zone management, AI insights, drill control | Venue managers, safety officers |
| **Staff PWA** | Field response — checklists, zone status updates, real-time comms | Wardens, duty managers |
| **Guest PWA** | SOS submission, evacuation instructions, multilingual safety info | Hotel guests, mall visitors |
| **Landing Website** | Product marketing and information page | Public |

### How It Works

```
Guest scans QR code → Submits SOS alert → Severity model scores threat
    ↓                                           ↓
Staff gets push notification → Runs checklist → Reports zone status
    ↓                                           ↓
Admin sees live command board → AI suggestions → Coordinates response
    ↓
Post-incident AI report generated automatically
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Cloud                            │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Firestore │  │ Cloud Funcs  │  │ Firebase Auth         │ │
│  │ (DB)      │  │ (Severity,   │  │ (Email/Password)      │ │
│  │           │  │  Escalation, │  │                       │ │
│  │ onSnapshot│  │  Guest Auth, │  │                       │ │
│  │ real-time │  │  Gemini AI)  │  │                       │ │
│  └──────────┘  └──────────────┘  └───────────────────────┘ │
└────────┬──────────────┬──────────────────┬──────────────────┘
         │              │                  │
    ┌────▼────┐   ┌─────▼─────┐    ┌──────▼──────┐
    │  Admin  │   │   Staff   │    │    Guest    │
    │  PWA    │   │   PWA     │    │    PWA      │
    │ (React) │   │  (React)  │    │   (React)   │
    │ :5173   │   │  :5174    │    │   :5175     │
    └─────────┘   └───────────┘    └─────────────┘
```

**Key design decision (v2.0):** Firestore-only architecture. All real-time updates use `onSnapshot` listeners (200–500ms latency). Realtime Database is **not** used.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Styling** | Vanilla CSS (tactical dark theme) |
| **Backend** | Firebase Cloud Functions (Node.js 18) |
| **Database** | Cloud Firestore (real-time) |
| **Auth** | Firebase Authentication (Email/Password) |
| **AI** | Google Gemini 1.5 Flash (via Vertex AI) |
| **Maps** | Google Maps JavaScript API |
| **Notifications** | Firebase Cloud Messaging (FCM) |
| **Hosting** | Vercel (current) / Firebase Hosting |

---

## Project Structure

```
CrisisSync/
├── admin/                    # Admin command center (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Command/      # Live incident command board
│       │   ├── Login/        # Admin authentication
│       │   ├── Onboarding/   # Venue setup wizard (9-step)
│       │   ├── Operations/   # Zones, staff, playbooks, reports
│       │   ├── Analytics/    # Post-incident analytics
│       │   └── CCTV/         # Simulated camera feed (Phase 1)
│       ├── components/       # ZoneGrid, FeedPanel, Sidebar, etc.
│       ├── context/
│       │   ├── AuthContext    # Firebase auth + local fallback
│       │   └── DemoContext    # Demo mode state management
│       └── services/         # Firestore data layer
│
├── staff/                    # Staff field response PWA (React + Vite)
│   └── src/
│       ├── pages/
│       │   ├── Login/        # Staff authentication
│       │   ├── Onboarding/   # Profile setup
│       │   ├── ZoneHome/     # Quiet state dashboard
│       │   ├── Incident/     # Active incident — checklist + status
│       │   ├── MapView/      # Zone map
│       │   └── Comms/        # Communication channel
│       ├── components/       # BottomNav, TopBar, AlertFeed
│       └── context/
│           └── DemoContext    # Staff demo state (syncs with admin)
│
├── guest/                    # Guest SOS PWA (React + Vite, minimal)
│   └── src/
│       ├── pages/            # ZoneLanding, SOS flow
│       └── components/       # SafetyCard, SOSForm
│
├── website/                  # Marketing landing page
├── functions/                # Cloud Functions (Node.js 18)
│   └── src/
│       ├── severity.js       # Severity scoring model
│       ├── escalation.js     # Escalation chain logic
│       └── session.js        # Guest session management
│
├── shared/                   # Shared code across apps
│   ├── firebase/config.js    # Firebase initialization
│   ├── constants.js          # Crisis types, severity levels
│   └── accessibility.js      # A11y utilities
│
├── .env                      # Firebase config (VITE_ prefixed)
├── firebase.json             # Firebase hosting/functions config
└── agent.md                  # Full technical specification (v2.0)
```

---

## Features

### 🔴 Incident Management
- **Multi-severity model** — Level 1 (Monitor), Level 2 (Respond), Level 3 (Evacuate)
- **Automated severity scoring** based on crisis type, urgency, affected count, zone risk, SOS clustering
- **Drill mode** — Start fire, medical, security, or flood drills from the admin dashboard
- **Real-time zone grid** with live status indicators and SOS counts

### 👥 Staff Coordination
- **Push notifications** via Firebase Cloud Messaging
- **Zone-specific checklists** auto-loaded per crisis type and zone type
- **Quick status buttons** — Zone Safe, Assistance Needed, Emergency Now
- **Cross-dashboard sync** — Staff status updates reflect on admin dashboard in real-time

### 🆘 Guest SOS System
- **QR code-based** — Guests scan zone QR codes, no app install required
- **Structured SOS form** — Crisis type → Urgency → Affected count (no free text)
- **Session security** — Signed guest sessions with rate limiting and IP throttling
- **Offline SOS queue** — SOSs are queued in IndexedDB and sent on reconnect

### 🤖 AI Integration (Gemini)
- **Staff safety tips** — Context-aware, zone-specific guidance during incidents
- **Admin decision support** — Data-driven suggestions citing specific SOS/zone data
- **Guest multilingual instructions** — Evacuation instructions in guest's browser language
- **Post-incident AI reports** — Automated analysis with performance metrics

### 📡 Escalation Chain
- Admin silent 90s → Duty Manager notified
- Both silent 3min → Senior Warden notified + autonomous mode activates
- Warden non-acknowledgment 90s → Backup warden notified

### 🏢 Venue Onboarding
- **Template-based setup** — Pre-configured zone layouts for hotels, malls, hospitals, restaurants, events, corporate, co-working
- **9-step wizard** — Org type → Details → Venue → Zones → Staff → Playbooks → QR Codes → Compliance → Go Live
- **QR code generation** — Automatic per-zone QR codes for guest access

### 📹 Vision AI (Phase 1 — Simulated)
- Deterministic simulated camera anomaly events for demo purposes
- Real camera integration deferred to Phase 2

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project with Auth + Firestore enabled

### 1. Clone & Install

```bash
git clone https://github.com/Abhishek-Jose7/CrisisSync.git
cd CrisisSync

# Install dependencies for each app
cd admin && npm install && cd ..
cd staff && npm install && cd ..
cd guest && npm install && cd ..
cd website && npm install && cd ..
```

### 2. Configure Environment

Copy `.env.example` to `.env` at the project root and fill in your Firebase credentials:

```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

VITE_ADMIN_URL=http://localhost:5173
VITE_STAFF_URL=http://localhost:5174
VITE_GUEST_URL=http://localhost:5175
```

### 3. Run Development Servers

```bash
# Terminal 1 — Admin Dashboard
cd admin && npm run dev

# Terminal 2 — Staff PWA
cd staff && npm run dev

# Terminal 3 — Guest PWA
cd guest && npm run dev

# Terminal 4 — Landing Website
cd website && npm run dev
```

| App | Default URL |
|-----|------------|
| Admin | http://localhost:5173 |
| Staff | http://localhost:5174 |
| Guest | http://localhost:5175 |
| Website | http://localhost:5176 |

---

## Demo Mode

Both the Admin and Staff apps have a fully functional **demo mode** that runs with in-memory data — no Firebase required.

### Accessing Demo Mode

| App | Demo URL |
|-----|----------|
| Admin | `http://localhost:5173/demo/command` |
| Staff | `http://localhost:5174/demo/` |

### Demo Workflow

1. **Open Admin demo** at `/demo/command` — shows the Grand Orchid Hotel command center with 8 zones
2. **Open Staff demo** at `/demo/` in another tab — auto-logs in as a demo warden
3. **Start a drill** from the Admin dashboard → Staff gets notified in real-time
4. **Staff updates status** (Zone Safe / Assistance Needed / Emergency Now) → Admin dashboard reflects the change
5. **Staff completes checklist tasks** → Admin sees checklist progress update
6. **Admin resolves drill** → Staff receives resolution broadcast

### Cross-Dashboard Sync

Demo mode uses `localStorage` events to synchronize state between the admin and staff dashboards:
- **Broadcasts**: Admin drill start/stop → Staff receives notification
- **Zone status**: Staff quick actions → Admin zone grid updates
- **Checklist progress**: Staff task completion → Admin checklist % updates

---

## Environment Variables

### Client Apps (`.env` at project root)

| Variable | Description | Required |
|----------|------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | ✅ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | ✅ |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | ✅ |
| `VITE_FIREBASE_MEASUREMENT_ID` | Google Analytics ID | Optional |
| `VITE_ADMIN_URL` | Admin dashboard URL | ✅ |
| `VITE_STAFF_URL` | Staff PWA URL | ✅ |
| `VITE_GUEST_URL` | Guest PWA URL | ✅ |

### Cloud Functions (Secret Manager)

| Variable | Description |
|----------|------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `GCLOUD_PROJECT` | Google Cloud project ID |

---

## Firebase Setup

### 1. Create Firebase Project

```bash
npm install -g firebase-tools
firebase login
firebase projects:create your-project-id
firebase init  # Select: Firestore, Functions, Hosting, Emulators
```

### 2. Enable Services

In Firebase Console, enable:
- **Authentication** → Email/Password provider
- **Firestore Database** → Production mode
- **Cloud Functions** → Node.js 18
- **Cloud Messaging** → For push notifications

> ⚠️ **Do NOT enable Realtime Database.** CrisisSync v2.0 uses Firestore exclusively.

### 3. Firestore Data Schema

| Collection | Description |
|-----------|-------------|
| `venues/{venueId}` | Venue configuration, settings, admin UID |
| `venues/{venueId}/zones/{zoneId}` | Zone details, exit routes, QR tokens |
| `venues/{venueId}/staff/{staffId}` | Staff profiles, roles, assigned zones |
| `venues/{venueId}/playbooks/{type}` | Crisis response playbooks |
| `venues/{venueId}/incidents/{id}` | Incident records |
| `venues/{venueId}/incidents/{id}/sos` | Guest SOS alerts |
| `venues/{venueId}/incidents/{id}/zoneStatuses` | Per-zone warden status |
| `venues/{venueId}/incidents/{id}/timeline` | Event timeline |
| `guestSessions/{sessionId}` | Validated guest sessions (4hr TTL) |
| `staffInvites/{inviteId}` | Staff invite tokens |

---

## Deployment

### Vercel (Current)

Each app is deployed as a separate Vercel project:

| App | Production URL |
|-----|---------------|
| Admin | https://crisis-sync-jovf.vercel.app |
| Staff | https://crisis-sync-usof.vercel.app |
| Guest | https://crisis-sync-vvh5.vercel.app |

### Firebase Hosting (Alternative)

```bash
# Build all apps
cd admin && npm run build && cd ..
cd staff && npm run build && cd ..
cd guest && npm run build && cd ..

# Deploy
firebase deploy --only hosting
firebase deploy --only functions
```

---

## Demo Accounts

For the demo environment:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.crisissync.app | Demo@1234 |
| Duty Manager | manager@demo.crisissync.app | Demo@1234 |
| Floor 7 Warden | warden1@demo.crisissync.app | Demo@1234 |
| Kitchen Warden | warden2@demo.crisissync.app | Demo@1234 |
| Lobby Warden (Senior) | warden3@demo.crisissync.app | Demo@1234 |

> **Note:** Demo mode (`/demo/*` routes) works without any accounts — it uses in-memory state.

---

## Testing Checklist

### Core Flow
- [ ] Guest scans QR → Zone info loads, session created
- [ ] Guest submits SOS → Alert appears on admin board within 2s
- [ ] Admin triggers drill → All zone wardens notified
- [ ] Warden marks task complete → Admin checklist % updates real-time
- [ ] Warden taps quick status → Admin board reflects within 1s
- [ ] Admin resolves incident → Staff receives resolution broadcast

### Security
- [ ] Guest SOS rate limited (max 3 per session, 5 per IP per 5min)
- [ ] Expired sessions rejected with re-scan prompt
- [ ] Staff cannot access other venues' data
- [ ] Warden cannot update another warden's zone status

### Offline
- [ ] Guest PWA: Zone info visible from cache when offline
- [ ] Staff PWA: Checklist visible and tappable when offline
- [ ] Admin: Offline banner shown, no data corruption

---

## Compliance Notice

> **⚠️ Important Legal Notice**
>
> CrisisSync is an **emergency coordination and communication platform** for venue staff. It is **not** a replacement for:
>
> - Legally mandated fire safety systems (fire panels, alarms, sprinklers)
> - Emergency services dispatch (always call local emergency numbers)
> - Certified fire safety officers or legally required evacuation wardens
> - Building compliance inspections or occupancy certificates
>
> CrisisSync helps wardens communicate faster, coordinate zone responses, and record incident timelines. It **does not guarantee response times, evacuation outcomes, or life safety outcomes**. Venues using CrisisSync remain fully responsible for their legal fire safety obligations.

---

## License

Built for the Google Solution Challenge 2026.

---

<p align="center">
  <strong>CrisisSync</strong> — Because every second counts in an emergency.
</p>
