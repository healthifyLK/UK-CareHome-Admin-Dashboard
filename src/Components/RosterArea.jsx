import React, { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Filter } from 'lucide-react';
import { CareGiverShifts } from '../assets/assets';

const RosterArea = () => {
  // Sample data based on your API response structure
  const [shifts] = useState(CareGiverShifts);

  const [currentWeek, setCurrentWeek] = useState(new Date('2025-09-13'));

  // Generate week dates
  const weekDates = useMemo(() => {
    const dates = [];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeek]);

  // Get unique caregivers
  const caregivers = useMemo(() => {
    const uniqueCaregivers = new Map();
    shifts.forEach(shift => {
      if (!uniqueCaregivers.has(shift.caregiverId)) {
        uniqueCaregivers.set(shift.caregiverId, shift.caregiver);
      }
    });
    return Array.from(uniqueCaregivers.values());
  }, [shifts]);

  // Get shifts for a specific caregiver and date
  const getShiftsForCaregiverAndDate = (caregiverId, date) => {
    const dateString = date.toISOString().split('T')[0];
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.shiftDate).toISOString().split('T')[0];
      return shift.caregiverId === caregiverId && shiftDate === dateString;
    });
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setCurrentWeek(newDate);
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  // Get shift type color
  const getShiftTypeColor = (shiftType) => {
    const colors = {
      'FULL_DAY': 'bg-blue-100 text-blue-800 border-blue-200',
      'MORNING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'EVENING': 'bg-orange-100 text-orange-800 border-orange-200',
      'NIGHT': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[shiftType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'PUBLISHED': 'bg-green-100 text-green-800',
      'DRAFT': 'bg-gray-100 text-gray-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white">
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
            {caregivers.map((caregiver) => (
              <tr key={caregiver.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
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
                                <span className="truncate">{shift.location.name}</span>
                              </div>
                              <div className={`px-1 py-0.5 rounded text-xs ${getStatusColor(shift.status)}`}>
                                {shift.status}
                              </div>
                              {shift.notes && (
                                <div className="text-xs text-gray-600 mt-1 italic">
                                  {shift.notes.length > 20 ? shift.notes.substring(0, 20) + '...' : shift.notes}
                                </div>
                              )}
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
          <span>Evening</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
          <span>Night</span>
        </div>
      </div>
    </div>
  );
};

export default RosterArea;