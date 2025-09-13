import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import locationsService from '../services/locationService';
import { notifyLocationUpdate } from '../hooks/useLocationUpdates';

const CareHomeUpdateOverlay = ({ careHomeData, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postcode: '',
    phoneNumber: '',
    email: '',
    numberOfRooms: '',
    bedsPerRoom: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (careHomeData) {
      setFormData({
        name: careHomeData.name || '',
        address: careHomeData.address || '',
        city: careHomeData.city || '',
        postcode: careHomeData.postcode || '',
        phoneNumber: careHomeData.phoneNumber || '',
        email: careHomeData.email || '',
        numberOfRooms: careHomeData.numberOfRooms?.toString() || '',
        bedsPerRoom: careHomeData.bedsPerRoom?.toString() || '',
        isActive: careHomeData.isActive !== undefined ? careHomeData.isActive : true,
      });
    }
  }, [careHomeData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!formData.address.trim()) {
      errors.push('Address is required');
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (formData.numberOfRooms && (isNaN(formData.numberOfRooms) || parseInt(formData.numberOfRooms) < 1)) {
      errors.push('Number of rooms must be a positive number');
    }
    
    if (formData.bedsPerRoom && (isNaN(formData.bedsPerRoom) || parseInt(formData.bedsPerRoom) < 1 || parseInt(formData.bedsPerRoom) > 26)) {
      errors.push('Beds per room must be between 1 and 26');
    }
    
    return errors;
  };

  const calculateCapacity = () => {
    const rooms = parseInt(formData.numberOfRooms) || 0;
    const bedsPerRoom = parseInt(formData.bedsPerRoom) || 0;
    return rooms > 0 && bedsPerRoom > 0 ? rooms * bedsPerRoom : 0;
  };

  const handleCancel = () => {
    if (careHomeData) {
      setFormData({
        name: careHomeData.name || '',
        address: careHomeData.address || '',
        city: careHomeData.city || '',
        postcode: careHomeData.postcode || '',
        phoneNumber: careHomeData.phoneNumber || '',
        email: careHomeData.email || '',
        numberOfRooms: careHomeData.numberOfRooms?.toString() || '',
        bedsPerRoom: careHomeData.bedsPerRoom?.toString() || '',
        isActive: careHomeData.isActive !== undefined ? careHomeData.isActive : true,
      });
    }
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { position: 'top-right' }));
      return;
    }

    try {
      setLoading(true);
      
      // Calculate capacity automatically
      const calculatedCapacity = calculateCapacity();
      
      // Prepare payload for backend
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim() || undefined,
        postcode: formData.postcode.trim() || undefined,
        phoneNumber: formData.phoneNumber.trim() || undefined,
        email: formData.email.trim() || undefined,
        numberOfRooms: formData.numberOfRooms ? parseInt(formData.numberOfRooms) : undefined,
        bedsPerRoom: formData.bedsPerRoom ? parseInt(formData.bedsPerRoom) : undefined,
        capacity: calculatedCapacity || undefined, // Always use calculated capacity
        isActive: formData.isActive,
      };

      // Remove undefined values
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      console.log('Updating location with payload:', payload);
      
      // Call backend API
      const updatedLocation = await locationsService.updateLocation(careHomeData.id, payload);
      
      console.log('Location updated successfully:', updatedLocation);
      
      toast.success('Care Home updated successfully!', { position: 'top-right' });
      
      // Notify all components about the location update
      notifyLocationUpdate(careHomeData.id, updatedLocation);
      
      // Call parent callback with updated data
      if (onUpdate) {
        onUpdate(updatedLocation);
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating location:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update care home';
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  const calculatedCapacity = calculateCapacity();

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-[#00000055] flex justify-center items-start pt-20 z-50 overflow-y-auto">
        <form
          className="bg-white rounded p-10 w-[90%] max-w-4xl h-[80vh] overflow-y-auto shadow-lg relative"
          onSubmit={handleSubmit}
        >
          <button
            type="button"
            className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close overlay"
          >
            &times;
          </button>

          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Edit Care Home</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              
              <label className="block text-gray-700">
                Name *
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <label className="block text-gray-700">
                Address *
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700">
                  City
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block text-gray-700">
                  Postcode
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700">
                  Phone Number
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block text-gray-700">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Capacity and Rooms */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Capacity & Rooms</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700">
                  Number of Rooms
                  <input
                    type="number"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number of rooms"
                  />
                </label>

                <label className="block text-gray-700">
                  Beds per Room
                  <input
                    type="number"
                    name="bedsPerRoom"
                    value={formData.bedsPerRoom}
                    onChange={handleChange}
                    min="1"
                    max="26"
                    className="mt-1 border border-gray-400 rounded w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter beds per room"
                  />
                </label>
              </div>

              {/* Read-only Capacity Display */}
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <label className="block text-gray-700 font-semibold mb-2">
                  Total Capacity (Auto-calculated)
                </label>
                <div className="text-2xl font-bold text-blue-600">
                  {calculatedCapacity > 0 ? `${calculatedCapacity} beds` : 'Enter rooms and beds per room'}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Capacity = Number of Rooms × Beds per Room
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-gray-700">Active Location</label>
              </div>

              {/* Enhanced Capacity Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Capacity Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-blue-700">
                    <p className="font-medium">Rooms:</p>
                    <p className="text-lg font-bold">{formData.numberOfRooms || 0}</p>
                  </div>
                  <div className="text-blue-700">
                    <p className="font-medium">Beds per Room:</p>
                    <p className="text-lg font-bold">{formData.bedsPerRoom || 0}</p>
                  </div>
                  <div className="col-span-2 text-blue-700 border-t pt-2">
                    <p className="font-medium">Total Capacity:</p>
                    <p className="text-xl font-bold text-blue-800">
                      {calculatedCapacity > 0 ? `${calculatedCapacity} beds` : '0 beds'}
                    </p>
                  </div>
                </div>
                
                {calculatedCapacity > 0 && (
                  <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm">
                    ✓ Capacity automatically calculated: {formData.numberOfRooms} rooms × {formData.bedsPerRoom} beds = {calculatedCapacity} total beds
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Care Home'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CareHomeUpdateOverlay;