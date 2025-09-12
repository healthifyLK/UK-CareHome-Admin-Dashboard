import React, { useState } from 'react';
import { Styles } from '../Styles/Styles';
import BackButton from '../Components/BackButton';
import UpdateBtn from '../Components/UpdateBtn';
import { useLocation } from 'react-router-dom';

function CareGiver() {
  const location = useLocation();
  const initialData = location.state || {};

  // Track edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Form state initialized from existing data with defaults
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    dob: initialData.dob || '',
    gender: initialData.gender || '',
    street: initialData.street || '',
    city: initialData.city || '',
    county: initialData.county || '',
    postcode: initialData.postcode || '',
    country: initialData.country || '',

    // Employment Information
    employeeId: initialData.employeeId || '',
    locationAssignments: initialData.locationAssignments || '',
    startDate: initialData.startDate || '',
    employmentType: initialData.employmentType || '',
    shiftPreferences: initialData.shiftPreferences || '',

    // Professional Qualifications
    nursingQualifications: initialData.nursingQualifications || '',
    yearsExperience: initialData.yearsExperience || '',
    specializations: initialData.specializations || '',
    firstAidCertification: initialData.firstAidCertification || false,

    // Security & Compliance
    rightToWorkDocs: initialData.rightToWorkDocs || '',
    emergencyContactInfo: initialData.emergencyContactInfo || '',

    // System Access
    password: '',  // Usually empty for security reasons
    biometricSetup: initialData.biometricSetup || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Toggle editing mode
  const toggleEditing = () => {
    if (isEditing) {
      // On done editing, here you could add validation and submit updated data
      // For now, just toggling off editing
    }
    setIsEditing(!isEditing);
  };

  // Helper to display value or a placeholder
  const displayValue = (field) => {
    const val = formData[field];
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return val || <span className="text-gray-400 italic">Not provided</span>;
  };

  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <BackButton />
        <button
          onClick={toggleEditing}
          className={`px-4 py-2 font-medium rounded ${
            isEditing ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? 'Done' : 'Update'}
        </button>
      </div>

      <div className="overflow-y-auto p-6 space-y-8 max-h-[80vh]">
        {/* Personal Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'First Name', name: 'firstName' },
              { label: 'Last Name', name: 'lastName' },
              { label: 'Email Address', name: 'email' },
              { label: 'Phone Number', name: 'phone' },
              { label: 'Date of Birth', name: 'dob', type: 'date' },
              {
                label: 'Gender',
                name: 'gender',
                type: 'select',
                options: ['Male', 'Female', 'Other', 'Prefer not to say'],
              },
              { label: 'Street', name: 'street' },
              { label: 'City', name: 'city' },
              { label: 'County', name: 'county' },
              { label: 'Postcode', name: 'postcode' },
              { label: 'Country', name: 'country' },
            ].map(({ label, name, type, options }) => (
              <div key={name} className="flex flex-col text-gray-700">
                <label className="font-medium mb-1">{label}</label>
                {isEditing ? (
                  type === 'select' ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    >
                      <option value="">Select {label}</option>
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type || 'text'}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    />
                  )
                ) : (
                  <p>{displayValue(name)}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Employment Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Employment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Employee ID', name: 'employeeId' },
              { label: 'Location Assignments', name: 'locationAssignments' },
              { label: 'Start Date', name: 'startDate', type: 'date' },
              {
                label: 'Employment Type',
                name: 'employmentType',
                type: 'select',
                options: ['Full-time', 'Part-time', 'Contract'],
              },
              {
                label: 'Shift Preferences',
                name: 'shiftPreferences',
                type: 'select',
                options: ['Any', 'Day', 'Night'],
              },
            ].map(({ label, name, type, options }) => (
              <div key={name} className="flex flex-col text-gray-700">
                <label className="font-medium mb-1">{label}</label>
                {isEditing ? (
                  type === 'select' ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    >
                      <option value="">Select {label}</option>
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type || 'text'}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    />
                  )
                ) : (
                  <p>{displayValue(name)}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Professional Qualifications */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Professional Qualifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Nursing/Care Qualifications', name: 'nursingQualifications' },
              { label: 'Years of Experience', name: 'yearsExperience', type: 'number' },
              { label: 'Specializations', name: 'specializations' },
              { label: 'First Aid/CPR Certification', name: 'firstAidCertification', type: 'checkbox' },
            ].map(({ label, name, type }) => (
              <div key={name} className={`flex flex-col text-gray-700 ${type === 'checkbox' ? 'flex-row items-center gap-2' : ''}`}>
                <label className={`font-medium mb-1 ${type === 'checkbox' ? 'mb-0' : ''}`}>{label}</label>
                {isEditing ? (
                  type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleChange}
                      className="rounded"
                    />
                  ) : (
                    <input
                      type={type || 'text'}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    />
                  )
                ) : (
                  <p>{type === 'checkbox' ? (formData[name] ? 'Yes' : 'No') : displayValue(name)}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Security & Compliance */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Security & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Right to Work Documentation', name: 'rightToWorkDocs' },
              { label: 'Emergency Contact Information', name: 'emergencyContactInfo' },
            ].map(({ label, name }) => (
              <div key={name} className="flex flex-col text-gray-700">
                <label className="font-medium mb-1">{label}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="border border-gray-400 rounded px-3 py-1"
                  />
                ) : (
                  <p>{displayValue(name)}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* System Access */}
        <section>
          <h2 className="text-xl font-semibold mb-4">System Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col text-gray-700">
              <label className="font-medium mb-1">Password creation</label>
              {isEditing ? (
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-400 rounded px-3 py-1"
                />
              ) : (
                <p>********</p>
              )}
            </div>
            <div className="flex flex-col text-gray-700">
              <label className="font-medium mb-1">Location Assignments</label>
              {isEditing ? (
                <input
                  type="text"
                  name="locationAssignments"
                  value={formData.locationAssignments}
                  onChange={handleChange}
                  className="border border-gray-400 rounded px-3 py-1"
                />
              ) : (
                <p>{displayValue('locationAssignments')}</p>
              )}
            </div>
            <div className="flex flex-col text-gray-700 items-center">
              <label className="font-medium mb-1">Biometric Setup (future)</label>
              {isEditing ? (
                <input
                  type="checkbox"
                  name="biometricSetup"
                  checked={formData.biometricSetup}
                  onChange={handleChange}
                  className="rounded"
                />
              ) : (
                <p>{formData.biometricSetup ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CareGiver;