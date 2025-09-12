import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BackButton from '../Components/BackButton';
import { Styles } from '../Styles/Styles';

function CareReceiver() {
  const location = useLocation();
  const initialData = location.state || {};

  const [isEditing, setIsEditing] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    dob: initialData.dob || '',
    gender: initialData.gender || '',
    medicalRecordNumber: initialData.medicalRecordNumber || '',
    presentAddress: initialData.presentAddress || '',
    nationality: initialData.nationality || '',

    knownMedicalConditions: initialData.knownMedicalConditions || '',
    currentMedications: initialData.currentMedications || '',
    allergiesDietaryRestrictions: initialData.allergiesDietaryRestrictions || '',
    mobilityLevel: initialData.mobilityLevel || '',
    mentalHealthIllnesses: initialData.mentalHealthIllnesses || '',
    dnrStatus: initialData.dnrStatus || false,
    gpDetails: initialData.gpDetails || '',

    careLevel: initialData.careLevel || '',
    locationAssignment: initialData.locationAssignment || '',
    accessibilityNeeds: initialData.accessibilityNeeds || '',
    specialEquipment: initialData.specialEquipment || '',

    primaryContactName: initialData.primaryContactName || '',
    primaryContactRelationship: initialData.primaryContactRelationship || '',
    primaryContactPhone: initialData.primaryContactPhone || '',
    primaryContactEmail: initialData.primaryContactEmail || '',
    secondaryContactDetails: initialData.secondaryContactDetails || '',
    legalGuardianDetails: initialData.legalGuardianDetails || '',

    wearableDevicePreferences: initialData.wearableDevicePreferences || '',
    healthMonitoringConsent: initialData.healthMonitoringConsent || false,
    dataSharingPermissions: initialData.dataSharingPermissions || false,

    admissionDate: initialData.admissionDate || '',
    admissionCareLevel: initialData.admissionCareLevel || '',
    reasonForAdmission: initialData.reasonForAdmission || '',
    expectedLengthOfStay: initialData.expectedLengthOfStay || '',
    fundingSource: initialData.fundingSource || '',
    carePlanSummary: initialData.carePlanSummary || '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleEdit = () => setIsEditing(prev => !prev);

  const toggleShowMore = () => setShowMore(prev => !prev);

  const displayValue = (val) => {
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return val || <span className="text-gray-400 italic">Not provided</span>;
  };

  // Overlay component for Show More
  const MoreOverlay = () => (
    <div className="fixed inset-0 bg-[#00000055] bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-y-auto">
      <div className="bg-white rounded p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={toggleShowMore}
        >
          Close ✕
        </button>
        <h3 className="text-xl font-semibold mb-4">More Details</h3>
        {/* Render extensive read-only details here */}
        <section className="space-y-4">
          <h4 className="font-semibold">Personal Information</h4>
          <p>{formData.firstName} {formData.lastName}</p>
          <p>Medical Record Number: {displayValue(formData.medicalRecordNumber)}</p>
          <p>Admission Date: {displayValue(formData.admissionDate)}</p>
          <p>Discharge Date: {displayValue(initialData.dischargeDate || '')}</p>
          <p>Location, Room, Bed: {displayValue(formData.locationAssignment)}</p>
          <p>Contact Preferences: {displayValue(initialData.contactPreferences || '')}</p>
        </section>

        <section className="space-y-4 mt-6">
          <h4 className="font-semibold">Medical Overview</h4>
          <p>Current Care Level: {displayValue(formData.admissionCareLevel)}</p>
          <p>Known Medical Conditions: {displayValue(formData.knownMedicalConditions)}</p>
          <p>Medication Regimen: {displayValue(formData.currentMedications)}</p>
          <p>Allergies/Dietary Restrictions: {displayValue(formData.allergiesDietaryRestrictions)}</p>
        </section>

        <section className="space-y-4 mt-6">
          <h4 className="font-semibold">Care Team</h4>
          <p>Assigned Caregivers: {displayValue(initialData.assignedCaregivers || '')}</p>
          <p>Current Care Status: {displayValue(initialData.currentCareStatus || '')}</p>
          <p>Assignment History: {displayValue(initialData.assignmentHistory || '')}</p>
        </section>

        <section className="space-y-4 mt-6">
          <h4 className="font-semibold">Health Monitoring</h4>
          <p>Recent Vitals: {displayValue(initialData.recentVitals || '')}</p>
          <p>Health Alerts & Trends: {displayValue(initialData.healthAlerts || '')}</p>
          <p>Care Activities: {displayValue(initialData.careActivities || '')}</p>
          <p>Meal/Diet Plan: {displayValue(initialData.mealPlan || '')}</p>
          <p>Incident Reports: {displayValue(initialData.incidentReports || '')}</p>
        </section>

        <section className="space-y-4 mt-6">
          <h4 className="font-semibold">Emergency Information</h4>
          <p>Emergency Contacts: {displayValue(formData.primaryContactName)}</p>
          <p>DNR Status: {displayValue(formData.dnrStatus)}</p>
          <p>Crisis Contact Protocols: {displayValue(initialData.crisisContactProtocols || '')}</p>
        </section>

        <section className="space-y-4 mt-6">
          <h4 className="font-semibold">Communication</h4>
          <p>Recent Communications: {displayValue(initialData.recentCommunications || '')}</p>
          <p>Care Plan Meetings: {displayValue(initialData.carePlanMeetingNotes || '')}</p>
        </section>

        <section className="space-y-4 mt-6">
          <h4 className="font-semibold">Technology Integration</h4>
          <p>Connected Devices: {displayValue(initialData.connectedDevices || '')}</p>
          <p>Health Data Sync Info: {displayValue(initialData.healthDataSyncInfo || '')}</p>
          <p>Alert Thresholds: {displayValue(initialData.alertThresholds || '')}</p>
        </section>
      </div>
    </div>
  );

  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <BackButton />
        <button
          onClick={toggleEdit}
          className={`px-4 py-2 font-medium rounded ${
            isEditing ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? 'Done' : 'Update'}
        </button>
        <button
          onClick={toggleShowMore}
          className="ml-4 px-4 py-2 font-medium rounded bg-gray-300 hover:bg-gray-400"
        >
          {showMore ? 'Hide More' : 'Show More'}
        </button>
      </div>

      <div className="overflow-y-auto p-6 space-y-8 max-h-[80vh]">
        {/* Personal Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First name */}
            <Field label="First Name" name="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Last Name" name="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Date of Birth" name="dob" type="date" value={formData.dob} isEditing={isEditing} onChange={handleChange} />
            <SelectField
              label="Gender"
              name="gender"
              options={['Male', 'Female', 'Other', 'Prefer not to say']}
              value={formData.gender}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Medical Record Number" name="medicalRecordNumber" value={formData.medicalRecordNumber} isEditing={isEditing} onChange={handleChange} />
            <Field label="Present Address" name="presentAddress" value={formData.presentAddress} isEditing={isEditing} onChange={handleChange} />
            <Field label="Nationality" name="nationality" value={formData.nationality} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Medical Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextAreaField label="Known Medical Conditions" name="knownMedicalConditions" value={formData.knownMedicalConditions} isEditing={isEditing} onChange={handleChange} />
            <TextAreaField label="Current Medications" name="currentMedications" value={formData.currentMedications} isEditing={isEditing} onChange={handleChange} />
            <TextAreaField label="Allergies and Dietary Restrictions" name="allergiesDietaryRestrictions" value={formData.allergiesDietaryRestrictions} isEditing={isEditing} onChange={handleChange} />
            <Field label="Mobility Level" name="mobilityLevel" value={formData.mobilityLevel} isEditing={isEditing} onChange={handleChange} />
            <Field label="Mental Capacity / Known Mental Health Illnesses" name="mentalHealthIllnesses" value={formData.mentalHealthIllnesses} isEditing={isEditing} onChange={handleChange} />
            <CheckboxField label="Do Not Resuscitate (DNR) Status" name="dnrStatus" checked={formData.dnrStatus} isEditing={isEditing} onChange={handleChange} />
            <Field label="GP Details" name="gpDetails" value={formData.gpDetails} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Care Home Placement */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Care Home Placement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Care Level" name="careLevel" value={formData.careLevel} isEditing={isEditing} onChange={handleChange} />
            <Field label="Location / Care Home Assignment" name="locationAssignment" value={formData.locationAssignment} isEditing={isEditing} onChange={handleChange} />
            <Field label="Accessibility Needs" name="accessibilityNeeds" value={formData.accessibilityNeeds} isEditing={isEditing} onChange={handleChange} />
            <Field label="Special Equipment / Other Requirements" name="specialEquipment" value={formData.specialEquipment} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Emergency Contacts */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Primary Contact Name" name="primaryContactName" value={formData.primaryContactName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Primary Contact Relationship" name="primaryContactRelationship" value={formData.primaryContactRelationship} isEditing={isEditing} onChange={handleChange} />
            <Field label="Primary Contact Phone" name="primaryContactPhone" value={formData.primaryContactPhone} isEditing={isEditing} onChange={handleChange} />
            <Field label="Primary Contact Email" name="primaryContactEmail" value={formData.primaryContactEmail} isEditing={isEditing} onChange={handleChange} />
            <Field label="Secondary Contact Details" name="secondaryContactDetails" value={formData.secondaryContactDetails} isEditing={isEditing} onChange={handleChange} />
            <Field label="Legal Guardian / Power of Attorney Details" name="legalGuardianDetails" value={formData.legalGuardianDetails} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Device Preferences & Permissions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Device Preferences & Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Wearable Device Preferences" name="wearableDevicePreferences" value={formData.wearableDevicePreferences} isEditing={isEditing} onChange={handleChange} />
            <CheckboxField label="Health Monitoring Consent" name="healthMonitoringConsent" checked={formData.healthMonitoringConsent} isEditing={isEditing} onChange={handleChange} />
            <CheckboxField label="Data Sharing Permissions" name="dataSharingPermissions" checked={formData.dataSharingPermissions} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Care Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Care Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} isEditing={isEditing} onChange={handleChange} />
            <SelectField
              label="Care Level"
              name="admissionCareLevel"
              options={['Low', 'Medium', 'High', 'Critical']}
              value={formData.admissionCareLevel}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Reason for Admission" name="reasonForAdmission" value={formData.reasonForAdmission} isEditing={isEditing} onChange={handleChange} />
            <Field label="Expected Length of Stay" name="expectedLengthOfStay" value={formData.expectedLengthOfStay} isEditing={isEditing} onChange={handleChange} />
            <SelectField
              label="Funding Source"
              name="fundingSource"
              options={['NHS', 'Private', 'Social Services']}
              value={formData.fundingSource}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Care Plan Summary" name="carePlanSummary" value={formData.carePlanSummary} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>
      </div>

      {showMore && <MoreOverlay />}
    </div>
  );
}

// Reusable Field Components for inputs and selects for cleaner code
const Field = ({ label, name, value, onChange, isEditing, type='text' }) => (
  <div className="flex flex-col text-gray-700">
    <label className="font-medium mb-1">{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-400 rounded px-3 py-1"
        // do NOT add {...props} or isEditing here
      />
    ) : (
      <p>{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    )}
  </div>
);

const TextAreaField = ({ label, name, value, onChange, isEditing }) => (
  <div className="flex flex-col text-gray-700 col-span-1 md:col-span-2">
    <label className="font-medium mb-1">{label}</label>
    {isEditing ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="border border-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
    ) : (
      <p>{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    )}
  </div>
);

const SelectField = ({ label, name, value, onChange, isEditing, options }) => (
  <div className="flex flex-col text-gray-700">
    <label className="font-medium mb-1">{label}</label>
    {isEditing ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-400 rounded px-3 py-1"
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <p>{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    )}
  </div>
);

const CheckboxField = ({ label, name, checked, onChange, isEditing }) => (
  <div className="flex items-center gap-2 text-gray-700">
    {isEditing ? (
      <>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="rounded" />
        <label className="font-medium">{label}</label>
      </>
    ) : (
      <p>{checked ? 'Yes' : 'No'}</p>
    )}
  </div>
);

export default CareReceiver;
