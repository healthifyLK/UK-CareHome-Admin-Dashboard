// Create src/Components/BedAssignmentModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import roomBedsService from '../services/roomBedsService';

const BedAssignmentModal = ({ 
  isOpen, 
  onClose, 
  careReceiver, 
  onAssignmentSuccess 
}) => {
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState('');
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen && careReceiver?.locationId) {
      loadAvailableBeds();
    }
  }, [isOpen, careReceiver?.locationId]);

  const loadAvailableBeds = async () => {
    try {
      setLoading(true);
      const beds = await roomBedsService.getAvailableByLocation(careReceiver.locationId);
      setAvailableBeds(beds || []);
    } catch (error) {
      console.error('Error loading available beds:', error);
      toast.error('Failed to load available beds');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedBed) {
      toast.error('Please select a bed');
      return;
    }

    try {
      setAssigning(true);
      const result = await roomBedsService.assignCareReceiverToBed(careReceiver.id, selectedBed);
      toast.success(result.message || 'Care receiver assigned to bed successfully!');
      onAssignmentSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning bed:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to assign bed';
      toast.error(errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold mb-4">
          Assign Bed to {careReceiver?.firstName} {careReceiver?.lastName}
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Available Bed
          </label>
          {loading ? (
            <div className="text-sm text-gray-500">Loading available beds...</div>
          ) : availableBeds.length > 0 ? (
            <select
              value={selectedBed}
              onChange={(e) => setSelectedBed(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a bed</option>
              {availableBeds.map((bed) => (
                <option key={bed.id} value={bed.id}>
                  Room {bed.roomNumber} - Bed {bed.bedNumber}
                  {bed.floor && ` (Floor ${bed.floor})`}
                  {bed.wing && ` (Wing ${bed.wing})`}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-sm text-red-600">
              No available beds in this care home
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            disabled={assigning}
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedBed || assigning || availableBeds.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? 'Assigning...' : 'Assign Bed'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BedAssignmentModal;