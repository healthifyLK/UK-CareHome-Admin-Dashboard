import React, { useState, useMemo, useEffect } from 'react';
import { Styles } from '../Styles/Styles';

const AllocationTable = ({ initialData, availableCareGivers }) => {
  const [data, setData] = useState(initialData);
  const [editingRow, setEditingRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchTerm]);

  // Pagination variables
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + perPage);
  const endIndex = startIndex + paginatedData.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, perPage]);

  const handleEdit = id => setEditingRow(id);
  const handleDone = () => setEditingRow(null);
  const handleDelete = id => {
    setData(data.filter(row => row.id !== id));
    if ((data.length - 1) / perPage < currentPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleCareGiverChange = (id, newValue) => {
    setData(data.map(row => (row.id === id ? { ...row, careGiver2: newValue } : row)));
  };

  // Editable CareGiver2 cell component
  const CareGiver2Cell = ({ row }) =>
    editingRow === row.id ? (
      <select
        value={row.careGiver2}
        onChange={e => handleCareGiverChange(row.id, e.target.value)}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableCareGivers.map(cg => (
          <option key={cg} value={cg}>
            {cg}
          </option>
        ))}
      </select>
    ) : (
      <span>{row.careGiver2}</span>
    );

  // Actions cell component (Edit, Done, Delete buttons)
  const ActionCell = ({ row }) => (
    <div className="flex gap-2">
      {editingRow === row.id ? (
        <button
          onClick={handleDone}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
        >
          Done
        </button>
      ) : (
        <button
          onClick={() => handleEdit(row.id)}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
        >
          Edit
        </button>
      )}
      <button
        onClick={() => handleDelete(row.id)}
        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="p-2 h-auto bg-blue-50 rounded-lg overflow-hidden">
      {/* Search and Clear */}
      <div className="p-4 border-b flex gap-3 items-center">
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
      <div className="overflow-x-auto">
        <table className={Styles.Table}>
          <thead className={Styles.TableHead}>
            <tr>
              <th className={Styles.TableHeader}>Bed</th>
              <th className={Styles.TableHeader}>Care Receiver</th>
              <th className={Styles.TableHeader}>Care Giver 1</th>
              <th className={Styles.TableHeader}>Care Giver 2</th>
              <th className={Styles.TableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length ? (
              paginatedData.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className={Styles.TableData}>{row.bed}</td>
                  <td className={Styles.TableData}>{row.careReceiver}</td>
                  <td className={Styles.TableData}>{row.careGiver1}</td>
                  <td className={Styles.TableData}>
                    <CareGiver2Cell row={row} />
                  </td>
                  <td className={Styles.TableData}>
                    <ActionCell row={row} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {paginatedData.length ? startIndex + 1 : 0} to {endIndex} of {totalRows} entries
          {searchTerm && ` (filtered from ${data.length} total entries)`}
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
              if (totalPages <= 5) page = i + 1;
              else if (currentPage <= 3) page = i + 1;
              else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
              else page = currentPage - 2 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:bg-gray-100'
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
};

export default AllocationTable;
