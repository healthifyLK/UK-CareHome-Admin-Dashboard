import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
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
import CareHomeUpdateOverlay from '../Components/CareHomeUpdateOverlay';
import locationsService from '../services/locationService';
import caregiversService from '../services/caregiversService';
import careReceiversService from '../services/careReceiversService';
import roomBedsService from '../services/roomBedsService';
import { notifyLocationUpdate, useLocationUpdates } from '../hooks/useLocationUpdates';

function CareHome() {
  const [filter, setFilter] = useState("Allocations");
  const [careHomeData, setCareHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caregivers, setCaregivers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    caregiverCount: 0,
    careReceiverCount: 0,
    occupancyRate: 0
  });

  const location = useLocation();
  const { id } = useParams();
  const updateTrigger = useLocationUpdates();

  // Helper function to format bed number as CH001A format
  const formatBedNumber = (bedNumber, roomNumber) => {
    if (!bedNumber) return 'N/A';
    
    if (bedNumber.startsWith('CH')) {
      return bedNumber;
    }
    
    if (bedNumber.length === 1 && /[A-Z]/.test(bedNumber)) {
      const paddedRoomNumber = roomNumber ? String(roomNumber).padStart(3, '0') : '001';
      return `CH${paddedRoomNumber}${bedNumber}`;
    }
    
    return bedNumber;
  };

  // Calculate stats for the specific care home
  const calculateStats = async (careHomeData, caregivers) => {
    try {
      // Total Beds = Capacity from database
      const totalBeds = careHomeData.capacity || 0;
      
      // Fetch room beds to count occupied beds
      const roomBeds = await roomBedsService.getByLocation(careHomeData.id);
      const occupiedBeds = roomBeds.filter(rb => rb.isOccupied).length;
      
      // Available beds = Capacity - Occupied beds
      const availableBeds = Math.max(0, totalBeds - occupiedBeds);
      
      // Count caregivers for this location
      const caregiverCount = caregivers.length;
      
      // Fetch care receivers for this location
      const careReceivers = await careReceiversService.getAllCareReceivers();
      const careReceiverCount = careReceivers.filter(cr => cr.locationId === careHomeData.id).length;
      
      const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
      
      return {
        totalBeds,
        occupiedBeds,
        availableBeds,
        caregiverCount,
        careReceiverCount,
        occupancyRate
      };
    } catch (err) {
      console.error('Error calculating stats:', err);
      return {
        totalBeds: careHomeData.capacity || 0,
        occupiedBeds: 0,
        availableBeds: careHomeData.capacity || 0,
        caregiverCount: caregivers.length,
        careReceiverCount: 0,
        occupancyRate: 0
      };
    }
  };

  // Comprehensive data loading function
  const loadCareHomeData = async (careHomeId) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading care home data for ID:', careHomeId);

      // Fetch care home details
      const careHomeDetails = await locationsService.getLocationById(careHomeId, true);
      console.log('Care home details:', careHomeDetails);

      // Fetch caregivers
      const caregiversData = await caregiversService.getAllCaregivers();
      const locationCaregivers = caregiversData.filter(cg => cg.locationId === careHomeId);

      // Calculate stats
      const calculatedStats = await calculateStats(careHomeDetails, locationCaregivers);

      // Create allocations data
      const allocationsData = await generateAllocationsData(careHomeId, locationCaregivers);

      setCareHomeData(careHomeDetails);
      setCaregivers(locationCaregivers);
      setAllocations(allocationsData);
      setStats(calculatedStats);

      console.log('Data loaded successfully');
    } catch (err) {
      console.error('Error loading care home data:', err);
      setError(err.message);
      
      if (location.state) {
        setCareHomeData(location.state);
        setCaregivers(location.state?.CareGivers || []);
        setAllocations(location.state?.Allocations || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load care home data from backend
  useEffect(() => {
    const careHomeId = id || location.state?.id;
    
    if (!careHomeId) {
      setError('Care home ID not found');
      setLoading(false);
      return;
    }

    loadCareHomeData(careHomeId);
  }, [id, location.state]);

  // Listen for location updates and refresh data
  useEffect(() => {
    if (updateTrigger > 0) {
      console.log('CareHome: Refreshing due to location update, trigger:', updateTrigger);
      const careHomeId = id || location.state?.id;
      if (careHomeId) {
        loadCareHomeData(careHomeId);
        setRefreshTrigger(prev => prev + 1);
      }
    }
  }, [updateTrigger, id, location.state]);

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
          bed: formatBedNumber(bed.bedNumber, bed.roomNumber),
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

  // Handle update button click
  const handleUpdateClick = () => {
    setShowUpdateOverlay(true);
  };

  // Handle overlay close
  const handleOverlayClose = () => {
    setShowUpdateOverlay(false);
  };

  // Handle successful update - comprehensive refresh
  const handleUpdateSuccess = async (updatedData) => {
    try {
      console.log('Update successful, refreshing all data...');
      
      const careHomeId = id || location.state?.id;
      
      if (careHomeId) {
        await loadCareHomeData(careHomeId);
        console.log('Data refreshed successfully');
        notifyLocationUpdate(careHomeId, updatedData);
        setRefreshTrigger(prev => prev + 1);
      } else {
        setCareHomeData(updatedData);
      }
    } catch (error) {
      console.error('Error refreshing data after update:', error);
      setCareHomeData(updatedData);
    }
  };

  // Single Care Home Card Component
  const CareHomeCard = ({ careHome, stats }) => {
    if (!careHome) return null;

    return (
      <div className="flex gap-5 items-center">
        {/* Left side - Care Home Card */}
        <div className="flex flex-col gap-5 bg-white w-fit py-5 px-5 rounded-md shadow-md">
          <div className="flex gap-5 items-center">
            <Chart
              total_beds={stats.totalBeds}
              occupied_beds={stats.occupiedBeds}
            />
            
            <div className="text-left leading-5">
              <h2>
                Total Beds
                <br />
                <span className="font-bold text-lg">{stats.totalBeds}</span>
              </h2>
              <h2>
                Occupied Beds
                <br />
                <span className="font-bold text-lg text-red-600">{stats.occupiedBeds}</span>
              </h2>
              <h2>
                Available Beds
                <br />
                <span className="font-bold text-lg text-green-600">
                  {stats.availableBeds}
                </span>
              </h2>
            </div>
            
            <div className="w-0.5 bg-gray-300 h-[150px] rounded-xl"></div>
            
            <div className="text-left leading-5">
              <h2>
                Care Givers
                <br />
                <span className="font-bold text-lg">{stats.caregiverCount}</span>
              </h2>
              <h2>
                Care Receivers
                <br />
                <span className="font-bold text-lg">{stats.careReceiverCount}</span>
              </h2>
              <h2>
                Occupancy Rate
                <br />
                <span className={`font-bold text-lg ${
                  stats.occupancyRate > 80 ? 'text-red-600' : 
                  stats.occupancyRate > 60 ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {stats.occupancyRate}%
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/care-givers/register"
            className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Caregiver
          </Link>
          
          <Link
            to="/care-receivers/register"
            className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Care Receiver
          </Link>
          
          <Link
            to="/care-beds/register"
            className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Care Bed
          </Link>
        </div>
      </div>
    );
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
              onClick={() => {
                const careHomeId = id || location.state?.id;
                if (careHomeId) {
                  loadCareHomeData(careHomeId);
                }
              }}
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

  return (
    <div className={Styles.PageStyle}>
      {/* Start of Page header area */}
      <div className={Styles.PageTopContainer}>
        <BackButton />
        <UpdateBtn btn_name={"Care Home"} onClick={handleUpdateClick} />
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

        {/* Care Home Card with Action Buttons */}
        <div className="flex justify-center">
          <CareHomeCard careHome={careHomeData} stats={stats} />
        </div>

        {/* Start of Care Home Data section*/}
        <div className='flex flex-col mt-10'>
          <CareHomeTableFilter filter={filter} setFilter={setFilter} />
          {filter === "Allocations" && (
            <AllocationTable 
              initialData={allocations} 
              availableCareGivers={caregivers.map(cg => `${cg.firstName} ${cg.lastName}`)} 
              refreshTrigger={refreshTrigger}
            />
          )}
          {filter === "Care Receivers" && (
            <CareReceiverTable 
              care_home={careHomeData.name} 
              rows_per_page={5} 
              refreshTrigger={refreshTrigger}
            />
          )}
          {filter === "Care Givers" && (
            <CareGiverTable 
              care_home={careHomeData.name} 
              rows_per_page={5} 
              refreshTrigger={refreshTrigger}
            />
          )}
          {filter === "Beds" && (
            <BedsTable 
              care_home={careHomeData.name} 
              rows_per_page={5} 
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
        {/* End of Care Home Data section*/}
      </div>

      {/* Update Overlay */}
      {showUpdateOverlay && (
        <CareHomeUpdateOverlay
          careHomeData={careHomeData}
          onClose={handleOverlayClose}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default CareHome;