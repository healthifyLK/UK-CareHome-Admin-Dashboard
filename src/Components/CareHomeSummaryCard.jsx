import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import locationsService from "../services/locationService";
import roomBedsService from "../services/roomBedsService";
import caregiversService from "../services/caregiversService";
import careReceiversService from "../services/careReceiversService";
import { useLocationUpdates } from "../hooks/useLocationUpdates";
import { Link } from "react-router-dom";

function CareHomeSummaryCard() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const updateTrigger = useLocationUpdates();

  const fetchLocations = async () => {
    try {
      console.log('CareHomeSummaryCard: Fetching locations...');
      setLoading(true);
      setError(null);
      
      const data = await locationsService.getAllLocations(true);
      console.log('CareHomeSummaryCard: Fetched locations:', data);
      
      const locationsWithStats = await Promise.all(
        (data || []).map(async (location) => {
          try {
            // Total Beds = Capacity from database
            const totalBeds = location.capacity || 0;
            
            // Fetch room beds to count occupied beds
            const roomBeds = await roomBedsService.getByLocation(location.id);
            const occupiedBeds = roomBeds.filter(rb => rb.isOccupied).length;
            
            // Available beds = Capacity - Occupied beds
            const availableBeds = Math.max(0, totalBeds - occupiedBeds);
            
            // Fetch caregivers for this location
            const caregivers = await caregiversService.getAllCaregivers();
            const caregiverCount = caregivers.filter(cg => cg.locationId === location.id).length;
            
            // Fetch care receivers for this location
            const careReceivers = await careReceiversService.getAllCareReceivers();
            const careReceiverCount = careReceivers.filter(cr => cr.locationId === location.id).length;
            
            const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
            
            return {
              ...location,
              stats: {
                totalBeds,
                occupiedBeds,
                availableBeds,
                caregiverCount,
                careReceiverCount,
                occupancyRate
              }
            };
          } catch (err) {
            console.error(`Error calculating stats for location ${location.id}:`, err);
            const totalBeds = location.capacity || 0;
            return {
              ...location,
              stats: {
                totalBeds,
                occupiedBeds: 0,
                availableBeds: totalBeds,
                caregiverCount: 0,
                careReceiverCount: 0,
                occupancyRate: 0
              }
            };
          }
        })
      );
      
      console.log('CareHomeSummaryCard: Locations with calculated stats:', locationsWithStats);
      setLocations(locationsWithStats);
    } catch (err) {
      console.error('CareHomeSummaryCard: Error fetching locations:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLocations();
  }, []);

  // Refresh when location updates are detected
  useEffect(() => {
    if (updateTrigger > 0) {
      console.log('CareHomeSummaryCard: Refreshing due to location update, trigger:', updateTrigger);
      fetchLocations();
    }
  }, [updateTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error fetching locations</p>
          <p className="text-sm">{error.message}</p>
          <button 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => fetchLocations()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">No Care Homes Found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,500px))] gap-y-10 gap-x-5 justify-center py-5 select-none">
      {locations.map((location) => {
        const stats = location.stats || {};
        const totalBeds = stats.totalBeds || 0;
        const occupiedBeds = stats.occupiedBeds || 0;
        const availableBeds = stats.availableBeds || (totalBeds - occupiedBeds);
        const caregiverCount = stats.caregiverCount || 0;
        const careReceiverCount = stats.careReceiverCount || 0;
        const occupancyRate = stats.occupancyRate || (totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0);

        return (
          <Link
            to={`/care-homes/${location.id}`}
            state={location}
            key={location.id}
            className="flex flex-col gap-5 bg-white w-fit py-5 px-5 rounded-md cursor-pointer transition duration-200 ease-in hover:scale-[1.05] shadow-md hover:shadow-lg"
          >
            <div className="flex justify-between">
              <div className="text-left text-gray-700">
                <h1 className="text-xl font-bold leading-4">{location.name}</h1>
                <h2 className="text-lg font-light italic">{location.address}</h2>
                {location.city && (
                  <p className="text-sm text-gray-500">{location.city}, {location.postcode}</p>
                )}
              </div>
              <p
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  location.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}
              >
                {location.isActive ? "Active" : "Inactive"}
              </p>
            </div>
            
            <div className="flex gap-5 items-center">
              <Chart
                total_beds={totalBeds}
                occupied_beds={occupiedBeds}
              />
              
              <div className="text-left leading-5">
                <h2>
                  Total Beds
                  <br />
                  <span className="font-bold text-lg">{totalBeds}</span>
                </h2>
                <h2>
                  Occupied Beds
                  <br />
                  <span className="font-bold text-lg text-red-600">{occupiedBeds}</span>
                </h2>
                <h2>
                  Available Beds
                  <br />
                  <span className="font-bold text-lg text-green-600">
                    {availableBeds}
                  </span>
                </h2>
              </div>
              
              <div className="w-0.5 bg-gray-300 h-[150px] rounded-xl"></div>
              
              <div className="text-left leading-5">
                <h2>
                  Care Givers
                  <br />
                  <span className="font-bold text-lg">{caregiverCount}</span>
                </h2>
                <h2>
                  Care Receivers
                  <br />
                  <span className="font-bold text-lg">{careReceiverCount}</span>
                </h2>
                <h2>
                  Occupancy Rate
                  <br />
                  <span className={`font-bold text-lg ${
                    occupancyRate > 80 ? 'text-red-600' : 
                    occupancyRate > 60 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {occupancyRate}%
                  </span>
                </h2>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default CareHomeSummaryCard;