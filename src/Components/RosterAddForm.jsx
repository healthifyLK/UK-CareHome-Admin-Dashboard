import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import locationsService from '../services/locationService';
import caregiversService from '../services/caregiversService';
import roomBedsService from '../services/roomBedsService';
import rostersService from '../services/rostersService';

const toISODate = (d) => {
  if (!d || typeof d !== 'string') return undefined;
  const iso = `${d}T00:00:00Z`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? undefined : dt.toISOString();
};
const toHHMMSS = (t) => {
  if (!t || typeof t !== 'string') return undefined;
  const parts = t.split(':');
  if (parts.length < 2) return undefined;
  const [h, m] = parts;
  if (h.length === 0 || m.length === 0) return undefined;
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:00`;
};
const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

// Enums (mirror backend)
const ShiftType = ['MORNING', 'AFTERNOON', 'NIGHT', 'FULL_DAY'];
const RosterStatus = ['DRAFT', 'PUBLISHED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
const ShiftStatus = ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

// Optional default times per shift type (tweak to your policy)
const defaultTimes = {
  MORNING: { start: '06:00', end: '14:00' },
  AFTERNOON: { start: '14:00', end: '22:00' },
  NIGHT: { start: '22:00', end: '06:00' },
  FULL_DAY: { start: '08:00', end: '20:00' },
};

function RosterAddForm() {
  const [form, setForm] = useState({
    locationId: '',
    caregiverId: '',
    roomBedId: '',
    shiftDate: '',
    shiftType: '',
    startTime: '',
    endTime: '',
    status: 'PUBLISHED', // sensible default
    shiftStatus: 'SCHEDULED',  // sensible default
    notes: '',
  });

  const [locations, setLocations] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load locations on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await locationsService.getAllLocations(false);
        setLocations(res || []);
      } catch {
        toast.error('Failed to load care homes');
      }
    })();
  }, []);

  // Load caregivers and available beds when location changes
  useEffect(() => {
    if (!form.locationId) {
      setCaregivers([]); setAvailableBeds([]);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const [cg, beds] = await Promise.all([
          caregiversService.getAllCaregivers(form.locationId),
          roomBedsService.getAvailableByLocation(form.locationId),
        ]);
        setCaregivers(cg || []);
        setAvailableBeds(beds || []);
      } catch {
        toast.error('Failed to load caregivers/available beds for selected care home');
      } finally {
        setLoading(false);
      }
    })();
  }, [form.locationId]);

  // Auto-fill default times when shift type changes (optional UX)
  useEffect(() => {
    const st = form.shiftType;
    if (!st || !defaultTimes[st]) return;
    const { start, end } = defaultTimes[st];
    // Only set if empty to not override user input
    setForm((p) => ({
      ...p,
      startTime: p.startTime || start,
      endTime: p.endTime || end,
    }));
  }, [form.shiftType]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = (f) => {
    const errs = {};
    if (!isFilled(f.locationId)) errs.locationId = 'Care Home is required';
    if (!isFilled(f.caregiverId)) errs.caregiverId = 'Caregiver is required';
    if (!isFilled(f.roomBedId)) errs.roomBedId = 'Room/Bed is required';
    if (!isFilled(f.shiftDate) || !toISODate(f.shiftDate)) errs.shiftDate = 'Valid shift date is required';
    if (!isFilled(f.shiftType) || !ShiftType.includes(f.shiftType)) errs.shiftType = 'Valid shift type is required';
    if (!isFilled(f.status) || !RosterStatus.includes(f.status)) errs.status = 'Valid roster status is required';
    if (!isFilled(f.shiftStatus) || !ShiftStatus.includes(f.shiftStatus)) errs.shiftStatus = 'Valid shift status is required';

    // For FULL_DAY we will include default times; for others require user-provided times
    if (f.shiftType !== 'FULL_DAY') {
      if (!isFilled(f.startTime) || !toHHMMSS(f.startTime)) errs.startTime = 'Start time is required';
      if (!isFilled(f.endTime) || !toHHMMSS(f.endTime)) errs.endTime = 'End time is required';
    }
    return errs;
  };

  const buildPayload = (f) => {
    const payload = {
      locationId: f.locationId,
      caregiverId: f.caregiverId,
      roomBedId: f.roomBedId,
      shiftDate: toISODate(f.shiftDate),
      shiftType: f.shiftType,           // MORNING | AFTERNOON | NIGHT | FULL_DAY
      status: f.status,     // optional if backend accepts on create
      shiftStatus: f.shiftStatus,       // optional if backend accepts on create
      notes: isFilled(f.notes) ? f.notes : undefined,
    };

    if (f.shiftType === 'FULL_DAY') {
      payload.startTime = toHHMMSS(defaultTimes.FULL_DAY.start);
      payload.endTime = toHHMMSS(defaultTimes.FULL_DAY.end);
    } else {
      payload.startTime = toHHMMSS(f.startTime);
      payload.endTime = toHHMMSS(f.endTime);
    }
    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      Object.values(errs).forEach((m) => toast.error(m));
      return;
    }
    try {
      setLoading(true);
      const payload = buildPayload(form);
      await rostersService.createRoster(payload);
      toast.success('Roster created');
    } catch (err) {
      const status = err?.status || err?.response?.status;
      toast.error(status ? `Failed (HTTP ${status})` : (err?.message || 'Failed to create roster'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={onSubmit} className="p-6 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold text-blue-600">Add Roster</h2>

        <label className="flex flex-col text-gray-700">
          Care Home
          <select name="locationId" value={form.locationId} onChange={onChange} className="mt-1 border rounded px-3 py-2" required>
            <option value="">Select a care home</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-700">
            Caregiver
            <select
              name="caregiverId"
              value={form.caregiverId}
              onChange={onChange}
              className="mt-1 border rounded px-3 py-2"
              required
              disabled={!form.locationId || loading}
            >
              <option value="">{loading ? 'Loading...' : 'Select caregiver'}</option>
              {caregivers.map((cg) => (
                <option key={cg.id} value={cg.id}>{cg.firstName} {cg.lastName}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-gray-700">
            Room/Bed
            <select
              name="roomBedId"
              value={form.roomBedId}
              onChange={onChange}
              className="mt-1 border rounded px-3 py-2"
              required
              disabled={!form.locationId || loading}
            >
              <option value="">{loading ? 'Loading...' : 'Select room/bed'}</option>
              {availableBeds.map((b) => (
                <option key={b.id} value={b.id}>{b.roomNumber}-{b.bedNumber}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-gray-700">
            Shift Date
            <input type="date" name="shiftDate" value={form.shiftDate} onChange={onChange} className="mt-1 border rounded px-3 py-2" required />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-700">
            Shift Type
            <select name="shiftType" value={form.shiftType} onChange={onChange} className="mt-1 border rounded px-3 py-2" required>
              <option value="">Select type</option>
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
              <option value="NIGHT">Night</option>
              <option value="FULL_DAY">Full Day</option>
            </select>
          </label>

          {form.shiftType !== 'FULL_DAY' && (
            <>
              <label className="flex flex-col text-gray-700">
                Start Time
                <input type="time" name="startTime" value={form.startTime} onChange={onChange} className="mt-1 border rounded px-3 py-2" required />
              </label>
              <label className="flex flex-col text-gray-700">
                End Time
                <input type="time" name="endTime" value={form.endTime} onChange={onChange} className="mt-1 border rounded px-3 py-2" required />
              </label>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-700">
            Roster Status
            <select name="status" value={form.status} onChange={onChange} className="mt-1 border rounded px-3 py-2" required>
              {RosterStatus.map(rs => <option key={rs} value={rs}>{rs}</option>)}
            </select>
          </label>

          <label className="flex flex-col text-gray-700">
            Shift Status
            <select name="shiftStatus" value={form.shiftStatus} onChange={onChange} className="mt-1 border rounded px-3 py-2" required>
              {ShiftStatus.map(ss => <option key={ss} value={ss}>{ss}</option>)}
            </select>
          </label>
        </div>

        <label className="flex flex-col text-gray-700">
          Notes (optional)
          <textarea name="notes" value={form.notes} onChange={onChange} className="mt-1 border rounded px-3 py-2" />
        </label>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </>
  );
}

export default RosterAddForm;