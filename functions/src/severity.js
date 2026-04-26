/**
 * Compute the severity level (1, 2, or 3) of an active incident based on new SOS inputs and context.
 */
exports.computeSeverity = (incidentData, newSOSList) => {
  let currentLevel = incidentData.currentSeverity || 1;
  if (currentLevel === 3) return 3; // Maxed out
  
  let scorePoints = 0;

  // Signal Inputs Evaluation
  for (const sos of newSOSList) {
    if (sos.urgency === 'need_help') scorePoints += 2;
    if (sos.affectedCount === 'many') scorePoints += 3;
    if (sos.affectedCount === 'few') scorePoints += 1;
  }

  // Rapid influx logic (if more than 3 SOS in 60s, escalate)
  if (newSOSList.length >= 3) {
    scorePoints += 3;
  }

  // Thresholds
  if (scorePoints >= 5 && currentLevel < 3) return 3;
  if (scorePoints >= 2 && currentLevel < 2) return 2;

  return currentLevel;
};
