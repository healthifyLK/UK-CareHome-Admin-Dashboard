import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Styles } from '../Styles/Styles';
import BackButton from '../Components/BackButton';
import UpdateBtn from '../Components/UpdateBtn';
import Chart from '../Components/Chart';
import AddBtn2 from '../Components/AddBtn2';
import AllocationTable from '../Components/AllocationTable';
import CareHomeTableFilter from '../Components/CareHomeTableFilter';
import CareReceiverTable from '../Components/CareReceiverTable';
import BedsTable from '../Components/BedsTable';
import CareGiverTable from '../Components/CareGiverTable';
import locationsService from '../services/locationService';
import caregiversService from '../services/caregiversService';
import careReceiversService from '../services/careReceiversService';
import roomBedsService from '../services/roomBedsService';

function CareHome() {
  const [filter, setFilter] = useState("Allocations");
  const [careHomeData, setCareHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [allocations, setAllocations] = useState([]);

  const location = useLocation();
  const { id } = useParams();

  // Helper function to format bed number as CH001A format
  const formatBedNumber = (bedNumber, roomNumber) => {
    if (!bedNumber) return 'N/A';
    
    // If bedNumber is already in CH001A format, return as is
    if (bedNumber.startsWith('CH')) {
      return bedNumber;
    }
    
    // If bedNumber is just a letter (A, B, C, etc.), format it as CH001A
    if (bedNumber.length === 1 && /[A-Z]/.test(bedNumber)) {
      const paddedRoomNumber = roomNumber ? String(roomNumber).padStart(3, '0') : '001';
      return `CH${paddedRoomNumber}${bedNumber}`;
    }
    
    // For any other format, return as is
    return bedNumber;
  };

  // Load care home data from backend
  useEffect(() => {
    const loadCareHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get ID from URL params first, then from location state
        const careHomeId = id || location.state?.id;
        
        if (!careHomeId) {
          throw new Error('Care home ID not found');
        }

        // Fetch care home details with statistics
        const careHomeDetails = await locationsService.getLocationById(careHomeId, true);

        // Fetch caregivers
        const caregiversData = await caregiversService.getAllCaregivers();

        // Filter caregivers for this location
        const locationCaregivers = caregiversData.filter(cg => cg.locationId === careHomeId);

        // Fetch room beds for this location
        const roomBeds = await roomBedsService.getByLocation(careHomeId);

        // Fetch care receivers for this location
        const careReceivers = await careReceiversService.getAllCareReceivers();
        const locationCareReceivers = careReceivers.filter(cr => cr.locationId === careHomeId);

        // Create allocations data
        const allocationsData = await generateAllocationsData(careHomeId, locationCaregivers);

        // Calculate stats manually as fallback if backend stats are not available
        const manualStats = {
          totalBeds: roomBeds.length,
          occupiedBeds: roomBeds.filter(rb => rb.isOccupied).length,
          caregiverCount: locationCaregivers.length,
          careReceiverCount: locationCareReceivers.length,
        };
        manualStats.availableBeds = manualStats.totalBeds - manualStats.occupiedBeds;
        manualStats.occupancyRate = manualStats.totalBeds > 0 
          ? Math.round((manualStats.occupiedBeds / manualStats.totalBeds) * 100) 
          : 0;

        setCareHomeData(careHomeDetails);
        setCaregivers(locationCaregivers);
        setAllocations(allocationsData);

      } catch (err) {
        console.error('Error loading care home data:', err);
        setError(err.message);
        
        // Fallback to location state if available
        if (location.state) {
          setCareHomeData(location.state);
          setCaregivers(location.state?.CareGivers || []);
          setAllocations(location.state?.Allocations || []);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCareHomeData();
  }, [id, location.state]);

  // Generate allocations data
  const generateAllocationsData = async (locationId, caregivers) => {
    try {
      const careReceivers = await careReceiversService.getAllCareReceivers();
      const locationCareReceivers = careReceivers.filter(cr => cr.locationId === locationId);
      
      const roomBeds = await roomBedsService.getByLocation(locationId);
      const occupiedBeds = roomBeds.filter(rb => rb.isOccupied);

      return occupiedBeds.map((bed, index) => {
        const careReceiver = locationCareReceivers[index] || null;
        const caregiver1 = caregivers[index % caregivers.length] || null;
        const caregiver2 = caregivers[(index + 1) % caregivers.length] || null;

        return {
          id: bed.id,
          bed: formatBedNumber(bed.bedNumber, bed.roomNumber), // Use formatted bed number
          careReceiver: careReceiver ? `${careReceiver.firstName} ${careReceiver.lastName}` : 'Unassigned',
          careGiver1: caregiver1 ? `${caregiver1.firstName} ${caregiver1.lastName}` : 'Unassigned',
          careGiver2: caregiver2 ? `${caregiver2.firstName} ${caregiver2.lastName}` : 'Unassigned',
        };
      });
    } catch (error) {
      console.error('Error generating allocations:', error);
      return [];
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error && !careHomeData) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600 text-center">
            <p className="text-lg font-semibold">Error loading care home data</p>
            <p className="text-sm">{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data
  if (!careHomeData) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Care home not found</p>
        </div>
      </div>
    );
  }

  // Extract data from backend response or use manual calculations
  const backendStats = careHomeData.stats || {};
  
  // Calculate manual stats as fallback
  const manualStats = {
    totalBeds: 0,
    occupiedBeds: 0,
    caregiverCount: caregivers.length,
    careReceiverCount: 0,
  };
  
  // Use backend stats if available and valid, otherwise use manual calculations
  const totalBeds = backendStats.totalBeds || manualStats.totalBeds || 0;
  const occupiedBeds = backendStats.occupiedBeds || manualStats.occupiedBeds || 0;
  const availableBeds = backendStats.availableBeds || (totalBeds - occupiedBeds);
  const caregiverCount = backendStats.caregiverCount || manualStats.caregiverCount || 0;
  const careReceiverCount = backendStats.careReceiverCount || manualStats.careReceiverCount || 0;
  const occupancyRate = backendStats.occupancyRate || (totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0);

  return (
    <div className={Styles.PageStyle}>
      {/* Start of Page header area */}
      <div className={Styles.PageTopContainer}>
        <BackButton />
        <UpdateBtn btn_name={"Care Home"} />
      </div>
      
      <div className='flex flex-col gap-5 overflow-scroll'>
        {/* Start of Page title area */}
        <div className='text-left'>
          <h1 className='text-xl font-bold leading-4'>{careHomeData.name}</h1>
          <h1 className='text-lg font-light'>
            {careHomeData.address} | 
            <span className={careHomeData.isActive ? "text-green-600" : "text-red-600"}>
              {careHomeData.isActive ? "Active" : "Inactive"}
            </span>
          </h1>
          {careHomeData.city && (
            <p className="text-sm text-gray-500">{careHomeData.city}, {careHomeData.postcode}</p>
          )}
        </div>
        {/* End of Page title area */}

        {/* Start of Page top area */}
        <div className='flex justify-around items-center'>
          {/* Start of Page Bed details section */}
          <div className='flex items-center gap-5 bg-white w-fit p-8 rounded-lg shadow-md'>
            <Chart total_beds={totalBeds} occupied_beds={occupiedBeds} />
            <div className='text-left leading-5'>
              <h2>
                Total Beds<br />
                <span className='font-bold text-lg'>{totalBeds}</span>
              </h2>
              <h2>
                Occupied Beds<br />
                <span className='font-bold text-lg text-red-600'>{occupiedBeds}</span>
              </h2>
              <h2>
                Available Beds<br />
                <span className='font-bold text-lg text-green-600'>{availableBeds}</span>
              </h2>
            </div>
          </div>
          {/* End of Page Bed details section */}

          {/* Additional Statistics */}
          <div className='flex items-center gap-5 bg-white w-fit p-8 rounded-lg shadow-md'>
            <div className='text-left leading-5'>
              <h2>
                Care Givers<br />
                <span className='font-bold text-lg'>{caregiverCount}</span>
              </h2>
              <h2>
                Care Receivers<br />
                <span className='font-bold text-lg'>{careReceiverCount}</span>
              </h2>
              <h2>
                Occupancy Rate<br />
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

          {/* Action buttons */}
          <div className='flex flex-col gap-2'>
            <AddBtn2 btn_name={'Care Giver'} />
            <AddBtn2 btn_name={'Care Receiver'} />
            <AddBtn2 btn_name={'Care Bed'} />
          </div>
        </div>
        {/* End of Page top area */}

        {/* Start of Care Home Data section*/}
        <div className='flex flex-col mt-10'>
          <CareHomeTableFilter filter={filter} setFilter={setFilter} />
          {filter === "Allocations" && (
            <AllocationTable 
              initialData={allocations} 
              availableCareGivers={caregivers.map(cg => `${cg.firstName} ${cg.lastName}`)} 
            />
          )}
          {filter === "Care Receivers" && (
            <CareReceiverTable 
              care_home={careHomeData.name} 
              rows_per_page={5} 
            />
          )}
          {filter === "Care Givers" && (
            <CareGiverTable 
              care_home={careHomeData.name} 
              rows_per_page={5} 
            />
          )}
          {filter === "Beds" && (
            <BedsTable 
              care_home={careHomeData.name} 
              rows_per_page={5} 
            />
          )}
        </div>
        {/* End of Care Home Data section*/}
      </div>
    </div>
  );
}

export default CareHome;