import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  street: '',
  city: '',
  county: '',
  postcode: '',
  country: '',
  employeeId: '',
  locations: '',
  startDate: '',
  employmentType: '',
  shiftPreferences: '',
  nursingQualifications: '',
  yearsExperience: '',
  specializations: '',
  firstAidCertification: false,
  rightToWorkDocs: '',
  emergencyContact: '',
  password: '',
  biometricSetup: false,
};

function CareGiverRegForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName.trim()) errors.firstName = 'First Name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last Name is required';
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) errors.email = 'Invalid email format';
    }
    if (!data.password.trim()) errors.password = 'Password is required';
    else if (data.password.length < 6) errors.password = 'Password must be at least 6 characters long';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) => toast.error(msg, {position: 'top-right'}));
      return;
    }

    // Form is valid - submit data here (e.g., API call)
    console.log('Form submitted successfully:', formData);
    toast.success('Registration successful!', { position: 'top-right' });
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    window.history.back();
  };


  return (
    <>
      <ToastContainer/>
      <form onSubmit={handleSubmit} className="w-[100%] mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-blue-600">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            First Name
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Last Name
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Phone Number
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Date of Birth
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Gender
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Home Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['street','city','county','postcode','country'].map(field => (
            <label key={field} className="flex flex-col text-gray-600">
              {field.charAt(0).toUpperCase() + field.slice(1)}
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Employment Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Employee ID
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Location Assignment
            <input
              type="text"
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              placeholder="Single or multiple locations separated by commas"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Employment Type
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </label>
          <label className="flex flex-col text-gray-600">
            Shift Preferences
            <select
              name="shiftPreferences"
              value={formData.shiftPreferences}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select preference</option>
              <option>Any</option>
              <option>Day</option>
              <option>Night</option>
            </select>
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Professional Qualifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Nursing/Care Qualifications
            <input
              type="text"
              name="nursingQualifications"
              value={formData.nursingQualifications}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Years of Experience
            <input
              type="number"
              min="0"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Specializations
            <input
              type="text"
              name="specializations"
              value={formData.specializations}
              onChange={handleChange}
              placeholder="e.g. Dementia care"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-4">
            <input
              type="checkbox"
              name="firstAidCertification"
              checked={formData.firstAidCertification}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-blue-600 rounded"
            />
            <span>First Aid / CPR Certification</span>
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Security & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-gray-600">
            Right to Work Documentation
            <input
              type="text"
              name="rightToWorkDocs"
              value={formData.rightToWorkDocs}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Emergency Contact Information
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">System Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Location Assignments
            <input
              type="text"
              name="locations"
              value={formData.locations}
              onChange={handleChange}
              placeholder="Single or multiple locations"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-6">
            <input
              type="checkbox"
              name="biometricSetup"
              checked={formData.biometricSetup}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-blue-600 rounded"
            />
            <span>Biometric Setup (future)</span>
          </label>
        </div>

        {/* Buttons */}
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

export default CareGiverRegForm;