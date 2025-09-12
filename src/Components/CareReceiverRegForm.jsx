import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import careReceiversService from '../services/careReceiversService';
import locationsService from '../services/locationService';
import roomBedsService from '../services/roomBedsService';

// Helpers
const toISODate = (d) => {
  if (!d || typeof d !== 'string') return undefined;
  const iso = `${d}T00:00:00Z`;
  const dt = new Date(iso);
  return isNaN(dt.getTime()) ? undefined : dt.toISOString();
};
const isFilled = (v) => v !== undefined && v !== null && String(v).trim() !== '';

const emptyEmergencyContact = () => ({
  name: '',
  relationship: '',
  phoneNumber: '',
  email: '',
  isPrimaryContact: false,
  address: '',
});

const initialForm = {
  // Personal
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',                 // enum
  medicalRecordNumber: '',
  presentAddress: '',
  nationality: '',
  // Medical
  medicalHistory: '',
  currentMedications: [],     // { drug, dose, interval, instructions? }
  allergies: [],              // { allergen, reaction, severity? }
  mobilityLevel: '',          // enum optional
  mentalCapacityLevel: '',    // enum optional
  mentalHealthIllnesses: '',  // comma separated input -> array
  dnrStatus: false,
  gpDetails: { name: '', practiceName: '', phoneNumber: '', email: '', address: '' },
  // Placement
  careLevel: '',              // enum
  locationId: '',
  roomNumber: '',             // New: separate room selection
  bedNumber: '',              // New: separate bed selection
  currentRoomBedId: '',       // Will be set based on room and bed selection
  accessibilityNeeds: [],     // { need, description?, isCritical? }
  specialEquipmentRequirements: [], // { equipment, description?, supplier? }
  // Contacts (up to 4, at least 1 required)
  emergencyContacts: [
    { name: '', relationship: '', phoneNumber: '', email: '', isPrimaryContact: true, address: '' },
  ],
  legalGuardianDetails: { name: '', relationship: '', phoneNumber: '', email: '', legalDocumentType: '', legalDocumentNumber: '' },
  // Wearables / Sharing
  wearableDevicePreferences: {
    deviceType: '',
    enableHealthMonitoring: false,
    enableLocationTracking: false,
    enableFallDetection: false,
    alertPreferences: '', // comma separated input -> array
  },
  healthMonitoringConsent: false,
  dataSharingPermissions: {
    shareWithNHS: false,
    shareWithFamily: false,
    shareWithCareTeam: false,
    shareForResearch: false,
    shareWithEmergencyServices: false,
    additionalPermissions: '', // comma separated input -> array
  },
  // Care info
  reasonForAdmission: '',
  expectedLengthOfStay: '',
  fundingSource: '',          // enum optional
  carePlanSummary: '',
  // GDPR Consent (required)
  gdprConsent: {
    dataProcessing: true,
    healthDataSharing: true,
    emergencyContactSharing: true,
    researchParticipation: false,
    marketingCommunications: false,
    consentGivenBy: '',
    relationshipToCareReceiver: '',
    hasLegalAuthority: true,
    dataSharingPermissions: {
      shareWithNHS: false,
      shareWithFamily: false,
      shareWithCareTeam: false,
      shareForResearch: false,
      shareWithEmergencyServices: false,
      additionalPermissions: '', // comma separated -> array
    }
  },
  notes: '',
};

