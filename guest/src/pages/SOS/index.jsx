import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestDemo } from '../../context/DemoContext';
import { ArrowLeft, AlertTriangle, Flame, Heart, Shield, Droplets, Zap, MoreHorizontal, Users, Clock, Check } from 'lucide-react';
import { 
  generateAriaLabel, 
  handleKeyDown, 
  announceToScreenReader, 
  triggerHaptic,
  trapFocus 
} from '../../../shared/accessibility';

const crisisTypes = [
  { id: 'fire', icon: Flame, label: 'Fire', color: '#dc4242', description: 'Fire, smoke, or burning smell' },
  { id: 'medical', icon: Heart, label: 'Medical', color: '#22a86b', description: 'Injury, illness, or medical emergency' },
  { id: 'security', icon: Shield, label: 'Security', color: '#3d8de9', description: 'Threat, violence, or suspicious activity' },
  { id: 'flooding', icon: Droplets, label: 'Flooding', color: '#5a9fef', description: 'Water damage or flooding' },
  { id: 'power', icon: Zap, label: 'Power Outage', color: '#e8a32e', description: 'Electrical failure or blackout' },
  { id: 'other', icon: MoreHorizontal, label: 'Other', color: '#8b99a8', description: 'Different type of emergency' },
];

const dangerLevels = [
  { id: 'immediate', icon: AlertTriangle, label: 'Immediate Danger', description: 'I need help right now', color: '#dc4242' },
  { id: 'reporting', icon: Clock, label: 'Reporting Issue', description: 'I am reporting this for others', color: '#e8a32e' },
];

const affectedCounts = [
  { id: '1', label: 'Just me', count: 1 },
  { id: 'few', label: 'A few people', count: 3 },
  { id: 'many', label: 'Many people', count: 10 },
];

