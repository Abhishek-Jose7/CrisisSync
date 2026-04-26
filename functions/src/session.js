// Mock implementation for session tokens
// In production, this uses jsonwebtokens mapped to Firebase Auth Custom Tokens or secure signed strings

const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-do-not-use-in-prod';

exports.generateSessionToken = (zoneId) => {
  // Simple hex string for demo. In prod: use JWT with 6-hour expiration.
  const hash = crypto.createHmac('sha256', JWT_SECRET).update(`${zoneId}-${Date.now()}`).digest('hex');
  return `${zoneId}:${hash}`;
};

exports.verifySessionToken = (token, expectedZoneId) => {
  if (!token) return false;
  const [zoneId, hash] = token.split(':');
  
  if (zoneId !== expectedZoneId) return false;
  
  // In production, verify the hash matches and isn't expired.
  // For demo, we just ensure it exists and matches the zone.
  return !!hash;
};