function CareReceiverRegForm() {
  const [form, setForm] = useState(initialForm);
  const [locations, setLocations] = useState([]);
  const [roomBeds, setRoomBeds] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [locLoading, setLocLoading] = useState(false);
  const [roomBedsLoading, setRoomBedsLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [roomBedsError, setRoomBedsError] = useState('');

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocLoading(true);
        setLocError('');
        const res = await locationsService.getAllLocations(false);
        setLocations(res || []);
      } catch {
        setLocError('Failed to load locations');
      } finally {
        setLocLoading(false);
      }
    };
    loadLocations();
  }, []);

  // Load room beds when location changes
  useEffect(() => {
    const loadRoomBeds = async () => {
      if (!form.locationId) {
        setRoomBeds([]);
        setAvailableRooms([]);
        setAvailableBeds([]);
        return;
      }

      try {
        setRoomBedsLoading(true);
        setRoomBedsError('');
        const res = await roomBedsService.getByLocation(form.locationId);
        setRoomBeds(res || []);
        
        // Get unique rooms
        const rooms = [...new Set(res?.map(rb => rb.roomNumber) || [])].sort();
        setAvailableRooms(rooms);
        
        // Reset bed selection when location changes
        setForm(prev => ({ ...prev, roomNumber: '', bedNumber: '', currentRoomBedId: '' }));
      } catch {
        setRoomBedsError('Failed to load room beds');
      } finally {
        setRoomBedsLoading(false);
      }
    };
    loadRoomBeds();
  }, [form.locationId]);

  // Update available beds when room changes
  useEffect(() => {
    if (!form.roomNumber || !roomBeds.length) {
      setAvailableBeds([]);
      setForm(prev => ({ ...prev, bedNumber: '', currentRoomBedId: '' }));
      return;
    }

    const beds = roomBeds
      .filter(rb => rb.roomNumber === form.roomNumber)
      .map(rb => ({
        id: rb.id,
        bedNumber: rb.bedNumber,
        isOccupied: rb.isOccupied
      }))
      .sort((a, b) => a.bedNumber.localeCompare(b.bedNumber));
    
    setAvailableBeds(beds);
    setForm(prev => ({ ...prev, bedNumber: '', currentRoomBedId: '' }));
  }, [form.roomNumber, roomBeds]);

  // Update currentRoomBedId when bed is selected
  useEffect(() => {
    if (form.roomNumber && form.bedNumber) {
      const selectedBed = roomBeds.find(rb => 
        rb.roomNumber === form.roomNumber && rb.bedNumber === form.bedNumber
      );
      if (selectedBed) {
        setForm(prev => ({ ...prev, currentRoomBedId: selectedBed.id }));
      }
    }
  }, [form.roomNumber, form.bedNumber, roomBeds]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  const onGPChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, gpDetails: { ...p.gpDetails, [name]: value } }));
  };
  const onEmergencyContactChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => {
      const arr = [...p.emergencyContacts];
      arr[index] = { ...arr[index], [name]: type === 'checkbox' ? checked : value };
      return { ...p, emergencyContacts: arr };
    });
  };
  const onGuardianChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, legalGuardianDetails: { ...p.legalGuardianDetails, [name]: value } }));
  };
  const onWearableChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      wearableDevicePreferences: { ...p.wearableDevicePreferences, [name]: type === 'checkbox' ? checked : value }
    }));
  };
  const onDSPChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      dataSharingPermissions: { ...p.dataSharingPermissions, [name]: type === 'checkbox' ? checked : value }
    }));
  };
  const onGDPRChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      gdprConsent: { ...p.gdprConsent, [name]: type === 'checkbox' ? checked : value }
    }));
  };
  const onGDPRDSPChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      gdprConsent: {
        ...p.gdprConsent,
        dataSharingPermissions: {
          ...p.gdprConsent.dataSharingPermissions,
          [name]: type === 'checkbox' ? checked : value
        }
      }
    }));
  };

  const addEmergencyContact = () => {
    setForm((p) => {
      if (p.emergencyContacts.length >= 4) {
        toast.info('You can add up to 4 emergency contacts');
        return p;
      }
      return { ...p, emergencyContacts: [...p.emergencyContacts, emptyEmergencyContact()] };
    });
  };
  const removeEmergencyContact = (index) => {
    setForm((p) => {
      if (p.emergencyContacts.length <= 1) {
        toast.info('At least one emergency contact is required');
        return p;
      }
      const arr = [...p.emergencyContacts];
      arr.splice(index, 1);
      // keep at least one primary; if none set first as primary
      if (!arr.some(c => c.isPrimaryContact)) {
        arr[0] = { ...arr[0], isPrimaryContact: true };
      }
      return { ...p, emergencyContacts: arr };
    });
  };
  const setPrimaryContact = (index) => {
    setForm((p) => {
      const arr = p.emergencyContacts.map((ec, i) => ({
        ...ec,
        isPrimaryContact: i === index
      }));
      return { ...p, emergencyContacts: arr };
    });
  };

  const validate = (f) => {
    const errs = {};
    if (!isFilled(f.firstName)) errs.firstName = 'First name is required';
    if (!isFilled(f.lastName)) errs.lastName = 'Last name is required';
    if (!isFilled(f.dateOfBirth) || !toISODate(f.dateOfBirth)) errs.dateOfBirth = 'Valid DOB required';
    if (!isFilled(f.gender)) errs.gender = 'Gender is required';
    if (!isFilled(f.presentAddress)) errs.presentAddress = 'Present address is required';
    if (!isFilled(f.careLevel)) errs.careLevel = 'Care level is required';
    if (!isFilled(f.locationId)) errs.locationId = 'Location (Care Home) is required';
    if (!isFilled(f.roomNumber)) errs.roomNumber = 'Room selection is required';
    if (!isFilled(f.bedNumber)) errs.bedNumber = 'Bed selection is required';
    if (!Array.isArray(f.emergencyContacts) || f.emergencyContacts.length < 1) {
      errs.emergencyContacts = 'At least one emergency contact is required';
    } else {
      const ec = f.emergencyContacts[0];
      if (!isFilled(ec.name) || !isFilled(ec.relationship) || !isFilled(ec.phoneNumber)) {
        errs.emergencyContacts = 'Emergency contact (name, relationship, phone) is required';
      }
    }
    if (!f.gdprConsent) errs.gdprConsent = 'GDPR consent is required';
    else if (!isFilled(f.gdprConsent.consentGivenBy)) errs.gdprConsent_consentGivenBy = 'Consent given by is required';
    return errs;
  };

  const buildPayload = (f) => {
    const emergencyContacts = (f.emergencyContacts || [])
      .filter(ec => isFilled(ec.name) || isFilled(ec.relationship) || isFilled(ec.phoneNumber))
      .map(ec => ({
        name: ec.name,
        relationship: ec.relationship,
        phoneNumber: ec.phoneNumber,
        email: isFilled(ec.email) ? ec.email : undefined,
        isPrimaryContact: !!ec.isPrimaryContact,
        address: isFilled(ec.address) ? ec.address : undefined,
      }));

    const currentMedications = Array.isArray(f.currentMedications) ? f.currentMedications
      .filter(m => isFilled(m.drug) && isFilled(m.dose) && isFilled(m.interval))
      .map(m => ({
        drug: m.drug,
        dose: m.dose,
        interval: m.interval,
        instructions: isFilled(m.instructions) ? m.instructions : undefined,
      })) : undefined;

    const allergies = Array.isArray(f.allergies) ? f.allergies
      .filter(a => isFilled(a.allergen) && isFilled(a.reaction))
      .map(a => ({
        allergen: a.allergen,
        reaction: a.reaction,
        severity: isFilled(a.severity) ? a.severity : undefined,
      })) : undefined;

    const accessibilityNeeds = Array.isArray(f.accessibilityNeeds) ? f.accessibilityNeeds
      .filter(n => isFilled(n.need))
      .map(n => ({
        need: n.need,
        description: isFilled(n.description) ? n.description : undefined,
        isCritical: !!n.isCritical,
      })) : undefined;

    const specialEquipmentRequirements = Array.isArray(f.specialEquipmentRequirements) ? f.specialEquipmentRequirements
      .filter(s => isFilled(s.equipment))
      .map(s => ({
        equipment: s.equipment,
        description: isFilled(s.description) ? s.description : undefined,
        supplier: isFilled(s.supplier) ? s.supplier : undefined,
      })) : undefined;

    const wearablePrefs = f.wearableDevicePreferences;
    const wearableDevicePreferences = wearablePrefs && (
      isFilled(wearablePrefs.deviceType) ||
      wearablePrefs.enableHealthMonitoring ||
      wearablePrefs.enableLocationTracking ||
      wearablePrefs.enableFallDetection ||
      isFilled(wearablePrefs.alertPreferences)
    ) ? {
      deviceType: isFilled(wearablePrefs.deviceType) ? wearablePrefs.deviceType : undefined,
      enableHealthMonitoring: !!wearablePrefs.enableHealthMonitoring,
      enableLocationTracking: !!wearablePrefs.enableLocationTracking,
      enableFallDetection: !!wearablePrefs.enableFallDetection,
      alertPreferences: isFilled(wearablePrefs.alertPreferences)
        ? wearablePrefs.alertPreferences.split(',').map(s => s.trim()).filter(isFilled)
        : undefined,
    } : undefined;

    const dataShare = f.dataSharingPermissions;
    const dataSharingPermissions = dataShare && (
      dataShare.shareWithNHS || dataShare.shareWithFamily || dataShare.shareWithCareTeam ||
      dataShare.shareForResearch || dataShare.shareWithEmergencyServices || isFilled(dataShare.additionalPermissions)
    ) ? {
      shareWithNHS: !!dataShare.shareWithNHS,
      shareWithFamily: !!dataShare.shareWithFamily,
      shareWithCareTeam: !!dataShare.shareWithCareTeam,
      shareForResearch: !!dataShare.shareForResearch,
      shareWithEmergencyServices: !!dataShare.shareWithEmergencyServices,
      additionalPermissions: isFilled(dataShare.additionalPermissions)
        ? dataShare.additionalPermissions.split(',').map(s => s.trim()).filter(isFilled)
        : undefined,
    } : undefined;

    const gdprDSP = f.gdprConsent?.dataSharingPermissions;
    const gdprDataSharingPermissions = gdprDSP ? {
      shareWithNHS: !!gdprDSP.shareWithNHS,
      shareWithFamily: !!gdprDSP.shareWithFamily,
      shareWithCareTeam: !!gdprDSP.shareWithCareTeam,
      shareForResearch: !!gdprDSP.shareForResearch,
      shareWithEmergencyServices: !!gdprDSP.shareWithEmergencyServices,
      additionalPermissions: isFilled(gdprDSP.additionalPermissions)
        ? gdprDSP.additionalPermissions.split(',').map(s => s.trim()).filter(isFilled)
        : undefined,
    } : undefined;

    const payload = {
      // Personal
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      dateOfBirth: toISODate(f.dateOfBirth),
      gender: f.gender,
      medicalRecordNumber: isFilled(f.medicalRecordNumber) ? f.medicalRecordNumber : undefined,
      presentAddress: f.presentAddress,
      nationality: isFilled(f.nationality) ? f.nationality : undefined,

      // Medical
      medicalHistory: isFilled(f.medicalHistory) ? f.medicalHistory : undefined,
      currentMedications,
      allergies,
      mobilityLevel: isFilled(f.mobilityLevel) ? f.mobilityLevel : undefined,
      mentalCapacityLevel: isFilled(f.mentalCapacityLevel) ? f.mentalCapacityLevel : undefined,
      mentalHealthIllnesses: isFilled(f.mentalHealthIllnesses)
        ? f.mentalHealthIllnesses.split(',').map(s => s.trim()).filter(isFilled)
        : undefined,
      dnrStatus: !!f.dnrStatus,
      gpDetails: f.gpDetails && (isFilled(f.gpDetails.name) || isFilled(f.gpDetails.practiceName) || isFilled(f.gpDetails.phoneNumber)) ? {
        name: f.gpDetails.name,
        practiceName: f.gpDetails.practiceName,
        phoneNumber: f.gpDetails.phoneNumber,
        email: isFilled(f.gpDetails.email) ? f.gpDetails.email : undefined,
        address: isFilled(f.gpDetails.address) ? f.gpDetails.address : undefined,
      } : undefined,

      // Placement
      careLevel: f.careLevel,
      locationId: f.locationId,
      currentRoomBedId: f.currentRoomBedId, // Now required and set automatically
      accessibilityNeeds,
      specialEquipmentRequirements,

      // Contacts
      emergencyContacts,
      legalGuardianDetails: f.legalGuardianDetails && (isFilled(f.legalGuardianDetails.name) || isFilled(f.legalGuardianDetails.relationship) || isFilled(f.legalGuardianDetails.phoneNumber)) ? {
        name: f.legalGuardianDetails.name,
        relationship: f.legalGuardianDetails.relationship,
        phoneNumber: f.legalGuardianDetails.phoneNumber,
        email: isFilled(f.legalGuardianDetails.email) ? f.legalGuardianDetails.email : undefined,
        legalDocumentType: isFilled(f.legalGuardianDetails.legalDocumentType) ? f.legalGuardianDetails.legalDocumentType : undefined,
        legalDocumentNumber: isFilled(f.legalGuardianDetails.legalDocumentNumber) ? f.legalGuardianDetails.legalDocumentNumber : undefined,
      } : undefined,

      // Wearables/Sharing
      wearableDevicePreferences,
      healthMonitoringConsent: !!f.healthMonitoringConsent,
      dataSharingPermissions,

      // Care info
      reasonForAdmission: isFilled(f.reasonForAdmission) ? f.reasonForAdmission : undefined,
      expectedLengthOfStay: isFilled(f.expectedLengthOfStay) ? Number(f.expectedLengthOfStay) : undefined,
      fundingSource: isFilled(f.fundingSource) ? f.fundingSource : undefined,
      carePlanSummary: isFilled(f.carePlanSummary) ? f.carePlanSummary : undefined,

      // GDPR
      gdprConsent: {
        dataProcessing: !!f.gdprConsent?.dataProcessing,
        healthDataSharing: !!f.gdprConsent?.healthDataSharing,
        emergencyContactSharing: !!f.gdprConsent?.emergencyContactSharing,
        researchParticipation: !!f.gdprConsent?.researchParticipation,
        marketingCommunications: !!f.gdprConsent?.marketingCommunications,
        consentGivenBy: f.gdprConsent?.consentGivenBy || '',
        relationshipToCareReceiver: isFilled(f.gdprConsent?.relationshipToCareReceiver) ? f.gdprConsent.relationshipToCareReceiver : undefined,
        hasLegalAuthority: !!f.gdprConsent?.hasLegalAuthority,
        dataSharingPermissions: gdprDataSharingPermissions,
      },

      notes: isFilled(f.notes) ? f.notes : undefined,
    };

    return payload;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      Object.values(errs).forEach(m => toast.error(m));
      return;
    }
    try {
      const payload = buildPayload(form);
      await careReceiversService.registerCareReceiver(payload);
      toast.success('Care receiver registered successfully');
      // setForm(initialForm); // optional reset
    } catch (err) {
      const status = err?.status || err?.response?.status;
      toast.error(status ? `Registration failed (HTTP ${status})` : (err?.message || 'Registration failed'));
    }
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={onSubmit} className="w-[100%] mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-blue-600">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            First Name
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="firstName" value={form.firstName} onChange={onChange} required />
          </label>
          <label className="flex flex-col text-gray-600">
            Last Name
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="lastName" value={form.lastName} onChange={onChange} required />
          </label>
          <label className="flex flex-col text-gray-600">
            Date of Birth
            <input type="date" className="mt-1 border border-gray-600 rounded px-3 py-2" name="dateOfBirth" value={form.dateOfBirth} onChange={onChange} required />
          </label>
          <label className="flex flex-col text-gray-600">
            Gender
            <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="gender" value={form.gender} onChange={onChange} required>
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>
          </label>
          <label className="flex flex-col text-gray-600">
            Medical Record Number (optional)
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="medicalRecordNumber" value={form.medicalRecordNumber} onChange={onChange} />
          </label>
          <label className="flex flex-col text-gray-600">
            Present Address
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="presentAddress" value={form.presentAddress} onChange={onChange} required />
          </label>
          <label className="flex flex-col text-gray-600">
            Nationality (optional)
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="nationality" value={form.nationality} onChange={onChange} />
          </label>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Care Home Placement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Care Level
            <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="careLevel" value={form.careLevel} onChange={onChange} required>
              <option value="">Select care level</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRTICAL">Critical</option>
            </select>
          </label>

          <label className="flex flex-col text-gray-600">
            Care Home (Location)
            {locLoading ? (
              <div className="mt-1 text-sm text-gray-500">Loading care homes…</div>
            ) : locError ? (
              <div className="mt-1 text-sm text-red-600">{locError}</div>
            ) : (
              <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="locationId" value={form.locationId} onChange={onChange} required>
                <option value="">Select a care home</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            )}
          </label>

          <div></div> {/* Empty div for grid layout */}
        </div>

        {/* Room and Bed Selection */}
        {form.locationId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col text-gray-600">
              Room Number
              {roomBedsLoading ? (
                <div className="mt-1 text-sm text-gray-500">Loading rooms…</div>
              ) : roomBedsError ? (
                <div className="mt-1 text-sm text-red-600">{roomBedsError}</div>
              ) : (
                <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="roomNumber" value={form.roomNumber} onChange={onChange} required>
                  <option value="">Select a room</option>
                  {availableRooms.map((room) => (
                    <option key={room} value={room}>Room {room}</option>
                  ))}
                </select>
              )}
            </label>

            <label className="flex flex-col text-gray-600">
              Bed Number
              {!form.roomNumber ? (
                <div className="mt-1 text-sm text-gray-500">Please select a room first</div>
              ) : availableBeds.length === 0 ? (
                <div className="mt-1 text-sm text-red-600">No beds available in this room</div>
              ) : (
                <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="bedNumber" value={form.bedNumber} onChange={onChange} required>
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
            </label>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-blue-600">Medical Information (optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Medical History
            <textarea className="mt-1 border border-gray-600 rounded px-3 py-2" name="medicalHistory" value={form.medicalHistory} onChange={onChange} />
          </label>
          <label className="flex flex-col text-gray-600">
            Mental Health Illnesses (comma-separated)
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="mentalHealthIllnesses" value={form.mentalHealthIllnesses} onChange={onChange} />
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-6">
            <input type="checkbox" className="h-5 w-5" name="dnrStatus" checked={form.dnrStatus} onChange={(e) => setForm((p) => ({ ...p, dnrStatus: e.target.checked }))} />
            <span>DNR Status</span>
          </label>

          <label className="flex flex-col text-gray-600">
            Mobility Level
            <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="mobilityLevel" value={form.mobilityLevel} onChange={onChange}>
              <option value="">Select</option>
              <option value="INDEPENDENT">Independent</option>
              <option value="ASSISTED">Assisted</option>
              <option value="NON_AMBULATORY">Non-ambulatory</option>
            </select>
          </label>
          <label className="flex flex-col text-gray-600">
            Mental Capacity Level
            <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="mentalCapacityLevel" value={form.mentalCapacityLevel} onChange={onChange}>
              <option value="">Select</option>
              <option value="FULL_CAPACITY">Full</option>
              <option value="PARTIAL_CAPACITY">Partial</option>
              <option value="LIMITED_CAPACITY">Limited</option>
              <option value="NO_CAPACITY">None</option>
            </select>
          </label>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col text-gray-600">
              GP Name
              <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="name" value={form.gpDetails.name} onChange={onGPChange} />
            </label>
            <label className="flex flex-col text-gray-600">
              GP Practice
              <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="practiceName" value={form.gpDetails.practiceName} onChange={onGPChange} />
            </label>
            <label className="flex flex-col text-gray-600">
              GP Phone
              <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="phoneNumber" value={form.gpDetails.phoneNumber} onChange={onGPChange} />
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Emergency Contacts</h2>
        <div className="space-y-4">
          {form.emergencyContacts.map((ec, index) => (
            <div key={index} className="border border-gray-300 rounded-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Contact {index + 1}</h3>
                <div className="flex items-center gap-3">
                  <label className="flex items-center space-x-2 text-gray-600">
                    <input
                      type="radio"
                      name="primaryContact"
                      checked={!!ec.isPrimaryContact}
                      onChange={() => setPrimaryContact(index)}
                      className="h-4 w-4"
                    />
                    <span>Primary</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col text-gray-600">
                  Name
                  <input
                    className="mt-1 border border-gray-600 rounded px-3 py-2"
                    name="name"
                    value={ec.name}
                    onChange={(e) => onEmergencyContactChange(index, e)}
                    required={index === 0}
                  />
                </label>
                <label className="flex flex-col text-gray-600">
                  Relationship
                  <input
                    className="mt-1 border border-gray-600 rounded px-3 py-2"
                    name="relationship"
                    value={ec.relationship}
                    onChange={(e) => onEmergencyContactChange(index, e)}
                    required={index === 0}
                  />
                </label>
                <label className="flex flex-col text-gray-600">
                  Phone
                  <input
                    className="mt-1 border border-gray-600 rounded px-3 py-2"
                    name="phoneNumber"
                    value={ec.phoneNumber}
                    onChange={(e) => onEmergencyContactChange(index, e)}
                    required={index === 0}
                  />
                </label>
                <label className="flex flex-col text-gray-600">
                  Email (optional)
                  <input
                    className="mt-1 border border-gray-600 rounded px-3 py-2"
                    name="email"
                    value={ec.email || ''}
                    onChange={(e) => onEmergencyContactChange(index, e)}
                  />
                </label>
                <label className="flex flex-col text-gray-600 md:col-span-2">
                  Address (optional)
                  <input
                    className="mt-1 border border-gray-600 rounded px-3 py-2"
                    name="address"
                    value={ec.address || ''}
                    onChange={(e) => onEmergencyContactChange(index, e)}
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addEmergencyContact}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={form.emergencyContacts.length >= 4}
            >
              Add Contact
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">Wearables & Sharing (optional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col text-gray-600">
            Device Type
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="deviceType" value={form.wearableDevicePreferences.deviceType} onChange={onWearableChange} />
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-6">
            <input type="checkbox" className="h-5 w-5" name="enableHealthMonitoring" checked={form.wearableDevicePreferences.enableHealthMonitoring} onChange={onWearableChange} />
            <span>Enable Health Monitoring</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-6">
            <input type="checkbox" className="h-5 w-5" name="enableLocationTracking" checked={form.wearableDevicePreferences.enableLocationTracking} onChange={onWearableChange} />
            <span>Enable Location Tracking</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-600 mt-6">
            <input type="checkbox" className="h-5 w-5" name="enableFallDetection" checked={form.wearableDevicePreferences.enableFallDetection} onChange={onWearableChange} />
            <span>Enable Fall Detection</span>
          </label>
          <label className="flex flex-col text-gray-600">
            Alert Preferences (comma-separated)
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="alertPreferences" value={form.wearableDevicePreferences.alertPreferences} onChange={onWearableChange} />
          </label>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithNHS" checked={form.dataSharingPermissions.shareWithNHS} onChange={onDSPChange} />
              <span>Share with NHS</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithFamily" checked={form.dataSharingPermissions.shareWithFamily} onChange={onDSPChange} />
              <span>Share with Family</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithCareTeam" checked={form.dataSharingPermissions.shareWithCareTeam} onChange={onDSPChange} />
              <span>Share with Care Team</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareForResearch" checked={form.dataSharingPermissions.shareForResearch} onChange={onDSPChange} />
              <span>Share for Research</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithEmergencyServices" checked={form.dataSharingPermissions.shareWithEmergencyServices} onChange={onDSPChange} />
              <span>Share with Emergency Services</span>
            </label>
            <label className="flex flex-col text-gray-600">
              Additional Permissions (comma-separated)
              <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="additionalPermissions" value={form.dataSharingPermissions.additionalPermissions} onChange={onDSPChange} />
            </label>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-blue-600">GDPR Consent</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="h-5 w-5" name="dataProcessing" checked={form.gdprConsent.dataProcessing} onChange={onGDPRChange} />
            <span>Data Processing</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="h-5 w-5" name="healthDataSharing" checked={form.gdprConsent.healthDataSharing} onChange={onGDPRChange} />
            <span>Health Data Sharing</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="h-5 w-5" name="emergencyContactSharing" checked={form.gdprConsent.emergencyContactSharing} onChange={onGDPRChange} />
            <span>Emergency Contact Sharing</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="h-5 w-5" name="researchParticipation" checked={form.gdprConsent.researchParticipation} onChange={onGDPRChange} />
            <span>Research Participation</span>
          </label>
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="h-5 w-5" name="marketingCommunications" checked={form.gdprConsent.marketingCommunications} onChange={onGDPRChange} />
            <span>Marketing Communications</span>
          </label>
          <label className="flex flex-col text-gray-600">
            Consent Given By
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="consentGivenBy" value={form.gdprConsent.consentGivenBy} onChange={onGDPRChange} required />
          </label>
          <label className="flex flex-col text-gray-600">
            Relationship to Care Receiver (optional)
            <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="relationshipToCareReceiver" value={form.gdprConsent.relationshipToCareReceiver} onChange={onGDPRChange} />
          </label>
          <label className="flex items-center space-x-2 text-gray-600">
            <input type="checkbox" className="h-5 w-5" name="hasLegalAuthority" checked={form.gdprConsent.hasLegalAuthority} onChange={onGDPRChange} />
            <span>Has Legal Authority</span>
          </label>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithNHS" checked={form.gdprConsent.dataSharingPermissions.shareWithNHS} onChange={onGDPRDSPChange} />
              <span>Share with NHS</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithFamily" checked={form.gdprConsent.dataSharingPermissions.shareWithFamily} onChange={onGDPRDSPChange} />
              <span>Share with Family</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithCareTeam" checked={form.gdprConsent.dataSharingPermissions.shareWithCareTeam} onChange={onGDPRDSPChange} />
              <span>Share with Care Team</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareForResearch" checked={form.gdprConsent.dataSharingPermissions.shareForResearch} onChange={onGDPRDSPChange} />
              <span>Share for Research</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-600">
              <input type="checkbox" className="h-5 w-5" name="shareWithEmergencyServices" checked={form.gdprConsent.dataSharingPermissions.shareWithEmergencyServices} onChange={onGDPRDSPChange} />
              <span>Share with Emergency Services</span>
            </label>
            <label className="flex flex-col text-gray-600">
              Additional Permissions (comma-separated)
              <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="additionalPermissions" value={form.gdprConsent.dataSharingPermissions.additionalPermissions} onChange={onGDPRDSPChange} />
            </label>
          </div>
          </div>

<h2 className="text-2xl font-semibold text-blue-600">Other Details (optional)</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <label className="flex flex-col text-gray-600">
    Reason for Admission
    <input className="mt-1 border border-gray-600 rounded px-3 py-2" name="reasonForAdmission" value={form.reasonForAdmission} onChange={onChange} />
  </label>
  <label className="flex flex-col text-gray-600">
    Expected Length of Stay (days)
    <input type="number" min="0" className="mt-1 border border-gray-600 rounded px-3 py-2" name="expectedLengthOfStay" value={form.expectedLengthOfStay} onChange={onChange} />
  </label>
  <label className="flex flex-col text-gray-600">
    Funding Source
    <select className="mt-1 border border-gray-600 rounded px-3 py-2" name="fundingSource" value={form.fundingSource} onChange={onChange}>
      <option value="">Select</option>
      <option value="PRIVATE">Private</option>
      <option value="NHS">NHS</option>
      <option value="LOCAL_AUTHORITY">Local Authority</option>
      <option value="MIXED">Mixed</option>
    </select>
  </label>
  <label className="flex flex-col text-gray-600 md:col-span-3">
    Care Plan Summary
    <textarea className="mt-1 border border-gray-600 rounded px-3 py-2" name="carePlanSummary" value={form.carePlanSummary} onChange={onChange} />
  </label>
  <label className="flex flex-col text-gray-600 md:col-span-3">
    Notes
    <textarea className="mt-1 border border-gray-600 rounded px-3 py-2" name="notes" value={form.notes} onChange={onChange} />
  </label>
</div>

<div className="flex space-x-4 pt-6">
  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
    Submit
  </button>
  <button
    type="button"
    onClick={() => setForm(initialForm)}
    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
  >
    Reset
  </button>
</div>
</form>
</>
);
}

export default CareReceiverRegForm;