import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../Components/BackButton';
import { Styles } from '../Styles/Styles';
import careReceiversService from '../services/careReceiversService';
import locationsService from '../services/locationService';
import roomBedsService from '../services/roomBedsService';

function CareReceiver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [careReceiver, setCareReceiver] = useState(null);
  const [location, setLocation] = useState(null);
  const [currentRoomBed, setCurrentRoomBed] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [roomBedsLoading, setRoomBedsLoading] = useState(false);

  // Fetch care receiver details
  useEffect(() => {
    const loadCareReceiver = async () => {
      try {
        setLoading(true);
        const careReceiverData = await careReceiversService.getCareReceiverById(id);
        setCareReceiver(careReceiverData);
        
        // Load location details
        if (careReceiverData.locationId) {
          const locationData = await locationsService.getLocationById(careReceiverData.locationId);
          setLocation(locationData);
        }

        // Load current room/bed details
        if (careReceiverData.currentRoomBedId) {
          try {
            const roomBedData = await roomBedsService.getById(careReceiverData.currentRoomBedId);
            setCurrentRoomBed(roomBedData);
          } catch (error) {
            console.error('Error loading room/bed details:', error);
          }
        }
      } catch (error) {
        console.error('Error loading care receiver:', error);
        navigate('/care-receivers');
      } finally {
        setLoading(false);
      }
    };
    loadCareReceiver();
  }, [id, navigate]);

  // Load available rooms and beds when editing
  useEffect(() => {
    const loadRoomBeds = async () => {
      if (!isEditing || !careReceiver?.locationId) return;

      try {
        setRoomBedsLoading(true);
        const roomBeds = await roomBedsService.getByLocation(careReceiver.locationId);
        
        // Get unique rooms
        const rooms = [...new Set(roomBeds?.map(rb => rb.roomNumber) || [])].sort();
        setAvailableRooms(rooms);
        
        // Get all beds for the current room if available
        if (currentRoomBed?.roomNumber) {
          const beds = roomBeds
            .filter(rb => rb.roomNumber === currentRoomBed.roomNumber)
            .map(rb => ({
              id: rb.id,
              bedNumber: rb.bedNumber,
              isOccupied: rb.isOccupied
            }))
            .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber));
          setAvailableBeds(beds);
        }
      } catch (error) {
        console.error('Error loading room beds:', error);
      } finally {
        setRoomBedsLoading(false);
      }
    };
    loadRoomBeds();
  }, [isEditing, careReceiver?.locationId, currentRoomBed?.roomNumber]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    medicalRecordNumber: '',
    presentAddress: '',
    nationality: '',
    // Medical Information
    medicalHistory: '',
    currentMedications: [],
    allergies: [],
    mobilityLevel: '',
    mentalCapacityLevel: '',
    mentalHealthIllnesses: [],
    dnrStatus: false,
    gpDetails: '',
    // Care Information
    careLevel: '',
    locationId: '',
    currentRoomBedId: '',
    roomNumber: '', // New: for editing
    bedNumber: '', // New: for editing
    accessibilityNeeds: [],
    specialEquipmentRequirements: [],
    // Emergency Contacts
    emergencyContacts: [],
    legalGuardianDetails: '',
    // Device Preferences
    wearableDevicePreferences: '',
    healthMonitoringConsent: false,
    dataSharingPermissions: '',
    // Care Details
    admissionDate: '',
    dischargeDate: '',
    reasonForAdmission: '',
    expectedLengthOfStay: '',
    fundingSource: '',
    carePlanSummary: '',
    status: '',
  });

  // Update form data when care receiver loads
  useEffect(() => {
    if (careReceiver) {
      setFormData({
        firstName: careReceiver.firstName || '',
        lastName: careReceiver.lastName || '',
        dateOfBirth: careReceiver.dateOfBirth ? new Date(careReceiver.dateOfBirth).toISOString().split('T')[0] : '',
        gender: careReceiver.gender || '',
        medicalRecordNumber: careReceiver.medicalRecordNumber || '',
        presentAddress: careReceiver.presentAddress || '',
        nationality: careReceiver.nationality || '',
        medicalHistory: careReceiver.medicalHistory || '',
        currentMedications: careReceiver.currentMedications || [],
        allergies: careReceiver.allergies || [],
        mobilityLevel: careReceiver.mobilityLevel || '',
        mentalCapacityLevel: careReceiver.mentalCapacityLevel || '',
        mentalHealthIllnesses: careReceiver.mentalHealthIllnesses || [],
        dnrStatus: careReceiver.dnrStatus || false,
        gpDetails: careReceiver.gpDetails || '',
        careLevel: careReceiver.careLevel || '',
        locationId: careReceiver.locationId || '',
        currentRoomBedId: careReceiver.currentRoomBedId || '',
        roomNumber: currentRoomBed?.roomNumber || '',
        bedNumber: currentRoomBed?.bedNumber || '',
        accessibilityNeeds: careReceiver.accessibilityNeeds || [],
        specialEquipmentRequirements: careReceiver.specialEquipmentRequirements || [],
        emergencyContacts: careReceiver.emergencyContacts || [],
        legalGuardianDetails: careReceiver.legalGuardianDetails || '',
        wearableDevicePreferences: careReceiver.wearableDevicePreferences || '',
        healthMonitoringConsent: careReceiver.healthMonitoringConsent || false,
        dataSharingPermissions: careReceiver.dataSharingPermissions || '',
        admissionDate: careReceiver.admissionDate ? new Date(careReceiver.admissionDate).toISOString().split('T')[0] : '',
        dischargeDate: careReceiver.dischargeDate ? new Date(careReceiver.dischargeDate).toISOString().split('T')[0] : '',
        reasonForAdmission: careReceiver.reasonForAdmission || '',
        expectedLengthOfStay: careReceiver.expectedLengthOfStay || '',
        fundingSource: careReceiver.fundingSource || '',
        carePlanSummary: careReceiver.carePlanSummary || '',
        status: careReceiver.status || '',
      });
    }
  }, [careReceiver, currentRoomBed]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle room selection change
  const handleRoomChange = (e) => {
    const roomNumber = e.target.value;
    setFormData(prev => ({
      ...prev,
      roomNumber,
      bedNumber: '', // Reset bed selection
      currentRoomBedId: '', // Reset room bed ID
    }));

    // Update available beds for the selected room
    if (roomNumber && careReceiver?.locationId) {
      roomBedsService.getByLocation(careReceiver.locationId).then(roomBeds => {
        const beds = roomBeds
          .filter(rb => rb.roomNumber === roomNumber)
          .map(rb => ({
            id: rb.id,
            bedNumber: rb.bedNumber,
            isOccupied: rb.isOccupied
          }))
          .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber));
        setAvailableBeds(beds);
      });
    } else {
      setAvailableBeds([]);
    }
  };

  // Handle bed selection change
  const handleBedChange = (e) => {
    const bedNumber = e.target.value;
    setFormData(prev => ({
      ...prev,
      bedNumber,
      currentRoomBedId: '', // Will be set when bed is selected
    }));

    // Find the room bed ID for the selected bed
    if (bedNumber && formData.roomNumber && careReceiver?.locationId) {
      roomBedsService.getByLocation(careReceiver.locationId).then(roomBeds => {
        const selectedBed = roomBeds.find(rb => 
          rb.roomNumber === formData.roomNumber && rb.bedNumber === bedNumber
        );
        if (selectedBed) {
          setFormData(prev => ({
            ...prev,
            currentRoomBedId: selectedBed.id,
          }));
        }
      });
    }
  };

  const handleArrayChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()).filter(item => item)
    }));
  };

  const toggleEdit = () => setIsEditing(prev => !prev);

  const toggleShowMore = () => setShowMore(prev => !prev);

  const handleSave = async () => {
    try {
      // Prepare update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        gender: formData.gender,
        medicalRecordNumber: formData.medicalRecordNumber,
        presentAddress: formData.presentAddress,
        nationality: formData.nationality,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
        allergies: formData.allergies,
        mobilityLevel: formData.mobilityLevel,
        mentalCapacityLevel: formData.mentalCapacityLevel,
        mentalHealthIllnesses: formData.mentalHealthIllnesses,
        dnrStatus: formData.dnrStatus,
        gpDetails: formData.gpDetails,
        careLevel: formData.careLevel,
        currentRoomBedId: formData.currentRoomBedId,
        accessibilityNeeds: formData.accessibilityNeeds,
        specialEquipmentRequirements: formData.specialEquipmentRequirements,
        emergencyContacts: formData.emergencyContacts,
        legalGuardianDetails: formData.legalGuardianDetails,
        wearableDevicePreferences: formData.wearableDevicePreferences,
        healthMonitoringConsent: formData.healthMonitoringConsent,
        dataSharingPermissions: formData.dataSharingPermissions,
        admissionDate: formData.admissionDate ? new Date(formData.admissionDate) : null,
        dischargeDate: formData.dischargeDate ? new Date(formData.dischargeDate) : null,
        reasonForAdmission: formData.reasonForAdmission,
        expectedLengthOfStay: parseInt(formData.expectedLengthOfStay) || null,
        fundingSource: formData.fundingSource,
        carePlanSummary: formData.carePlanSummary,
      };

      await careReceiversService.updateCareReceiver(id, updateData);
      setIsEditing(false);
      // Reload care receiver data
      const updatedCareReceiver = await careReceiversService.getCareReceiverById(id);
      setCareReceiver(updatedCareReceiver);
      
      // Reload room/bed data if changed
      if (updatedCareReceiver.currentRoomBedId) {
        const roomBedData = await roomBedsService.getById(updatedCareReceiver.currentRoomBedId);
        setCurrentRoomBed(roomBedData);
      }
    } catch (error) {
      console.error('Error updating care receiver:', error);
    }
  };

  const handleDischarge = async () => {
    try {
      await careReceiversService.dischargeCareReceiver(id);
      // Reload care receiver data
      const updatedCareReceiver = await careReceiversService.getCareReceiverById(id);
      setCareReceiver(updatedCareReceiver);
    } catch (error) {
      console.error('Error discharging care receiver:', error);
    }
  };

  const displayValue = (val) => {
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (Array.isArray(val)) return val.join(', ') || 'None';
    return val || <span className="text-gray-400 italic">Not provided</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return '';
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Helper function to format bed number as CH001A format
  const formatBedNumber = (bedNumber, roomNumber) => {
    if (!bedNumber) return 'N/A';
    
    // If bedNumber is already in CH001A format, return as is
    if (bedNumber.startsWith('CH')) {
      return bedNumber;
    }
    
    // If bedNumber is just a letter (A, B, C, etc.), format it as CH001A
    if (bedNumber.length === 1 && /[A-Z]/.test(bedNumber)) {
      const paddedRoomNumber = roomNumber ? String(roomNumber).padStart(3, '0') : '001';
      return `CH${paddedRoomNumber}${bedNumber}`;
    }
    
    // For any other format, return as is
    return bedNumber;
  };

  if (loading) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading care receiver details...</div>
        </div>
      </div>
    );
  }

  if (!careReceiver) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Care receiver not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <BackButton />
        <div className="flex gap-2">
          <button
            onClick={isEditing ? handleSave : toggleEdit}
            className={`px-4 py-2 font-medium rounded ${
              isEditing ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Save' : 'Update'}
          </button>
          <button
            onClick={handleDischarge}
            className="px-4 py-2 font-medium rounded bg-red-600 text-white hover:bg-red-700"
          >
            Discharge
          </button>
          <button
            onClick={toggleShowMore}
            className="ml-4 px-4 py-2 font-medium rounded bg-gray-300 hover:bg-gray-400"
          >
            {showMore ? 'Hide More' : 'Show More'}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto p-6 space-y-8 max-h-[80vh]">
        {/* Personal Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="First Name" name="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Last Name" name="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} isEditing={isEditing} onChange={handleChange} />
            <Field label="Age" value={calculateAge(careReceiver.dateOfBirth)} isEditing={false} />
            <SelectField
              label="Gender"
              name="gender"
              options={['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']}
              value={formData.gender}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Medical Record Number" name="medicalRecordNumber" value={formData.medicalRecordNumber} isEditing={isEditing} onChange={handleChange} />
            <Field label="Present Address" name="presentAddress" value={formData.presentAddress} isEditing={isEditing} onChange={handleChange} />
            <Field label="Nationality" name="nationality" value={formData.nationality} isEditing={isEditing} onChange={handleChange} />
            <Field label="Care Home" value={location?.name || 'Loading...'} isEditing={false} />
          </div>
        </section>

        {/* Room and Bed Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Room & Bed Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isEditing ? (
              <>
                <div className="flex flex-col text-gray-700">
                  <label className="font-medium mb-1">Room Number</label>
                  {roomBedsLoading ? (
                    <div className="text-sm text-gray-500">Loading rooms...</div>
                  ) : (
                    <select
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleRoomChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    >
                      <option value="">Select a room</option>
                      {availableRooms.map((room) => (
                        <option key={room} value={room}>Room {room}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex flex-col text-gray-700">
                  <label className="font-medium mb-1">Bed Number</label>
                  {!formData.roomNumber ? (
                    <div className="text-sm text-gray-500">Please select a room first</div>
                  ) : availableBeds.length === 0 ? (
                    <div className="text-sm text-red-600">No beds available in this room</div>
                  ) : (
                    <select
                      name="bedNumber"
                      value={formData.bedNumber}
                      onChange={handleBedChange}
                      className="border border-gray-400 rounded px-3 py-1"
                    >
                      <option value="">Select a bed</option>
                      {availableBeds.map((bed) => (
                        <option 
                          key={bed.id} 
                          value={bed.bedNumber}
                          disabled={bed.isOccupied}
                          className={bed.isOccupied ? 'text-red-500' : ''}
                        >
                          {bed.bedNumber} {bed.isOccupied ? '(Occupied)' : '(Available)'}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex flex-col text-gray-700">
                  <label className="font-medium mb-1">Current Assignment</label>
                  <p className="text-sm text-gray-600">
                    {formData.roomNumber && formData.bedNumber 
                      ? `Room ${formData.roomNumber}, Bed ${formatBedNumber(formData.bedNumber, formData.roomNumber)}`
                      : 'No room/bed assigned'
                    }
                  </p>
                </div>
              </>
            ) : (
              <>
                <Field 
                  label="Room Number" 
                  value={currentRoomBed?.roomNumber ? `Room ${currentRoomBed.roomNumber}` : 'Not assigned'} 
                  isEditing={false} 
                />
                <Field 
                  label="Bed Number" 
                  value={currentRoomBed?.bedNumber ? formatBedNumber(currentRoomBed.bedNumber, currentRoomBed.roomNumber) : 'Not assigned'} 
                  isEditing={false} 
                />
                <Field 
                  label="Assignment Status" 
                  value={currentRoomBed?.isOccupied ? 'Occupied' : 'Available'} 
                  isEditing={false} 
                />
              </>
            )}
          </div>
        </section>

        {/* Medical Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextAreaField label="Medical History" name="medicalHistory" value={formData.medicalHistory} isEditing={isEditing} onChange={handleChange} />
            <Field label="Current Medications" name="currentMedications" value={formData.currentMedications.join(', ')} isEditing={isEditing} onChange={(e) => handleArrayChange('currentMedications', e.target.value)} />
            <Field label="Allergies" name="allergies" value={formData.allergies.join(', ')} isEditing={isEditing} onChange={(e) => handleArrayChange('allergies', e.target.value)} />
            <SelectField
              label="Mobility Level"
              name="mobilityLevel"
              options={['INDEPENDENT', 'ASSISTED_WALKING', 'WHEELCHAIR_BOUND', 'BED_BOUND']}
              value={formData.mobilityLevel}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <SelectField
              label="Mental Capacity Level"
              name="mentalCapacityLevel"
              options={['FULL_CAPACITY', 'PARTIAL_CAPACITY', 'LIMITED_CAPACITY', 'NO_CAPACITY']}
              value={formData.mentalCapacityLevel}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Mental Health Illnesses" name="mentalHealthIllnesses" value={formData.mentalHealthIllnesses.join(', ')} isEditing={isEditing} onChange={(e) => handleArrayChange('mentalHealthIllnesses', e.target.value)} />
            <CheckboxField label="DNR Status" name="dnrStatus" checked={formData.dnrStatus} isEditing={isEditing} onChange={handleChange} />
            <Field label="GP Details" name="gpDetails" value={formData.gpDetails} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Care Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Care Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Care Level"
              name="careLevel"
              options={['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']}
              value={formData.careLevel}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Admission Date" name="admissionDate" type="date" value={formData.admissionDate} isEditing={isEditing} onChange={handleChange} />
            <Field label="Discharge Date" name="dischargeDate" type="date" value={formData.dischargeDate} isEditing={isEditing} onChange={handleChange} />
            <Field label="Reason for Admission" name="reasonForAdmission" value={formData.reasonForAdmission} isEditing={isEditing} onChange={handleChange} />
            <Field label="Expected Length of Stay (days)" name="expectedLengthOfStay" type="number" value={formData.expectedLengthOfStay} isEditing={isEditing} onChange={handleChange} />
            <SelectField
              label="Funding Source"
              name="fundingSource"
              options={['NHS', 'PRIVATE', 'SOCIAL_SERVICES', 'INSURANCE', 'SELF_FUNDED']}
              value={formData.fundingSource}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <TextAreaField label="Care Plan Summary" name="carePlanSummary" value={formData.carePlanSummary} isEditing={isEditing} onChange={handleChange} />
            <Field label="Status" value={formData.status} isEditing={false} />
          </div>
        </section>

        {/* Emergency Contacts */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <div className="space-y-4">
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="border p-4 rounded">
                <h4 className="font-medium mb-2">Contact {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Name" value={contact.name} isEditing={false} />
                  <Field label="Relationship" value={contact.relationship} isEditing={false} />
                  <Field label="Phone" value={contact.phoneNumber} isEditing={false} />
                  <Field label="Email" value={contact.email || 'Not provided'} isEditing={false} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Device Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Device Preferences & Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Wearable Device Preferences" name="wearableDevicePreferences" value={formData.wearableDevicePreferences} isEditing={isEditing} onChange={handleChange} />
            <CheckboxField label="Health Monitoring Consent" name="healthMonitoringConsent" checked={formData.healthMonitoringConsent} isEditing={isEditing} onChange={handleChange} />
            <Field label="Data Sharing Permissions" name="dataSharingPermissions" value={formData.dataSharingPermissions} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>
      </div>

      {showMore && <MoreOverlay />}
    </div>
  );
}

// Reusable Field Components
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
          <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
        ))}
      </select>
    ) : (
      <p>{value ? value.replace('_', ' ') : <span className="text-gray-400 italic">Not provided</span>}</p>
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

const MoreOverlay = () => (
  <div className="fixed inset-0 bg-[#00000055] bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-y-auto">
    <div className="bg-white rounded p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-lg relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={() => setShowMore(false)}
      >
        Close ✕
      </button>
      <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
      {/* Add more detailed information here */}
    </div>
  </div>
);

export default CareReceiver;