import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, ChevronRight, MapPin, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useStaffDemo } from '../../context/DemoContext';

export function StaffOnboarding({ basePath = '' }) {
  const { state, actions } = useStaffDemo();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: state.staffUser?.name || '',
    role: state.staffUser?.role || 'warden',
    assignedZoneId: state.staffUser?.assignedZoneId || 'zone-floor7',
    currentShift: state.staffUser?.currentShift || 'evening',
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function finishOnboarding(event) {
    event.preventDefault();
    actions.completeOnboarding(form);
    navigate(`${basePath}/`, { replace: true });
  }

  return (
    <div className="main-content staff-onboarding">
      <div className="onboarding-card">
        <div className="onboarding-card__icon">
          <UserRoundCheck size={30} />
        </div>
        <h1>Staff onboarding</h1>
        <p>
          Confirm your response role before entering the warden dashboard. This keeps incident tasks tied to the correct zone and shift.
        </p>

        <form onSubmit={finishOnboarding} className="onboarding-form">
          <label>
            Full name
            <input
              className="form-input"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Response role
            <select className="form-input" value={form.role} onChange={(event) => updateField('role', event.target.value)}>
              <option value="warden">Zone Warden</option>
              <option value="seniorWarden">Senior Warden</option>
              <option value="dutyManager">Duty Manager</option>
            </select>
          </label>

          <label>
            Assigned zone
            <select className="form-input" value={form.assignedZoneId} onChange={(event) => updateField('assignedZoneId', event.target.value)}>
              {state.zones.map((zone) => (
                <option key={zone.zoneId} value={zone.zoneId}>{zone.name}</option>
              ))}
            </select>
          </label>

          <label>
            Current shift
            <select className="form-input" value={form.currentShift} onChange={(event) => updateField('currentShift', event.target.value)}>
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </label>

          <div className="staff-checklist">
            <div><ShieldCheck size={18} /> I can receive incident assignments for this zone.</div>
            <div><MapPin size={18} /> I know the exit route and assembly point for my area.</div>
            <div><BadgeCheck size={18} /> I will update zone status during active incidents.</div>
          </div>

          <button className="btn btn--primary btn--block" type="submit">
            Enter Staff PWA <ChevronRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
