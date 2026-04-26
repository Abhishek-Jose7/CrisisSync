/**
 * Format a Date to relative time string (e.g., "2m ago", "just now")
 */
export function formatRelativeTime(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diff = Math.floor((now - d.getTime()) / 1000);

  if (diff < 5) return 'now';
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

/**
 * Format elapsed time since incident start as MM:SS
 */
export function formatElapsed(startDate) {
  if (!startDate) return '00:00';
  const d = startDate instanceof Date ? startDate : new Date(startDate);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format timestamp as HH:MM:SS
 */
export function formatTime(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Get status color for a zone status label
 */
export function getStatusColor(statusLabel) {
  const map = {
    notified: '#EF9F27',
    acknowledged: '#378ADD',
    active: '#378ADD',
    zone_clear: '#1D9E75',
    person_needs_help: '#E24B4A',
    request_backup: '#E24B4A',
    no_warden: '#888780',
  };
  return map[statusLabel] || '#888780';
}

/**
 * Get CSS class modifier for a zone status
 */
export function getStatusModifier(statusLabel) {
  if (statusLabel === 'person_needs_help' || statusLabel === 'request_backup') return 'danger';
  if (statusLabel === 'notified') return 'warning';
  if (statusLabel === 'zone_clear') return 'clear';
  if (statusLabel === 'acknowledged' || statusLabel === 'active') return 'info';
  return '';
}

/**
 * Format a status label for display
 */
export function formatStatusLabel(statusLabel) {
  const map = {
    notified: 'Notified',
    acknowledged: 'Acknowledged',
    active: 'Active',
    zone_clear: 'Zone Clear',
    person_needs_help: 'Person Needs Help',
    request_backup: 'Backup Requested',
    no_warden: 'No Warden',
  };
  return map[statusLabel] || statusLabel || 'Unknown';
}

/**
 * Count SOS alerts for a specific zone
 */
export function countSOSForZone(alertFeed, zoneId) {
  return alertFeed.filter(a => a.zoneId === zoneId).length;
}
