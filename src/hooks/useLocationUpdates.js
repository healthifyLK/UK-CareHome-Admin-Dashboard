import { useState, useEffect } from 'react';

// Global state for location updates
let locationUpdateListeners = new Set();
let lastLocationUpdate = null;

export const useLocationUpdates = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);

  useEffect(() => {
    const handleLocationUpdate = () => {
      console.log('Location update detected, triggering refresh');
      setUpdateTrigger(prev => prev + 1);
    };

    locationUpdateListeners.add(handleLocationUpdate);

    return () => {
      locationUpdateListeners.delete(handleLocationUpdate);
    };
  }, []);

  return updateTrigger;
};

export const notifyLocationUpdate = (locationId, updatedData) => {
  console.log('Notifying location update:', locationId, updatedData);
  lastLocationUpdate = { locationId, updatedData, timestamp: Date.now() };
  
  // Notify all listeners
  locationUpdateListeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('Error notifying location update listener:', error);
    }
  });
};

export const getLastLocationUpdate = () => lastLocationUpdate;