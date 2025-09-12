import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import caregiversService from '../services/caregiversService';
import locationsService from '../services/locationService';

const initialFormState = {
  // Personal
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  // Address
  street: '',
  city: '',
  county: '',
  postcode: '',
  country: '',
  // Employment
  employeeId: '',
  locationId: '',
  startDate: '',
  employmentType: '',
  shiftPreference: '',
  // Professional
  qualificationLevel: '',
  yearsOfExperience: '',
  specializations: '',
  firstAidCprCertified: false,
  firstAidCprExpiry: '',
  // Security & Compliance (Right to work is optional)
  rightToWorkDocumentType: '',
  rightToWorkDocumentNumber: '',
  rightToWorkDocumentExpiry: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
  emergencyContactEmail: '',
  gdpr_dataProcessing: true,
  gdpr_employmentDataSharing: true,
  gdpr_emergencyContactSharing: true,
  gdpr_backgroundCheckConsent: true,
  gdpr_trainingRecordSharing: true,
  gdpr_consentGivenBy: '',
  gdpr_hasLegalAuthority: true,
  // System Access
  password: '',
  notes: '',
  biometricSetup: false,
};

// Helpers
const toISODate = (d) => {
  if (!d || typeof d !== 'string') return undefined;
  const iso = `${d}T00:00:00Z`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? undefined : dt.toISOString();
};
const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

function CareGiverRegForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [locations, setLocations] = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocLoading(true);
        setLocError('');
        const res = await locationsService.getAllLocations(false);
        setLocations(res || []);
      } catch (e) {
        setLocError('Failed to load locations');
      } finally {
        setLocLoading(false);
      }
    };
    loadLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Personal
    if (!data.firstName.trim()) errors.firstName = 'First Name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last Name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!emailRegex.test(data.email)) errors.email = 'Invalid email format';
    if (!data.password.trim()) errors.password = 'Password is required';
    else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!data.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!data.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!data.gender) errors.gender = 'Gender is required';

    // Address
    if (!data.street || !data.city || !data.postcode || !data.country) {
      errors.address = 'Street, City, Postcode and Country are required';
    }

    // Employment
    if (!data.locationId) errors.locationId = 'Location is required';
    if (!data.startDate) errors.startDate = 'Start date is required';
    if (!data.employmentType) errors.employmentType = 'Employment type is required';
    if (!data.shiftPreference) errors.shiftPreference = 'Shift preference is required';
    if (!data.qualificationLevel) errors.qualificationLevel = 'Qualification level is required';

    // Emergency Contact
    if (!data.emergencyContactName || !data.emergencyContactRelationship || !data.emergencyContactPhone) {
      errors.emergencyContact = 'Emergency contact (name, relationship, phone) is required';
    }

    // GDPR
    if (!data.gdpr_consentGivenBy) errors.gdpr_consentGivenBy = 'GDPR consent given by is required';

    // Dates sanity (avoid invalid time value)
    if (!toISODate(data.dateOfBirth)) errors.dateOfBirth = 'Provide a valid Date of Birth';
    if (!toISODate(data.startDate)) errors.startDate = 'Provide a valid Start Date';
    if (isFilled(data.firstAidCprExpiry) && !toISODate(data.firstAidCprExpiry)) {
      errors.firstAidCprExpiry = 'Provide a valid First Aid/CPR expiry date';
    }
    if (
      (isFilled(data.rightToWorkDocumentType) ||
        isFilled(data.rightToWorkDocumentNumber) ||
        isFilled(data.rightToWorkDocumentExpiry)) &&
      !toISODate(data.rightToWorkDocumentExpiry)
    ) {
      errors.rightToWorkDocumentExpiry = 'Provide a valid Right to Work expiry date';
    }

    return errors;
  };

  const buildPayload = (d) => {
    const specializations = d.specializations
      ? d.specializations.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      // Personal
      firstName: d.firstName.trim(),
      lastName: d.lastName.trim(),
      email: d.email.trim(),
      password: d.password,
      phoneNumber: d.phoneNumber.trim(),
      dateOfBirth: toISODate(d.dateOfBirth),
      gender: d.gender,

      // Address
      homeAddress: {
        street: d.street || '',
        city: d.city || '',
        county: d.county || '',
        postcode: d.postcode || '',
        country: d.country || '',
      },

      // Employment
      employeeId: isFilled(d.employeeId) ? d.employeeId : undefined,
      locationId: d.locationId,
      startDate: toISODate(d.startDate),
      employmentType: d.employmentType,
      shiftPreference: d.shiftPreference,
      additionalLocationAssignments: undefined,

      // Professional
      qualificationLevel: d.qualificationLevel,
      yearsOfExperience: isFilled(d.yearsOfExperience) ? Number(d.yearsOfExperience) : undefined,
      specializations,
      firstAidCprCertified: !!d.firstAidCprCertified,
      firstAidCprExpiry: isFilled(d.firstAidCprExpiry) ? toISODate(d.firstAidCprExpiry) : undefined,
      additionalCertifications: undefined,

      // Security & Compliance
      emergencyContact: {
        name: d.emergencyContactName,
        relationship: d.emergencyContactRelationship,
        phoneNumber: d.emergencyContactPhone,
        email: isFilled(d.emergencyContactEmail) ? d.emergencyContactEmail : undefined,
        address: undefined,
      },
      gdprConsent: {
        dataProcessing: !!d.gdpr_dataProcessing,
        employmentDataSharing: !!d.gdpr_employmentDataSharing,
        emergencyContactSharing: !!d.gdpr_emergencyContactSharing,
        backgroundCheckConsent: !!d.gdpr_backgroundCheckConsent,
        trainingRecordSharing: !!d.gdpr_trainingRecordSharing,
        consentGivenBy: d.gdpr_consentGivenBy,
        hasLegalAuthority: !!d.gdpr_hasLegalAuthority,
      },

      // Optional
      notes: isFilled(d.notes) ? d.notes : undefined,
    };

    // Only include Right to Work if fully provided
    const rtwFilled =
      isFilled(d.rightToWorkDocumentType) &&
      isFilled(d.rightToWorkDocumentNumber) &&
      isFilled(d.rightToWorkDocumentExpiry);

    if (rtwFilled) {
      payload.rightToWorkDocument = {
        documentType: d.rightToWorkDocumentType,
        documentNumber: d.rightToWorkDocumentNumber,
        expiryDate: toISODate(d.rightToWorkDocumentExpiry),
        issuingAuthority: undefined,
        notes: undefined,
      };
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((msg) => toast.error(msg, { position: 'top-right' }));
      return;
    }

    try {
      const payload = buildPayload(formData);
      await caregiversService.registerCaregiver(payload);
      toast.success('Caregiver registered successfully', { position: 'top-right' });
      // setFormData(initialFormState); // optionally reset
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const msg = status ? `Registration failed (HTTP ${status})` : (err?.message || 'Registration failed');
      toast.error(msg, { position: 'top-right' });
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    window.history.back();
  };

  return (
    <>
      <ToastContainer />
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
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Date of Birth
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Gender
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
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
                required={['street','city','postcode','country'].includes(field)}
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
              placeholder="Leave blank to auto-generate (if supported)"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Care Home (Location)
            {locLoading ? (
              <div className="mt-1 text-sm text-gray-500">Loading care homes…</div>
            ) : locError ? (
              <div className="mt-1 text-sm text-red-600">{locError}</div>
            ) : (
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Select a care home</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}
          </label>

          <label className="flex flex-col text-gray-600">
            Start Date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Employment Type
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select type</option>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="CASUAL">Casual</option>
            </select>
          </label>
          <label className="flex flex-col text-gray-600">
            Shift Preference
            <select
              name="shiftPreference"
              value={formData.shiftPreference}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select preference</option>
              <option value="ANY">Any</option>
              <option value="DAY">Day</option>
              <option value="NIGHT">Night</option>
              <option value="ROTATING">Rotating</option>
            </select>
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Professional Qualifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Qualification Level
            <select
              name="qualificationLevel"
              value={formData.qualificationLevel}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            >
              <option value="">Select level</option>
              <option value="NONE">None</option>
              <option value="BASIC_CARE">Basic Care</option>
              <option value="NVQ_LEVEL_2">NVQ Level 2</option>
              <option value="NVQ_LEVEL_3">NVQ Level 3</option>
              <option value="NVQ_LEVEL_4">NVQ Level 4</option>
              <option value="NVQ_LEVEL_5">NVQ Level 5</option>
              <option value="REGISTERED_NURSE">Registered Nurse</option>
              <option value="SENIOR_CARER">Senior Carer</option>
            </select>
          </label>
          <label className="flex flex-col text-gray-600">
            Years of Experience
            <input
              type="number"
              min="0"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
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
              placeholder="Comma-separated (e.g. Dementia care, Palliative care)"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-4">
            <input
              type="checkbox"
              name="firstAidCprCertified"
              checked={formData.firstAidCprCertified}
              onChange={handleChange}
              className="focus:ring-2 focus:ring-blue-600 rounded"
            />
            <span>First Aid / CPR Certification</span>
          </label>
          <label className="flex flex-col text-gray-600">
            First Aid/CPR Expiry (optional)
            <input
              type="date"
              name="firstAidCprExpiry"
              value={formData.firstAidCprExpiry}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Security & Compliance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Right to Work - Document Type (optional)
            <input
              type="text"
              name="rightToWorkDocumentType"
              value={formData.rightToWorkDocumentType}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Right to Work - Document Number (optional)
            <input
              type="text"
              name="rightToWorkDocumentNumber"
              value={formData.rightToWorkDocumentNumber}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Right to Work - Expiry (optional)
            <input
              type="date"
              name="rightToWorkDocumentExpiry"
              value={formData.rightToWorkDocumentExpiry}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <label className="flex flex-col text-gray-600">
            Emergency Contact - Name
            <input
              type="text"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Emergency Contact - Relationship
            <input
              type="text"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Emergency Contact - Phone
            <input
              type="text"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <label className="flex flex-col text-gray-600">
            Emergency Contact - Email (optional)
            <input
              type="email"
              name="emergencyContactEmail"
              value={formData.emergencyContactEmail}
              onChange={handleChange}
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <label className="flex flex-col text-gray-600">
            GDPR Consent Given By
            <input
              type="text"
              name="gdpr_consentGivenBy"
              value={formData.gdpr_consentGivenBy}
              onChange={handleChange}
              placeholder="Full name of consent giver"
              className="mt-1 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
            {[
              ['gdpr_dataProcessing','Data Processing'],
              ['gdpr_employmentDataSharing','Employment Data Sharing'],
              ['gdpr_emergencyContactSharing','Emergency Contact Sharing'],
              ['gdpr_backgroundCheckConsent','Background Check Consent'],
              ['gdpr_trainingRecordSharing','Training Record Sharing'],
              ['gdpr_hasLegalAuthority','Has Legal Authority'],
            ].map(([name,label]) => (
              <label key={name} className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  name={name}
                  checked={!!formData[name]}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-600 rounded"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">System Access</h2>
        <div className="grid grid-cols-1 md-grid-cols-3 gap-4">
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
            Notes (optional)
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
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