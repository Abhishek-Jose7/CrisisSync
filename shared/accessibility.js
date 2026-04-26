// Accessibility Utilities for CrisisSync

// ARIA label generators
export const generateAriaLabel = (component, action, context = '') => {
  const labels = {
    button: `${action} ${component}${context ? ` in ${context}` : ''}`,
    link: `Navigate to ${component}${context ? ` in ${context}` : ''}`,
    input: `Enter ${component}${context ? ` for ${context}` : ''}`,
    select: `Select ${component}${context ? ` for ${context}` : ''}`,
    alert: `${component}${context ? ` regarding ${context}` : ''}`,
    status: `Status: ${component}${context ? ` for ${context}` : ''}`,
  };
  
  return labels[component] || `${component}${context ? ` - ${context}` : ''}`;
};

// Keyboard navigation helpers
export const handleKeyDown = (event, callback, key = 'Enter') => {
  if (event.key === key || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

export const handleArrowKeys = (event, items, currentIndex, setCurrentIndex) => {
  let newIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    case 'Escape':
      event.preventDefault();
      setCurrentIndex(-1);
      return;
    default:
      return;
  }
  
  setCurrentIndex(newIndex);
  items[newIndex]?.focus();
};

// Focus management
export const trapFocus = (container) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);
  return () => container.removeEventListener('keydown', handleTabKey);
};

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// High contrast mode detection
export const detectHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Reduced motion detection
export const detectReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Color blind friendly severity indicators
export const getSeverityIndicator = (severity, type = 'color') => {
  const indicators = {
    low: {
      color: '#22a86b',
      pattern: 'stripes',
      icon: '○',
      label: 'Low Severity',
      ariaLabel: 'Low severity - minimal impact'
    },
    medium: {
      color: '#e8a32e',
      pattern: 'dots',
      icon: '◐',
      label: 'Medium Severity',
      ariaLabel: 'Medium severity - moderate impact'
    },
    high: {
      color: '#dc4242',
      pattern: 'solid',
      icon: '●',
      label: 'High Severity',
      ariaLabel: 'High severity - significant impact'
    },
    critical: {
      color: '#8b0000',
      pattern: 'crosshatch',
      icon: '⚠',
      label: 'Critical Severity',
      ariaLabel: 'Critical severity - immediate danger'
    }
  };

  const indicator = indicators[severity] || indicators.medium;
  
  if (type === 'pattern') {
    return indicator.pattern;
  } else if (type === 'icon') {
    return indicator.icon;
  } else if (type === 'label') {
    return indicator.label;
  } else if (type === 'ariaLabel') {
    return indicator.ariaLabel;
  }
  
  return indicator.color;
};

// Font size management
export const FontSizeManager = {
  sizes: ['small', 'medium', 'large', 'extra-large'],
  currentSize: 'medium',
  
  set(size) {
    if (this.sizes.includes(size)) {
      this.currentSize = size;
      document.documentElement.setAttribute('data-font-size', size);
      localStorage.setItem('crisis-sync-font-size', size);
      this.announceChange(size);
    }
  },
  
  increase() {
    const currentIndex = this.sizes.indexOf(this.currentSize);
    const nextIndex = Math.min(currentIndex + 1, this.sizes.length - 1);
    this.set(this.sizes[nextIndex]);
  },
  
  decrease() {
    const currentIndex = this.sizes.indexOf(this.currentSize);
    const prevIndex = Math.max(currentIndex - 1, 0);
    this.set(this.sizes[prevIndex]);
  },
  
  reset() {
    this.set('medium');
  },
  
  load() {
    const saved = localStorage.getItem('crisis-sync-font-size');
    if (saved && this.sizes.includes(saved)) {
      this.currentSize = saved;
      document.documentElement.setAttribute('data-font-size', saved);
    }
  },
  
  announceChange(size) {
    const messages = {
      small: 'Font size set to small',
      medium: 'Font size set to medium',
      large: 'Font size set to large',
      'extra-large': 'Font size set to extra large'
    };
    announceToScreenReader(messages[size]);
  }
};

// Haptic feedback (where supported)
export const triggerHaptic = (type = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [50],
      heavy: [100],
      success: [50, 50, 50],
      warning: [100, 50, 100],
      error: [200, 100, 200],
      sos: [500, 100, 500, 100, 500]
    };
    
    navigator.vibrate(patterns[type] || patterns.light);
  }
};

// Offline detection
export const setupOfflineDetection = (callback) => {
  const updateStatus = () => {
    const isOnline = navigator.onLine;
    callback(isOnline);
    
    if (!isOnline) {
      announceToScreenReader('You are now offline. Some features may be limited.');
    } else {
      announceToScreenReader('You are back online.');
    }
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  
  // Initial status
  updateStatus();
  
  return () => {
    window.removeEventListener('online', updateStatus);
    window.removeEventListener('offline', updateStatus);
  };
};

// Gesture detection for mobile
export const setupGestures = (element, callbacks) => {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
  };
  
  const handleTouchEnd = (e) => {
    if (!e.changedTouches.length) return;
    
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const endTime = Date.now();
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    
    const minDistance = 50;
    const maxTime = 300;
    
    if (Math.abs(deltaX) > minDistance && deltaTime < maxTime) {
      if (deltaX > 0 && callbacks.onSwipeRight) {
        callbacks.onSwipeRight();
      } else if (deltaX < 0 && callbacks.onSwipeLeft) {
        callbacks.onSwipeLeft();
      }
    }
    
    if (Math.abs(deltaY) > minDistance && deltaTime < maxTime) {
      if (deltaY > 0 && callbacks.onSwipeDown) {
        callbacks.onSwipeDown();
      } else if (deltaY < 0 && callbacks.onSwipeUp) {
        callbacks.onSwipeUp();
      }
    }
  };
  
  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  return () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchend', handleTouchEnd);
  };
};

// Initialize accessibility features
export const initAccessibility = () => {
  // Load font size preference
  FontSizeManager.load();
  
  // Detect reduced motion
  if (detectReducedMotion()) {
    document.documentElement.setAttribute('data-reduced-motion', 'true');
  }
  
  // Detect high contrast
  if (detectHighContrast()) {
    document.documentElement.setAttribute('data-high-contrast', 'true');
  }
  
  // Announce page load to screen readers
  setTimeout(() => {
    announceToScreenReader('CrisisSync application loaded');
  }, 1000);
};
