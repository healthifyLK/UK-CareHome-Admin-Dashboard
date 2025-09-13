import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import locationsService from "../services/locationService";

// helpers
const isFilled = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "";
const toInt = (v) => {
  if (!isFilled(v)) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

function CareHomeAddForm() {
  // Align with backend CreateLocationDto + keep a few UI helpers
  const initialFormState = {
    // backend required
    name: "",
    address: "",
    // backend optional
    city: "",
    postcode: "",
    phoneNumber: "",
    email: "",
    numberOfRooms: "",
    bedsPerRoom: "",
    capacity: "",
    isActive: true,
    // UI helpers
    tagName: "",
    // optional structured settings
    settings_note: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper to auto-calculate capacity
  const autoCalculateCapacity = (fields) => {
    const numRooms = toInt(fields.numberOfRooms);
    const bedsRoom = toInt(fields.bedsPerRoom);
    if (numRooms && bedsRoom) {
      return numRooms * bedsRoom;
    }
    return "";
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      // Auto-calculate capacity if numberOfRooms or bedsPerRoom changes
      if (name === "numberOfRooms" || name === "bedsPerRoom") {
        updated.capacity = autoCalculateCapacity(updated);
      }
      return updated;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = (f) => {
    const errs = {};
    
    // Required fields
    if (!isFilled(f.name)) errs.name = "Name is required";
    if (!isFilled(f.address)) errs.address = "Address is required";
    
    // Email validation
    if (isFilled(f.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      errs.email = "Invalid email format";
    }
    
    // Numeric validations
    if (isFilled(f.numberOfRooms)) {
      const num = toInt(f.numberOfRooms);
      if (!num) {
        errs.numberOfRooms = "Number of rooms must be a valid number";
      } else if (num < 1) {
        errs.numberOfRooms = "Number of rooms must be at least 1";
      }
    }
    
    if (isFilled(f.bedsPerRoom)) {
      const num = toInt(f.bedsPerRoom);
      if (!num) {
        errs.bedsPerRoom = "Beds per room must be a valid number";
      } else if (num < 1 || num > 26) {
        errs.bedsPerRoom = "Beds per room must be between 1 and 26";
      }
    }
    
    if (isFilled(f.capacity)) {
      const num = toInt(f.capacity);
      if (!num) {
        errs.capacity = "Capacity must be a valid number";
      } else if (num < 0) {
        errs.capacity = "Capacity cannot be negative";
      }
    }
    
    return errs;
  };

  const buildPayload = (f) => {
    const payload = {
      name: f.name.trim(),
      address: f.address.trim(),
      isActive: !!f.isActive,
      settings: {}, // Always include settings as empty object
    };

    // Only add optional fields if they have values
    if (f.city && f.city.trim()) {
      payload.city = f.city.trim();
    }
    if (f.postcode && f.postcode.trim()) {
      payload.postcode = f.postcode.trim();
    }
    if (f.phoneNumber && f.phoneNumber.trim()) {
      payload.phoneNumber = f.phoneNumber.trim();
    }
    if (f.email && f.email.trim()) {
      payload.email = f.email.trim();
    }
    
    // Numeric fields - ensure they are proper numbers
    if (f.numberOfRooms && f.numberOfRooms !== '') {
      const num = parseInt(f.numberOfRooms);
      if (!isNaN(num) && num > 0) {
        payload.numberOfRooms = num;
      }
    }
    if (f.bedsPerRoom && f.bedsPerRoom !== '') {
      const num = parseInt(f.bedsPerRoom);
      if (!isNaN(num) && num > 0 && num <= 26) {
        payload.bedsPerRoom = num;
      }
    }
    if (f.capacity && f.capacity !== '') {
      const num = parseInt(f.capacity);
      if (!isNaN(num) && num >= 0) {
        payload.capacity = num;
      }
    }

    // Only add settings if there's meaningful content
    if ((f.tagName && f.tagName.trim()) || (f.settings_note && f.settings_note.trim())) {
      if (f.tagName && f.tagName.trim()) {
        payload.settings.tagName = f.tagName.trim();
      }
      if (f.settings_note && f.settings_note.trim()) {
        payload.settings.note = f.settings_note.trim();
      }
    }

    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('=== FORM SUBMISSION STARTED ===');
    
    const errs = validate(form);
    
    if (Object.keys(errs).length) {
      console.log('Validation errors:', errs);
      setErrors(errs);
      Object.values(errs).forEach((m) => toast.error(m));
      return;
    }
    
    try {
      setSubmitting(true);
      setErrors({});
      
      const payload = buildPayload(form);
      console.log('=== PAYLOAD BUILT ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      
      console.log('=== CALLING API ===');
      const result = await locationsService.createLocation(payload);
      console.log('=== API CALL SUCCESSFUL ===');
      console.log('Result:', result);
      
      // Show success toast immediately
      toast.success("🎉 Care Home created successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form
      setForm(initialFormState);
      console.log('=== FORM RESET ===');
      
    } catch (err) {
      console.log('=== API CALL FAILED ===');
      console.error('Error object:', err);
      console.error('Error message:', err?.message);
      console.error('Error status:', err?.status);
      console.error('Error response:', err?.response);
      
      const status = err?.status || err?.response?.status;
      let errorMessage = "Failed to create care home";
      
      if (status === 400) {
        errorMessage = "Invalid data provided. Please check your input.";
      } else if (status === 401) {
        errorMessage = "Authentication required. Please log in.";
      } else if (status === 403) {
        errorMessage = "Insufficient permissions. Contact administrator.";
      } else if (status === 409) {
        errorMessage = "A care home with this name already exists.";
      } else if (status) {
        errorMessage = `Server error (HTTP ${status})`;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitting(false);
      console.log('=== FORM SUBMISSION COMPLETED ===');
    }
  };

  const onCancel = () => {
    setForm(initialFormState);
    setErrors({});
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
      <form
        onSubmit={onSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6"
      >
        <h2 className="text-2xl font-semibold text-blue-600 mb-2">
          Add Care Home (Location)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-700">
            Name*
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              className={`mt-1 border rounded px-3 py-2 ${
                errors.name ? 'border-red-500' : 'border-gray-500'
              }`}
              required
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </label>

          <label className="flex flex-col text-gray-700">
            Address* (street and number)
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={onChange}
              className={`mt-1 border rounded px-3 py-2 ${
                errors.address ? 'border-red-500' : 'border-gray-500'
              }`}
              required
            />
            {errors.address && <span className="text-red-500 text-sm mt-1">{errors.address}</span>}
          </label>

          <label className="flex flex-col text-gray-700">
            City
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Postcode
            <input
              type="text"
              name="postcode"
              value={form.postcode}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Phone Number
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
            />
          </label>

          <label className="flex flex-col text-gray-700">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className={`mt-1 border rounded px-3 py-2 ${
                errors.email ? 'border-red-500' : 'border-gray-500'
              }`}
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
          </label>

          <label className="flex flex-col text-gray-700">
            Number of Rooms
            <input
              type="number"
              min="1"
              name="numberOfRooms"
              value={form.numberOfRooms}
              onChange={onChange}
              className={`mt-1 border rounded px-3 py-2 ${
                errors.numberOfRooms ? 'border-red-500' : 'border-gray-500'
              }`}
              placeholder="e.g. 20"
            />
            {errors.numberOfRooms && <span className="text-red-500 text-sm mt-1">{errors.numberOfRooms}</span>}
          </label>

          <label className="flex flex-col text-gray-700">
            Beds Per Room (1-26)
            <input
              type="number"
              min="1"
              max="26"
              name="bedsPerRoom"
              value={form.bedsPerRoom}
              onChange={onChange}
              className={`mt-1 border rounded px-3 py-2 ${
                errors.bedsPerRoom ? 'border-red-500' : 'border-gray-500'
              }`}
              placeholder="e.g. 2"
            />
            {errors.bedsPerRoom && <span className="text-red-500 text-sm mt-1">{errors.bedsPerRoom}</span>}
          </label>

          <label className="flex flex-col text-gray-700">
            Capacity 
            <input
              type="number"
              min="0"
              name="capacity"
              value={form.capacity}
              onChange={onChange}
              className={`mt-1 border rounded px-3 py-2 ${
                errors.capacity ? 'border-red-500' : 'border-gray-500'
              }`}
              placeholder="Auto-calculated or enter manually"
            />
            {errors.capacity && <span className="text-red-500 text-sm mt-1">{errors.capacity}</span>}
            {form.capacity && (
              <span className="text-sm text-gray-500 mt-1">
                Auto-calculated: {form.numberOfRooms && form.bedsPerRoom ? 
                  `${form.numberOfRooms} × ${form.bedsPerRoom} = ${form.numberOfRooms * form.bedsPerRoom}` : 
                  'Enter number of rooms and beds per room to auto-calculate'
                }
              </span>
            )}
          </label>

          <label className="flex items-center gap-3 text-gray-700 mt-6">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={onChange}
              className="h-5 w-5"
            />
            <span>Active</span>
          </label>
        </div>

        <h3 className="text-lg font-semibold text-gray-700">
          Optional Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-700">
            Tag/Identifier (optional)
            <input
              type="text"
              name="tagName"
              value={form.tagName}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="Internal code"
            />
          </label>

          <label className="flex flex-col text-gray-700 md:col-span-2">
            Settings note (optional)
            <input
              type="text"
              name="settings_note"
              value={form.settings_note}
              onChange={onChange}
              className="mt-1 border border-gray-500 rounded px-3 py-2"
              placeholder="Any additional info"
            />
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Add Care Home"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default CareHomeAddForm;