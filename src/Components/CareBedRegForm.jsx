import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import locationsService from '../services/locationService';
import roomBedsService from '../services/roomBedsService';

const initialFormState = {
  locationId: '',
  roomNumber: '',
  bedNumber: '',
  floor: '',
  wing: '',
  isOccupied: false,
  brand: '',
  model: '',
  condition: '',
};

function CareBedRegForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocLoading(true);
        const res = await locationsService.getAllLocations(false);
        setLocations(res || []);
      } catch {
        setLocError('Failed to load care homes');
      } finally {
        setLocLoading(false);
      }
    };
    loadLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.locationId) errors.locationId = 'Care Home is required';
    if (!data.roomNumber.trim()) errors.roomNumber = 'Room Number is required';
    if (!data.bedNumber.trim()) errors.bedNumber = 'Bed Number is required';
    if (data.condition && !['new', 'used'].includes(String(data.condition).toLowerCase())) {
      errors.condition = 'Condition must be either "new" or "used"';
    }
    return errors;
  };

  const buildPayload = (d) => {
    const features = {};
    if (d.brand) features.brand = d.brand;
    if (d.model) features.model = d.model;
    if (d.condition) features.condition = d.condition;

    return {
      roomNumber: d.roomNumber.trim(),
      bedNumber: d.bedNumber.trim(),
      locationId: d.locationId,
      floor: d.floor || undefined,
      wing: d.wing || undefined,
      isOccupied: !!d.isOccupied,
      features: Object.keys(features).length ? features : undefined,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(msg =>
        toast.error(msg, { position: 'top-right' })
      );
      return;
    }

    try {
      const payload = buildPayload(formData);
      await roomBedsService.createRoomBed(payload);
      toast.success('Room/Bed registered successfully!', { position: 'top-right' });
    } catch (err) {
      const status = err?.status || err?.response?.status;
      toast.error(status ? `Failed (HTTP ${status})` : (err?.message || 'Failed to register'), { position: 'top-right' });
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    window.history.back();
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6 rounded shadow bg-white">
        <h2 className="text-2xl font-semibold text-blue-600">Care Bed Registration</h2>

        <label className="flex flex-col text-gray-600">
          Care Home
          {locLoading ? (
            <div className="mt-1 text-sm text-gray-500">Loading care homes…</div>
          ) : locError ? (
            <div className="mt-1 text-sm text-red-600">{locError}</div>
          ) : (
            <select
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select a care home</option>
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          )}
          {errors.locationId && <span className="text-red-600 text-sm">{errors.locationId}</span>}
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-600">
            Room Number
            <input type="text" name="roomNumber" value={formData.roomNumber} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2" required />
            {errors.roomNumber && <span className="text-red-600 text-sm">{errors.roomNumber}</span>}
          </label>

          <label className="flex flex-col text-gray-600">
            Bed Number
            <input type="text" name="bedNumber" value={formData.bedNumber} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2" required />
            {errors.bedNumber && <span className="text-red-600 text-sm">{errors.bedNumber}</span>}
          </label>

          <label className="flex flex-col text-gray-600">
            Floor (optional)
            <input type="text" name="floor" value={formData.floor} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-gray-600">
            Wing (optional)
            <input type="text" name="wing" value={formData.wing} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2" />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input id="isOccupied" type="checkbox" name="isOccupied" checked={formData.isOccupied} onChange={handleChange} className="h-5 w-5" />
          <label htmlFor="isOccupied" className="text-gray-700">Occupied</label>
        </div>

        <h3 className="text-lg font-semibold text-gray-700">Additional Info (stored as features)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-600">
            Brand (optional)
            <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-gray-600">
            Model (optional)
            <input type="text" name="model" value={formData.model} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2" />
          </label>

          <label className="flex flex-col text-gray-600">
            Condition (optional)
            <select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 border border-gray-600 rounded px-3 py-2">
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            {errors.condition && <span className="text-red-600 text-sm">{errors.condition}</span>}
          </label>
        </div>

        <div className="flex space-x-4 pt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Submit</button>
          <button type="button" onClick={handleCancel} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">Cancel</button>
        </div>
      </form>
    </>
  );
}

export default CareBedRegForm;