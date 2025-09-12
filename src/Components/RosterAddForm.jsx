import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormState = {
  caregiverId: '',
  day: '',
  type: '', // FULL_DAY, MORNING, EVENING, NIGHT
  status: '', // PUBLISHED, DRAFT, CANCELLED
};

function RosterAddForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};

    if (!data.caregiverId.trim()) errors.caregiverId = 'Caregiver ID is required';
    if (!data.day) errors.day = 'Day is required';
    if (!data.type) errors.type = 'Type is required';
    else if (!['FULL_DAY', 'MORNING', 'EVENING', 'NIGHT'].includes(data.type))
      errors.type = 'Type must be FULL_DAY, MORNING, EVENING, or NIGHT';
    if (!data.status) errors.status = 'Status is required';
    else if (!['PUBLISHED', 'DRAFT', 'CANCELLED'].includes(data.status))
      errors.status = 'Status must be PUBLISHED, DRAFT, or CANCELLED';

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(msg =>
        toast.error(msg, { position: 'top-right' })
      );
      return;
    }

    console.log('Roster form submitted:', formData);
    toast.success('Roster entry added successfully!', { position: 'top-right' });
    // Add backend submission here
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    window.history.back();
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold text-blue-600">Add Roster Entry</h2>

        <label className="flex flex-col text-gray-600">
          Caregiver ID
          <input
            type="text"
            name="caregiverId"
            value={formData.caregiverId}
            onChange={handleChange}
            className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {errors.caregiverId && <span className="text-red-600 text-sm">{errors.caregiverId}</span>}
        </label>

        <label className="flex flex-col text-gray-600">
          Day
          <input
            type="date"
            name="day"
            value={formData.day}
            onChange={handleChange}
            className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {errors.day && <span className="text-red-600 text-sm">{errors.day}</span>}
        </label>

        <label className="flex flex-col text-gray-600">
          Type
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select type</option>
            <option value="FULL_DAY">FULL_DAY</option>
            <option value="MORNING">MORNING</option>
            <option value="EVENING">EVENING</option>
            <option value="NIGHT">NIGHT</option>
          </select>
          {errors.type && <span className="text-red-600 text-sm">{errors.type}</span>}
        </label>

        <label className="flex flex-col text-gray-600">
          Status
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select status</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          {errors.status && <span className="text-red-600 text-sm">{errors.status}</span>}
        </label>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default RosterAddForm;

