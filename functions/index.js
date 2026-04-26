const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { computeSeverity } = require("./src/severity");
const { checkEscalation } = require("./src/escalation");
const { generateSessionToken, verifySessionToken } = require("./src/session");

admin.initializeApp();
const db = admin.firestore();

// 1. Guest Session Token Generation
exports.createGuestSession = onCall(async (request) => {
  const { zoneId, qrToken } = request.data;
  if (!zoneId || !qrToken) {
    throw new HttpsError('invalid-argument', 'Missing zone ID or QR token');
  }

  // Validate QR token against zone record
  const zoneSnap = await db.collection('venues').doc(request.auth?.token?.venueId || 'demo-venue-001')
    .collection('zones').doc(zoneId).get();
    
  if (!zoneSnap.exists || zoneSnap.data().qrToken !== qrToken) {
    throw new HttpsError('unauthenticated', 'Invalid QR token for this zone');
  }

  const token = generateSessionToken(zoneId);
  return { sessionToken: token };
});

// 2. SOS Submission
exports.submitSOS = onCall(async (request) => {
  const { venueId, zoneId, crisisType, urgency, affectedCount, sessionToken } = request.data;

  // Security: Prevent spam and spoofing via signed session token
  const isValid = verifySessionToken(sessionToken, zoneId);
  if (!isValid) {
    throw new HttpsError('permission-denied', 'Invalid or expired session token');
  }

  const sosRef = db.collection('venues').doc(venueId).collection('incidents')
    .doc('active').collection('sos').doc();

  await sosRef.set({
    zoneId,
    crisisType,
    urgency,
    affectedCount,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    processed: false
  });

  return { success: true, sosId: sosRef.id };
});

// 3. Severity Computation Trigger
exports.onSOSCreated = onDocumentCreated("venues/{venueId}/incidents/{incidentId}/sos/{sosId}", async (event) => {
  const snap = event.data;
  if (!snap) return;

  const venueId = event.params.venueId;
  const incidentId = event.params.incidentId;
  const incidentRef = db.collection('venues').doc(venueId).collection('incidents').doc(incidentId);

  await db.runTransaction(async (transaction) => {
    const incidentSnap = await transaction.get(incidentRef);
    if (!incidentSnap.exists) return;

    // Fetch context
    const sosQuery = await transaction.get(incidentRef.collection('sos').where('processed', '==', false));
    const newSeverity = computeSeverity(incidentSnap.data(), sosQuery.docs.map(d => d.data()));

    if (newSeverity > incidentSnap.data().currentSeverity) {
      transaction.update(incidentRef, {
        currentSeverity: newSeverity,
        severityHistory: admin.firestore.FieldValue.arrayUnion({
          level: newSeverity,
          setAt: admin.firestore.FieldValue.serverTimestamp(),
          setBy: 'system'
        })
      });
    }

    // Mark processed
    sosQuery.docs.forEach(doc => {
      transaction.update(doc.ref, { processed: true });
    });
  });
});

// 4. Escalation Cron (Runs every minute)
const { onSchedule } = require("firebase-functions/v2/scheduler");
exports.escalationCheck = onSchedule("every 1 minutes", async (event) => {
  await checkEscalation(db);
});
