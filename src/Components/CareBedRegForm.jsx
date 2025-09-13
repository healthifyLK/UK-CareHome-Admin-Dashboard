import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import locationsService from '../services/locationService';
import roomBedsService from '../services/roomBedsService';

const initialFormState = {
  locationId: '',
  roomNumber: '',
  bedLetter: '',
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
  
  // New state for rooms
  const [existingRooms, setExistingRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');

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

  // Load existing rooms when location changes
  useEffect(() => {
    const loadExistingRooms = async () => {
      if (!formData.locationId) {
        setExistingRooms([]);
        return;
      }

      try {
        setRoomsLoading(true);
        setRoomsError('');
        const res = await roomBedsService.getByLocation(formData.locationId);
        
        // Get unique room numbers
        const rooms = [...new Set(res?.map(rb => rb.roomNumber) || [])]
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        
        setExistingRooms(rooms);
        
        // Reset form when location changes
        setFormData(prev => ({ ...prev, roomNumber: '', bedLetter: '' }));
        setNewRoomNumber('');
      } catch {
        setRoomsError('Failed to load existing rooms');
      } finally {
        setRoomsLoading(false);
      }
    };

    loadExistingRooms();
  }, [formData.locationId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoomSelection = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setFormData(prev => ({ ...prev, roomNumber: '' }));
      setNewRoomNumber('');
    } else {
      setFormData(prev => ({ ...prev, roomNumber: value }));
      setNewRoomNumber('');
    }
  };

  const handleNewRoomChange = (e) => {
    setNewRoomNumber(e.target.value);
    setFormData(prev => ({ ...prev, roomNumber: e.target.value }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.locationId) errors.locationId = 'Care Home is required';
    if (!data.roomNumber.trim()) errors.roomNumber = 'Room Number is required';
    if (!data.bedLetter.trim()) errors.bedLetter = 'Bed Letter is required';
    if (data.bedLetter && !/^[A-Z]$/i.test(data.bedLetter)) {
      errors.bedLetter = 'Bed letter must be a single letter (A-Z)';
    }
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

    // Combine room number and bed letter to create bed number
    const bedNumber = `${d.roomNumber}${d.bedLetter.toUpperCase()}`;

    return {
      roomNumber: d.roomNumber.trim(),
      bedNumber: bedNumber,
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
      console.log('Creating room bed with payload:', payload);
      await roomBedsService.createRoomBed(payload);
      toast.success('Room/Bed registered successfully!', { position: 'top-right' });
      
      // Reset form
      setFormData(initialFormState);
      setNewRoomNumber('');
    } catch (err) {
      console.error('Error creating room bed:', err);
      const status = err?.status || err?.response?.status;
      toast.error(status ? `Failed (HTTP ${status})` : (err?.message || 'Failed to register'), { position: 'top-right' });
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setNewRoomNumber('');
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

        {/* Room Selection */}
        {formData.locationId && (
          <div className="space-y-4">
            <label className="flex flex-col text-gray-600">
              Room Selection
              {roomsLoading ? (
                <div className="mt-1 text-sm text-gray-500">Loading existing rooms…</div>
              ) : roomsError ? (
                <div className="mt-1 text-sm text-red-600">{roomsError}</div>
              ) : (
                <div className="space-y-2">
                  <select
                    name="roomSelection"
                    onChange={handleRoomSelection}
                    className="w-full border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select room option</option>
                    {existingRooms.map(room => (
                      <option key={room} value={room}>Room {room}</option>
                    ))}
                    <option value="new">Create New Room</option>
                  </select>
                  
                  {/* Show input for new room if "Create New Room" is selected */}
                  {formData.roomNumber === '' && (
                    <input
                      type="text"
                      placeholder="Enter new room number"
                      value={newRoomNumber}
                      onChange={handleNewRoomChange}
                      className="w-full border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  )}
                </div>
              )}
              {errors.roomNumber && <span className="text-red-600 text-sm">{errors.roomNumber}</span>}
            </label>

            {/* Show selected room info */}
            {formData.roomNumber && (
              <div className="p-3 bg-blue-50 rounded border">
                <p className="text-sm text-blue-800">
                  <strong>Selected Room:</strong> {formData.roomNumber}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bed Letter Input */}
        {formData.roomNumber && (
          <label className="flex flex-col text-gray-600">
            Bed Letter
            <input 
              type="text" 
              name="bedLetter" 
              value={formData.bedLetter} 
              onChange={handleChange} 
              placeholder="Enter bed letter (A-Z)"
              maxLength="1"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" 
              required 
            />
            <p className="text-xs text-gray-500 mt-1">
              Bed number will be: {formData.roomNumber}{formData.bedLetter ? formData.bedLetter.toUpperCase() : 'X'}
            </p>
            {errors.bedLetter && <span className="text-red-600 text-sm">{errors.bedLetter}</span>}
          </label>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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