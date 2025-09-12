import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormState = {
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  medicalRecordNumber: '',
  presentAddress: '',
  nationality: '',
  knownMedicalConditions: '',
  currentMedications: '',
  allergiesDietaryRestrictions: '',
  mobilityLevel: '',
  mentalHealthIllnesses: '',
  dnrStatus: false,
  gpDetails: '',
  careHomePlacement: '',
  careLevel: '',
  locationAssignment: '',
  accessibilityNeeds: '',
  specialEquipment: '',
  primaryContactName: '',
  primaryContactRelationship: '',
  primaryContactPhone: '',
  primaryContactEmail: '',
  secondaryContactDetails: '',
  legalGuardianDetails: '',
  wearableDevicePreferences: '',
  healthMonitoringConsent: false,
  dataSharingPermissions: false,
  admissionDate: '',
  admissionCareLevel: '',
  reasonForAdmission: '',
  expectedLengthOfStay: '',
  fundingSource: '',
};

function CareReceiverRegForm() {
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
    if (!data.dob) errors.dob = 'Date of birth is required';
    if (!data.gender) errors.gender = 'Gender is required';

    // You can add more validation rules here for required fields or formats

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) =>
        toast.error(msg, { position: 'top-right' })
      );
      return;
    }

    console.log('Form submitted successfully:', formData);
    toast.success('Registration successful!', { position: 'top-right' });
    // Add actual data submission logic here
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    window.history.back();
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-[100%] mx-auto p-6 space-y-6 rounded shadow">
        <h2 className="text-2xl font-semibold text-blue-600">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'First Name', name: 'firstName', type: 'text' },
            { label: 'Last Name', name: 'lastName', type: 'text' },
            { label: 'Date of Birth', name: 'dob', type: 'date' },
            {
              label: 'Gender',
              name: 'gender',
              type: 'select',
              options: ['Male', 'Female', 'Other', 'Prefer not to say'],
            },
            { label: 'Medical Record Number', name: 'medicalRecordNumber', type: 'text' },
            { label: 'Present Address', name: 'presentAddress', type: 'text' },
            { label: 'Nationality', name: 'nationality', type: 'text' },
          ].map((field) => (
            <label key={field.name} className="flex flex-col text-gray-600">
              {field.label}
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              )}
              {errors[field.name] && <span className="text-red-600 text-sm">{errors[field.name]}</span>}
            </label>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Medical Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: 'Known Medical Conditions',
              name: 'knownMedicalConditions',
              type: 'textarea',
            },
            {
              label: 'Current Medications',
              name: 'currentMedications',
              type: 'textarea',
            },
            {
              label: 'Allergies and Dietary Restrictions',
              name: 'allergiesDietaryRestrictions',
              type: 'textarea',
            },
            {
              label: 'Mobility Level',
              name: 'mobilityLevel',
              type: 'text',
            },
            {
              label: 'Mental Capacity / Known Mental Health Illnesses',
              name: 'mentalHealthIllnesses',
              type: 'text',
            },
            {
              label: 'Do Not Resuscitate (DNR) Status',
              name: 'dnrStatus',
              type: 'checkbox',
            },
            {
              label: 'GP Details',
              name: 'gpDetails',
              type: 'text',
            },
          ].map((field) =>
            field.type === 'textarea' ? (
              <label key={field.name} className="flex flex-col text-gray-600 col-span-1 md:col-span-2">
                {field.label}
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>
            ) : field.type === 'checkbox' ? (
              <label key={field.name} className="flex items-center space-x-2 text-gray-600 mt-6">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-600 rounded"
                />
                <span>{field.label}</span>
              </label>
            ) : (
              <label key={field.name} className="flex flex-col text-gray-600">
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>
            )
          )}
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Care Home Placement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Care Level', name: 'careLevel', type: 'text' },
            { label: 'Location / Care Home Assignment', name: 'locationAssignment', type: 'text' },
            { label: 'Accessibility Needs', name: 'accessibilityNeeds', type: 'text' },
            { label: 'Special Equipment / Other Requirements', name: 'specialEquipment', type: 'text' },
          ].map((field) => (
            <label key={field.name} className="flex flex-col text-gray-600">
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Primary Contact Name', name: 'primaryContactName', type: 'text' },
            { label: 'Primary Contact Relationship', name: 'primaryContactRelationship', type: 'text' },
            { label: 'Primary Contact Phone', name: 'primaryContactPhone', type: 'tel' },
            { label: 'Primary Contact Email', name: 'primaryContactEmail', type: 'email' },
            { label: 'Secondary Contact Details', name: 'secondaryContactDetails', type: 'text' },
            { label: 'Legal Guardian / Power of Attorney Details', name: 'legalGuardianDetails', type: 'text' },
          ].map((field) => (
            <label key={field.name} className="flex flex-col text-gray-600">
              {field.label}
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </label>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Device Preferences & Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              label: 'Wearable Device Preferences',
              name: 'wearableDevicePreferences',
              type: 'text',
            },
            {
              label: 'Health Monitoring Consent',
              name: 'healthMonitoringConsent',
              type: 'checkbox',
            },
            {
              label: 'Data Sharing Permissions',
              name: 'dataSharingPermissions',
              type: 'checkbox',
            },
          ].map((field) =>
            field.type === 'checkbox' ? (
              <label key={field.name} className="flex items-center space-x-2 text-gray-600 mt-6">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-600 rounded"
                />
                <span>{field.label}</span>
              </label>
            ) : (
              <label key={field.name} className="flex flex-col text-gray-600">
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>
            )
          )}
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Care Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Admission Date', name: 'admissionDate', type: 'date' },
            {
              label: 'Care Level',
              name: 'admissionCareLevel',
              type: 'select',
              options: ['Low', 'Medium', 'High', 'Critical'],
            },
            { label: 'Reason for Admission', name: 'reasonForAdmission', type: 'text' },
            { label: 'Expected Length of Stay', name: 'expectedLengthOfStay', type: 'text' },
            {
              label: 'Funding Source',
              name: 'fundingSource',
              type: 'select',
              options: ['NHS', 'Private', 'Social Services'],
            },
          ].map((field) =>
            field.type === 'select' ? (
              <label key={field.name} className="flex flex-col text-gray-600">
                {field.label}
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label key={field.name} className="flex flex-col text-gray-600">
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </label>
            )
          )}
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

export default CareReceiverRegForm;
