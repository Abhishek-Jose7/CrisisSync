const admin = require('firebase-admin');

/**
 * Checks for zones that have not acknowledged notification within timeouts.
 * Escalates to senior wardens or autonomous mode if timeouts are breached.
 */
exports.checkEscalation = async (db) => {
  const venuesSnap = await db.collection('venues').get();
  const now = new Date().getTime();

  for (const venue of venuesSnap.docs) {
    const actIncSnap = await db.collection('venues').doc(venue.id)
      .collection('incidents').doc('active').get();
      
    if (!actIncSnap.exists) continue;

    const incident = actIncSnap.data();
    if (incident.status === 'resolved') continue;

    // Check zone statuses for unacknowledged notifications
    const statusesSnap = await db.collection('venues').doc(venue.id).collection('live_status').get();
    
    const batch = db.batch();
    let requiresSeniorEscalation = false;

    statusesSnap.docs.forEach(doc => {
      const state = doc.data();
      if (state.statusLabel === 'notified' && !state.acknowledgedAt) {
        // If notified more than 90 seconds ago
        const notifiedAt = state.notifiedAt.toMillis();
        if ((now - notifiedAt) > 90000) {
          requiresSeniorEscalation = true;
          // Mark as escalated
          batch.update(doc.ref, {
             escalatedToSenior: true,
             lastUpdateAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    });

    if (requiresSeniorEscalation) {
      // In full system, this would trigger FCM to Senior Wardens
      console.log(`[ESCALATION] Venue ${venue.id} has unacknowledged zones. Routing to Senior Wardens.`);
    }

    await batch.commit();
  }
};