export function SOS({ basePath = '' }) {
  const [step, setStep] = useState(1);
  const [selectedCrisis, setSelectedCrisis] = useState(null);
  const [dangerLevel, setDangerLevel] = useState(null);
  const [affectedCount, setAffectedCount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { state, actions } = useGuestDemo();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // Announce step changes to screen readers
    const stepDescriptions = {
      1: 'Step 1: Select emergency type',
      2: 'Step 2: Select danger level',
      3: 'Step 3: Select number of people affected',
      4: 'Step 4: Confirm emergency details'
    };
    
    announceToScreenReader(stepDescriptions[step]);
    
    // Setup focus trap for modal-like behavior
    if (containerRef.current) {
      return trapFocus(containerRef.current);
    }
  }, [step]);

  useEffect(() => {
    // Trigger haptic feedback on step changes
    triggerHaptic('light');
  }, [step]);

  function handleCrisisSelect(crisis) {
    setSelectedCrisis(crisis);
    setStep(2);
    announceToScreenReader(`Selected ${crisis.label} emergency`);
    triggerHaptic('medium');
  }

  function handleDangerSelect(level) {
    setDangerLevel(level);
    setStep(3);
    announceToScreenReader(`Selected ${level.label}`);
    triggerHaptic('medium');
  }

  function handleCountSelect(count) {
    setAffectedCount(count);
    setStep(4);
    announceToScreenReader(`Selected ${count.label}`);
    triggerHaptic('medium');
  }

  async function handleConfirmSend() {
    setIsSubmitting(true);
    
    // Strong haptic feedback for SOS
    triggerHaptic('sos');
    
    announceToScreenReader('Sending emergency alert', 'assertive');

    // Send the detailed SOS
    await actions.sendDetailedSOS({
      crisisType: selectedCrisis.id,
      urgency: dangerLevel.id === 'immediate' ? 'high' : 'medium',
      affectedCount: affectedCount.count,
      zoneId: state.zoneId,
      guestSessionId: state.sessionId,
      timestamp: new Date(),
    });

    announceToScreenReader('Emergency alert sent successfully', 'assertive');

    // Navigate to evacuation mode
    const demoToken = basePath === '/demo' ? `/${state.qrToken}` : '';
    navigate(`${basePath}${demoToken}/evacuate`);
  }

  function goBack() {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  }

  return (
    <div className="sos-container" ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="sos-title">
      {/* Skip to main content */}
      <a href="#sos-main-content" className="skip-link">Skip to main content</a>
      
      {/* Header */}
      <header className="sos-header">
        <button 
          className="sos-back-btn" 
          onClick={goBack} 
          aria-label="Go back to previous screen"
          onKeyDown={(e) => handleKeyDown(e, goBack)}
        >
          <ArrowLeft size={24} />
          <span className="sr-only">Go back</span>
        </button>
        <h1 id="sos-title" className="sos-title">Emergency Report</h1>
        <nav className="sos-progress" role="navigation" aria-label="Progress steps">
          <div className={`sos-progress-step ${step >= 1 ? 'active' : ''}`} aria-label="Step 1: Emergency type"></div>
          <div className={`sos-progress-step ${step >= 2 ? 'active' : ''}`} aria-label="Step 2: Danger level"></div>
          <div className={`sos-progress-step ${step >= 3 ? 'active' : ''}`} aria-label="Step 3: People affected"></div>
          <div className={`sos-progress-step ${step >= 4 ? 'active' : ''}`} aria-label="Step 4: Confirmation"></div>
        </nav>
      </header>

      {/* Step 1: Crisis Type Selection */}
      {step === 1 && (
        <div className="sos-step">
          <div className="sos-step-header">
            <h2>What type of emergency is happening?</h2>
            <p className="text-muted">Select the best description for your situation</p>
          </div>
          
          <div className="crisis-grid">
            {crisisTypes.map((crisis) => {
              const Icon = crisis.icon;
              return (
                <button
                  key={crisis.id}
                  className="crisis-card"
                  onClick={() => handleCrisisSelect(crisis)}
                  style={{ '--crisis-color': crisis.color }}
                  aria-label={`Select ${crisis.label} emergency`}
                >
                  <div className="crisis-icon">
                    <Icon size={32} />
                  </div>
                  <h3>{crisis.label}</h3>
                  <p>{crisis.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Danger Level */}
      {step === 2 && (
        <div className="sos-step">
          <div className="sos-step-header">
            <h2>Are you in immediate danger?</h2>
            <p className="text-muted">This helps us prioritize your emergency</p>
          </div>
          
          <div className="danger-options">
            {dangerLevels.map((level) => {
              const Icon = level.icon;
              return (
                <button
                  key={level.id}
                  className="danger-card"
                  onClick={() => handleDangerSelect(level)}
                  style={{ '--danger-color': level.color }}
                  aria-label={`Select ${level.label}`}
                >
                  <div className="danger-icon">
                    <Icon size={28} />
                  </div>
                  <h3>{level.label}</h3>
                  <p>{level.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Affected Count */}
      {step === 3 && (
        <div className="sos-step">
          <div className="sos-step-header">
            <h2>How many people are affected?</h2>
            <p className="text-muted">Include yourself in the count</p>
          </div>
          
          <div className="count-options">
            {affectedCounts.map((count) => (
              <button
                key={count.id}
                className="count-card"
                onClick={() => handleCountSelect(count)}
                aria-label={`Select ${count.label}`}
              >
                <div className="count-icon">
                  <Users size={32} />
                </div>
                <h3>{count.label}</h3>
                <p className="text-muted">{count.count} {count.count === 1 ? 'person' : 'people'}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="sos-step">
          <div className="sos-step-header">
            <h2>Confirm Emergency Details</h2>
            <p className="text-muted">Please review before sending alert</p>
          </div>
          
          <div className="confirmation-card">
            <div className="confirmation-item">
              <div className="confirmation-icon" style={{ background: selectedCrisis.color }}>
                {selectedCrisis.icon && <selectedCrisis.icon size={24} />}
              </div>
              <div>
                <h4>Emergency Type</h4>
                <p>{selectedCrisis.label}</p>
              </div>
            </div>
            
            <div className="confirmation-item">
              <div className="confirmation-icon" style={{ background: dangerLevel.color }}>
                <dangerLevel.icon size={24} />
              </div>
              <div>
                <h4>Danger Level</h4>
                <p>{dangerLevel.label}</p>
              </div>
            </div>
            
            <div className="confirmation-item">
              <div className="confirmation-icon" style={{ background: '#3d8de9' }}>
                <Users size={24} />
              </div>
              <div>
                <h4>People Affected</h4>
                <p>{affectedCount.label}</p>
              </div>
            </div>
            
            <div className="confirmation-item">
              <div className="confirmation-icon" style={{ background: '#8b99a8' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4>Location</h4>
                <p>{state.zoneName || 'Current zone'}</p>
              </div>
            </div>
          </div>
          
          <div className="sos-actions">
            <button className="btn btn-outline" onClick={goBack} disabled={isSubmitting}>
              <ArrowLeft size={16} />
              Back
            </button>
            <button 
              className="btn btn-danger" 
              onClick={handleConfirmSend}
              disabled={isSubmitting}
              style={{ fontSize: '1.125rem', fontWeight: 700 }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Sending Alert...
                </>
              ) : (
                <>
                  <AlertTriangle size={20} />
                  Send Emergency Alert
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
