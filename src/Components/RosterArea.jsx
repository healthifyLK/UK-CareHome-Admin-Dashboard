import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Play, CheckCircle, XCircle } from 'lucide-react';
import rostersService from '../services/rostersService';
import locationsService from '../services/locationService';
import caregiversService from '../services/caregiversService';
import roomBedsService from '../services/roomBedsService';

const RosterArea = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [roomBeds, setRoomBeds] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [editingRow, setEditingRow] = useState(null);
  const [editingStatus, setEditingStatus] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [locationsData, caregiversData] = await Promise.all([
          locationsService.getAllLocations(),
          caregiversService.getAllCaregivers()
        ]);
        setLocations(locationsData || []);
        setCaregivers(caregiversData || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Load shifts when week or location changes
  useEffect(() => {
    const loadShifts = async () => {
      try {
        setLoading(true);
        const startDate = getWeekStartDate(currentWeek).toISOString().split('T')[0];
        const endDate = getWeekEndDate(currentWeek).toISOString().split('T')[0];
        
        const locationId = selectedLocation !== 'All' 
          ? locations.find(loc => loc.name === selectedLocation)?.id 
          : null;
        
        const shiftsData = await rostersService.getRosters(startDate, endDate, locationId);
        setShifts(shiftsData || []);
      } catch (error) {
        console.error('Error loading shifts:', error);
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };
    loadShifts(); // Fixed: was loadInitialData()
  }, [currentWeek, selectedLocation, locations]);

  // Helper functions
  const getWeekStartDate = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return startOfWeek;
  };

  const getWeekEndDate = (date) => {
    const endOfWeek = new Date(date);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    return endOfWeek;
  };

  // Generate week dates for display
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = getWeekStartDate(currentWeek);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeek]);

  // Get unique caregivers from shifts
  const uniqueCaregivers = useMemo(() => {
    const caregiverMap = new Map();
    shifts.forEach(shift => {
      if (!caregiverMap.has(shift.caregiverId)) {
        const caregiver = caregivers.find(cg => cg.id === shift.caregiverId);
        if (caregiver) {
          caregiverMap.set(shift.caregiverId, {
            id: caregiver.id,
            name: `${caregiver.firstName} ${caregiver.lastName}`,
            email: caregiver.email
          });
        }
      }
    });
    return Array.from(caregiverMap.values());
  }, [shifts, caregivers]);

  // Get shifts for caregiver and date
  const getShiftsForCaregiverAndDate = (caregiverId, date) => {
    const dateString = date.toISOString().split('T')[0];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.shiftDate).toISOString().split('T')[0];
      return shift.caregiverId === caregiverId && shiftDate === dateString;
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentWeek(newDate);
  };

  const formatTime = (timeString) => timeString.slice(0, 5);

  const getShiftTypeColor = (shiftType) => ({
    'FULL_DAY': 'bg-blue-100 text-blue-800 border-blue-200',
    'MORNING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'AFTERNOON': 'bg-orange-100 text-orange-800 border-orange-200',
    'NIGHT': 'bg-purple-100 text-purple-800 border-purple-200',
  }[shiftType] || 'bg-gray-100 text-gray-800 border-gray-200');

  const getStatusColor = (status) => ({
    'PUBLISHED': 'bg-green-100 text-green-800',
    'DRAFT': 'bg-gray-100 text-gray-800',
    'ACTIVE': 'bg-blue-100 text-blue-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800');

  const getShiftStatusColor = (shiftStatus) => ({
    'SCHEDULED': 'bg-gray-100 text-gray-800',
    'CONFIRMED': 'bg-blue-100 text-blue-800',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'NO_SHOW': 'bg-red-100 text-red-800',
  }[shiftStatus] || 'bg-gray-100 text-gray-800');

  // Get location name by ID
  const getLocationName = (locationId) => {
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  // Get room/bed info by ID
  // const getRoomBedInfo = (roomBedId) => {
  //   if (!roomBedId) return null;
  //   const roomBed = roomBeds.find(rb => rb.id === roomBedId);
  //   return roomBed ? `${roomBed.roomNumber}-${roomBed.bedNumber}` : 'Unknown';
  // };

  // Handlers
  const handleEdit = (shift) => {
    setEditingRow(shift.id);
    setEditingStatus(shift.status);
  };

  const handleDone = async () => {
    try {
      await rostersService.updateRoster(editingRow, { status: editingStatus });
      setShifts(prev =>
        prev.map(s =>
          s.id === editingRow ? { ...s, status: editingStatus } : s
        )
      );
      setEditingRow(null);
      setEditingStatus('');
    } catch (error) {
      console.error('Error updating roster:', error);
    }
  };

  const handleConfirmShift = async (shiftId) => {
    try {
      await rostersService.confirmShift(shiftId);
      setShifts(prev =>
        prev.map(s =>
          s.id === shiftId ? { ...s, shiftStatus: 'CONFIRMED', confirmedAt: new Date() } : s
        )
      );
    } catch (error) {
      console.error('Error confirming shift:', error);
    }
  };

  const handleStartShift = async (shiftId) => {
    try {
      await rostersService.startShift(shiftId);
      setShifts(prev =>
        prev.map(s =>
          s.id === shiftId ? { ...s, shiftStatus: 'IN_PROGRESS', startedAt: new Date() } : s
        )
      );
    } catch (error) {
      console.error('Error starting shift:', error);
    }
  };

  const handleCompleteShift = async (shiftId) => {
    try {
      await rostersService.completeShift(shiftId);
      setShifts(prev =>
        prev.map(s =>
          s.id === shiftId ? { ...s, shiftStatus: 'COMPLETED', completedAt: new Date() } : s
        )
      );
    } catch (error) {
      console.error('Error completing shift:', error);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await rostersService.deleteRoster(shiftId);
      setShifts(prev => prev.filter(s => s.id !== shiftId));
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-full mx-auto p-6 bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading rosters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6 bg-white">
      {/* Location Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Filter by Location:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Locations</option>
          {locations.map(location => (
            <option key={location.id} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => navigateWeek(-1)}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          ← Previous Week
        </button>
        <span className="text-lg font-medium">
          {weekDates[0]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6]?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <button
          onClick={() => navigateWeek(1)}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
        >
          Next Week →
        </button>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Caregiver
              </th>
              {weekDates.map((date, index) => (
                <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                  <div className="flex flex-col items-center">
                    <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-gray-700 font-semibold">{date.getDate()}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {uniqueCaregivers.map((caregiver) => (
              <tr key={caregiver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{caregiver.name}</div>
                      <div className="text-sm text-gray-500">ID: {caregiver.id.slice(-8)}</div>
                    </div>
                  </div>
                </td>
                {weekDates.map((date, dateIndex) => {
                  const dayShifts = getShiftsForCaregiverAndDate(caregiver.id, date);
                  return (
                    <td key={dateIndex} className="px-2 py-4 text-center align-top">
                      <div className="space-y-1">
                        {dayShifts.length === 0 ? (
                          <div className="text-gray-400 text-xs py-2">No shifts</div>
                        ) : (
                          dayShifts.map((shift) => (
                            <div
                              key={shift.id}
                              className={`p-2 rounded border text-xs ${getShiftTypeColor(shift.shiftType)}`}
                            >
                              <div className="font-medium mb-1">{shift.shiftType.replace('_', ' ')}</div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                              </div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{getLocationName(shift.locationId)}</span>
                              </div>
                              {/* {shift.roomBedId && (
                                <div className="text-xs text-gray-600 mb-1">
                                  Room: {getRoomBedInfo(shift.roomBedId)}
                                </div>
                              )} */}
                              <div className={`px-1 py-0.5 rounded text-xs inline-block mb-1 ${getStatusColor(shift.status)}`}>
                                {editingRow === shift.id ? (
                                  <select
                                    value={editingStatus}
                                    onChange={e => setEditingStatus(e.target.value)}
                                    className="bg-white border rounded p-1 text-xs"
                                  >
                                    <option value="DRAFT">DRAFT</option>
                                    <option value="PUBLISHED">PUBLISHED</option>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                  </select>
                                ) : (
                                  shift.status
                                )}
                              </div>
                              <div className={`px-1 py-0.5 rounded text-xs inline-block mb-2 ${getShiftStatusColor(shift.shiftStatus)}`}>
                                {shift.shiftStatus}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {editingRow === shift.id ? (
                                  <button
                                    className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs"
                                    onClick={handleDone}
                                  >
                                    Done
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      className="bg-black text-white px-2 py-1 rounded-sm text-xs"
                                      onClick={() => handleEdit(shift)}
                                    >
                                      Edit
                                    </button>
                                    {shift.shiftStatus === 'SCHEDULED' && (
                                      <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded-sm text-xs"
                                        onClick={() => handleConfirmShift(shift.id)}
                                        title="Confirm Shift"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </button>
                                    )}
                                    {shift.shiftStatus === 'CONFIRMED' && (
                                      <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded-sm text-xs"
                                        onClick={() => handleStartShift(shift.id)}
                                        title="Start Shift"
                                      >
                                        <Play className="w-3 h-3" />
                                      </button>
                                    )}
                                    {shift.shiftStatus === 'IN_PROGRESS' && (
                                      <button
                                        className="bg-green-500 text-white px-2 py-1 rounded-sm text-xs"
                                        onClick={() => handleCompleteShift(shift.id)}
                                        title="Complete Shift"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                      </button>
                                    )}
                                    <button
                                      className="bg-red-500 text-white px-2 py-1 rounded-sm text-xs"
                                      onClick={() => handleDeleteShift(shift.id)}
                                      title="Delete Shift"
                                    >
                                      <XCircle className="w-3 h-3" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-medium text-gray-700">Shift Types:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Full Day</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>Morning</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
          <span>Afternoon</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
          <span>Night</span>
        </div>
      </div>

      {/* Status Legend */}
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
        <span className="font-medium text-gray-700">Shift Status:</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-100 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-100 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-100 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 rounded"></div>
          <span>Cancelled/No Show</span>
        </div>
      </div>
    </div>
  );
};

export default RosterArea;