import React, { useMemo, useState, useEffect } from 'react';
import { availableCareGivers, careReceiverTableHeader } from '../assets/assets';
import { Styles } from '../Styles/Styles';
import { useNavigate } from 'react-router-dom';
import careReceiversService from '../services/careReceiversService';
import locationsService from '../services/locationService';

function CareReceiverTable({ care_home, rows_per_page }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(rows_per_page);
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch locations for name resolution
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocationsLoading(true);
        const locationsData = await locationsService.getAllLocations();
        setLocations(locationsData || []);
      } catch (error) {
        console.error('Error loading locations:', error);
        setLocations([]);
      } finally {
        setLocationsLoading(false);
      }
    };
    loadLocations();
  }, []);

  // Fetch data from backend
  useEffect(() => {
    setLoading(true);
    careReceiversService.getAllCareReceivers()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  // Helper function to get location name by ID
  const getLocationName = (locationId) => {
    if (!locationId || locationsLoading) return 'Loading...';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : `Unknown (${locationId})`;
  };

  // Helper function to count emergency contacts
  const getEmergencyContactsCount = (emergencyContacts) => {
    if (!emergencyContacts || !Array.isArray(emergencyContacts)) return '0';
    return emergencyContacts.length.toString();
  };

  // Helper function to get care level display
  const getCareLevelDisplay = (careLevel) => {
    if (!careLevel) return '';
    return careLevel.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get mobility level display
  const getMobilityDisplay = (mobilityLevel) => {
    if (!mobilityLevel) return '';
    return mobilityLevel.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get mental capacity display
  const getMentalCapacityDisplay = (mentalCapacityLevel) => {
    if (!mentalCapacityLevel) return '';
    return mentalCapacityLevel.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper function to get status display
  const getStatusDisplay = (status) => {
    if (!status) return '';
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAdmissionDate = (admissionDate) => {
    if (!admissionDate) return 'Not available';
    try {
      const date = new Date(admissionDate);
      return date.toLocaleDateString('en-GB',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting admission date:', error);
      return 'Invalid date';
    }
  }

  // Filter data by care_home prop (now using location names)
  const filteredByHome = useMemo(() => {
    if (care_home && care_home !== 'All') {
      return data.filter(item => {
        const locationName = getLocationName(item.locationId);
        return locationName === care_home;
      });
    }
    return data;
  }, [data, care_home, locations, locationsLoading]);

  // Filter data by search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return filteredByHome;
    const lowerSearch = searchTerm.toLowerCase();
    return filteredByHome.filter(row => {
      // Include location name in search
      const locationName = getLocationName(row.locationId);
      const searchableFields = [
        row.firstName,
        row.lastName,
        locationName,
        row.medicalRecordNumber,
        row.presentAddress,
        row.nationality,
        getCareLevelDisplay(row.careLevel),
        getMobilityDisplay(row.mobilityLevel),
        getMentalCapacityDisplay(row.mentalCapacityLevel),
        getStatusDisplay(row.status)
      ];
      
      return searchableFields.some(field => 
        field && field.toString().toLowerCase().includes(lowerSearch)
      );
    });
  }, [filteredByHome, searchTerm, locations, locationsLoading]);

  // Pagination calculations
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + perPage);

  // Reset page on search, care_home, or perPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, care_home, perPage]);

  // Handlers
  const handleDischarge = async (id) => {
    try {
      await careReceiversService.dischargeCareReceiver(id);
      setData(prev => prev.filter(row => row.id !== id));
      if ((totalRows - 1) / perPage < currentPage && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error discharging care receiver:', err);
    }
  };

  const handleEdit = (id) => {
    setEditingRow(id);
  };

  const handleDone = async (id, updatedRow) => {
    try {
      await careReceiversService.updateCareReceiver(id, updatedRow);
      setEditingRow(null);
      setData(prev =>
        prev.map(row => (row.id === id ? { ...row, ...updatedRow } : row))
      );
    } catch (err) {
      console.error('Error updating care receiver:', err);
    }
  };

  const handleCareGiver2Change = (id, newValue) => {
    setData(prev =>
      prev.map(row => (row.id === id ? { ...row, CareGiver2: newValue } : row))
    );
  };

  const handleOpen = (id) => {
    navigate(`/care-receivers/${id}`);
  };

  // Helper to calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Editable CareGiver2 cell
  const CareGiver2Cell = ({ row }) =>
    editingRow === row.id ? (
      <select
        value={row.CareGiver2 || ''}
        onChange={e => handleCareGiver2Change(row.id, e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Select Caregiver</option>
        {availableCareGivers.map(cg => (
          <option key={cg} value={cg}>
            {cg}
          </option>
        ))}
      </select>
    ) : (
      <span>{row.CareGiver2 || 'Not assigned'}</span>
    );

  return (
    <div>
      {/* Search input and clear */}
      <div className="p-4 bg-blue-50 border-b flex gap-3 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setSearchTerm('')}
          className="border border-blue-600 text-blue-600 bg-blue-50 py-1 px-2 rounded-sm cursor-pointer active:bg-blue-200"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <table border={1} className={Styles.Table}>
        <thead className={Styles.TableHead}>
          <tr>
            {careReceiverTableHeader.map((header, index) => (
              <th key={index} className={Styles.TableHeader}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading || locationsLoading ? (
            <tr>
              <td colSpan={careReceiverTableHeader.length + 1} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr
                key={item.id || index}
                className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}
              >
                <td className={Styles.TableData}>{item.id}</td>
                <td className={Styles.TableData}>{item.firstName}</td>
                <td className={Styles.TableData}>{item.lastName}</td>
                <td className={Styles.TableData}>
                  {getLocationName(item.locationId)}
                </td>
                <td className={Styles.TableData}>
                  {calculateAge(item.dateOfBirth)}
                </td>
                <td className={Styles.TableData}>{item.CareGiver1 || 'Not assigned'}</td>
                <td className={Styles.TableData}>{formatAdmissionDate(item.admissionDate)}</td>
                <td className={Styles.TableData}>
                  {getEmergencyContactsCount(item.emergencyContacts)}
                </td>
                <td className={Styles.TableData}>{getStatusDisplay(item.status)}</td>
                <td className={Styles.TableData}>{getCareLevelDisplay(item.careLevel)}</td>
                <td className={Styles.TableData}>
                  <div className="flex gap-3">
                    <button
                      className="bg-blue-500 py-1 px-1.5 text-white text-sm rounded-sm"
                      type="button"
                      onClick={() => handleOpen(item.id)}
                    >
                      Open
                    </button>
                    {/* {editingRow === item.id ? (
                      <button
                        className="bg-green-600 py-1 px-1.5 text-white text-sm rounded-sm"
                        type="button"
                        onClick={() => handleDone(item.id, item)}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        className="bg-gray-500 py-1 px-1.5 text-white text-sm rounded-sm"
                        type="button"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                    )} */}
                    <button
                      className="bg-red-500 py-1 px-1.5 text-white text-sm rounded-sm"
                      type="button"
                      onClick={() => handleDischarge(item.id)}
                    >
                      Discharge
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={careReceiverTableHeader.length + 1} className="text-center py-4">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(startIndex + paginatedData.length, totalRows)} of {totalRows} entries
          {searchTerm && ` (filtered from ${filteredByHome.length} total entries)`}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={perPage}
            onChange={e => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </select>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareReceiverTable;