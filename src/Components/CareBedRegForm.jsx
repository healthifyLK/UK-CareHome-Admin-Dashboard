import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormState = {
  careHome: '',
  floorRoom: '',
  brand: '',
  model: '',
  condition: '', // 'new' or 'used'
};

function CareBedRegForm() {
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
    if (!data.careHome.trim()) errors.careHome = 'Care Home is required';
    if (!data.floorRoom.trim()) errors.floorRoom = 'Floor/Room is required';
    if (!data.brand.trim()) errors.brand = 'Brand is required';
    if (!data.model.trim()) errors.model = 'Model is required';
    if (!data.condition.trim()) errors.condition = 'Condition is required';
    else if (!['new', 'used'].includes(data.condition.toLowerCase())) errors.condition = 'Condition must be either "new" or "used"';
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

    // Proceed with submission logic here
    console.log('Care Bed Form submitted:', formData);
    toast.success('Care bed registered successfully!', { position: 'top-right' });
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    window.history.back();
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6 rounded shadow">
        <h2 className="text-2xl font-semibold text-blue-600">Care Bed Registration</h2>

        {[
          { label: 'Care Home', name: 'careHome', type: 'text' },
          { label: 'Floor / Room', name: 'floorRoom', type: 'text' },
          { label: 'Brand', name: 'brand', type: 'text' },
          { label: 'Model', name: 'model', type: 'text' }
        ].map(field => (
          <label key={field.name} className="flex flex-col text-gray-600">
            {field.label}
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors[field.name] && <span className="text-red-600 text-sm">{errors[field.name]}</span>}
          </label>
        ))}

        <label className="flex flex-col text-gray-600">
          Condition
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
          {errors.condition && <span className="text-red-600 text-sm">{errors.condition}</span>}
        </label>

        <div className="flex space-x-4 pt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Submit
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default CareBedRegForm;