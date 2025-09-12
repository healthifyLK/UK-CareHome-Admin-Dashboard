import React, { useMemo, useState, useEffect } from 'react';
import { careBedTableHeader } from '../assets/assets';
import { Styles } from '../Styles/Styles';
import roomBedsService from '../services/roomBedsService';
import locationsService from '../services/locationService';

function BedsTable({ care_home, rows_per_page }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(rows_per_page);
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(true);

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
    const loadRoomBeds = async () => {
      try {
        setLoading(true);
        const roomBedsData = await roomBedsService.getAllRoomBeds();
        setData(roomBedsData || []);
      } catch (error) {
        console.error('Error loading room beds:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadRoomBeds();
  }, []);

  // Helper function to get location name by ID
  const getLocationName = (locationId) => {
    if (!locationId || locationsLoading) return 'Loading...';
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : `Unknown (${locationId})`;
  };

  // Helper function to get status display
  const getStatusDisplay = (isOccupied) => {
    return isOccupied ? 'Occupied' : 'Available';
  };

  // Helper function to format features
  const formatFeatures = (features) => {
    if (!features || typeof features !== 'object') return 'None';
    const featureArray = Object.entries(features).map(([key, value]) => `${key}: ${value}`);
    return featureArray.length > 0 ? featureArray.join(', ') : 'None';
  };

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
      const locationName = getLocationName(row.locationId);
      const searchableFields = [
        row.roomNumber,
        row.bedNumber,
        locationName,
        row.floor,
        row.wing,
        getStatusDisplay(row.isOccupied),
        formatFeatures(row.features)
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
  const handleEdit = (id) => {
    setEditingRow(id);
  };

  const handleDone = async (id, updatedData) => {
    try {
      // Here you would call an update API if it exists
      // For now, we'll just update the local state
      setData(prev => prev.map(row => 
        row.id === id ? { ...row, ...updatedData } : row
      ));
      setEditingRow(null);
    } catch (error) {
      console.error('Error updating room bed:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Here you would call a delete API if it exists
      // For now, we'll just update the local state
      setData(prev => prev.filter(row => row.id !== id));
      if ((totalRows - 1) / perPage < currentPage && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error('Error deleting room bed:', error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setData(prev => prev.map(row => 
      row.id === id ? { ...row, isOccupied: newStatus === 'Occupied' } : row
    ));
  };

  // Editable Status cell
  const StatusCell = ({ row }) =>
    editingRow === row.id ? (
      <select
        value={getStatusDisplay(row.isOccupied)}
        onChange={e => handleStatusChange(row.id, e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Available">Available</option>
        <option value="Occupied">Occupied</option>
      </select>
    ) : (
      <span className={row.isOccupied ? 'text-red-600' : 'text-green-600'}>
        {getStatusDisplay(row.isOccupied)}
      </span>
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
            {careBedTableHeader.map((header, index) => (
              <th key={index} className={Styles.TableHeader}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading || locationsLoading ? (
            <tr>
              <td colSpan={careBedTableHeader.length} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr
                key={item.id || index}
                className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50'}
              >
                <td className={Styles.TableData}>{item.roomNumber}</td>
                <td className={Styles.TableData}>{item.bedNumber}</td>
                <td className={Styles.TableData}>
                  {getLocationName(item.locationId)}
                </td>
                <td className={Styles.TableData}>{item.floor || 'N/A'}</td>
                <td className={Styles.TableData}>{item.wing || 'N/A'}</td>
                <td className={Styles.TableData}>
                  <StatusCell row={item} />
                </td>
                <td className={Styles.TableData}>
                  <div className="max-w-xs truncate" title={formatFeatures(item.features)}>
                    {formatFeatures(item.features)}
                  </div>
                </td>
                <td className={Styles.TableData}>
                  <div className="flex gap-2">
                    {editingRow === item.id ? (
                      <button
                        type="button"
                        className="bg-green-600 text-white px-3 py-1 rounded-sm text-sm"
                        onClick={() => handleDone(item.id, item)}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="bg-gray-600 text-white px-3 py-1 rounded-sm text-sm"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      className="bg-red-600 text-white px-3 py-1 rounded-sm text-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={careBedTableHeader.length} className="text-center py-4">
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

export default BedsTable;