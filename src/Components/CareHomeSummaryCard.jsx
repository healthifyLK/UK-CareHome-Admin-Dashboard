import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import locationsService from "../services/locationService";
import { useApiWithCache } from "../hooks/useApi";
import { Link } from "react-router-dom";

function CareHomeSummaryCard() {
  const {
    data: locations,
    loading,
    error,
    execute: fetchLocations,
  } = useApiWithCache(
    () => locationsService.getAllLocations(true),
    "locations-cache"
  );

  useEffect(() => {
    fetchLocations();
  }, []);

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
        // Extract stats from the nested stats object
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
            {/* Start of Title section*/}
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
            {/* End of Title section*/}
            
            {/* Start of Details Area*/}
            <div className="flex gap-5 items-center">
              {/* Start of Chart*/}
              <Chart
                total_beds={totalBeds}
                occupied_beds={occupiedBeds}
              />
              {/* End of Chart*/}
              
              {/* Start of Middle section*/}
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
              {/* End of Middle section*/}
              
              <div className="w-0.5 bg-gray-300 h-[150px] rounded-xl"></div>
              
              {/* Start of Final section*/}
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
              {/* End of Final section*/}
            </div>
            {/* End of Details Area*/}
          </Link>
        );
      })}
    </div>
  );
}

export default CareHomeSummaryCard;