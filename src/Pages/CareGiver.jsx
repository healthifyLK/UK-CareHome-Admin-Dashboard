import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../Components/BackButton';
import { Styles } from '../Styles/Styles';
import caregiversService from '../services/caregiversService';
import locationsService from '../services/locationService';

function CareGiver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caregiver, setCaregiver] = useState(null);
  const [location, setLocation] = useState(null);

  // Fetch caregiver details
  useEffect(() => {
    const loadCaregiver = async () => {
      try {
        setLoading(true);
        const caregiverData = await caregiversService.getCaregiverById(id);
        setCaregiver(caregiverData);
        
        // Load location details
        if (caregiverData.locationId) {
          const locationData = await locationsService.getLocationById(caregiverData.locationId);
          setLocation(locationData);
        }
      } catch (error) {
        console.error('Error loading caregiver:', error);
        navigate('/care-givers');
      } finally {
        setLoading(false);
      }
    };
    loadCaregiver();
  }, [id, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    employeeId: '',
    startDate: '',
    employmentType: '',
    shiftPreference: '',
    qualificationLevel: '',
    yearsOfExperience: '',
    specializations: [],
    firstAidCprCertified: false,
    firstAidCprExpiry: '',
    status: '',
    // Address
    street: '',
    city: '',
    county: '',
    postcode: '',
    country: '',
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    emergencyContactAddress: '',
  });

  // Update form data when caregiver loads
  useEffect(() => {
    if (caregiver) {
      setFormData({
        firstName: caregiver.firstName || '',
        lastName: caregiver.lastName || '',
        email: caregiver.email || '',
        phoneNumber: caregiver.phoneNumber || '',
        dateOfBirth: caregiver.dateOfBirth ? new Date(caregiver.dateOfBirth).toISOString().split('T')[0] : '',
        gender: caregiver.gender || '',
        employeeId: caregiver.employeeId || '',
        startDate: caregiver.startDate ? new Date(caregiver.startDate).toISOString().split('T')[0] : '',
        employmentType: caregiver.employmentType || '',
        shiftPreference: caregiver.shiftPreference || '',
        qualificationLevel: caregiver.qualificationLevel || '',
        yearsOfExperience: caregiver.yearsOfExperience || '',
        specializations: caregiver.specializations || [],
        firstAidCprCertified: caregiver.firstAidCprCertified || false,
        firstAidCprExpiry: caregiver.firstAidCprExpiry ? new Date(caregiver.firstAidCprExpiry).toISOString().split('T')[0] : '',
        status: caregiver.status || '',
      
        
        // Emergency Contact
        emergencyContactName: caregiver.emergencyContact?.name || '',
        emergencyContactRelationship: caregiver.emergencyContact?.relationship || '',
        emergencyContactPhone: caregiver.emergencyContact?.phoneNumber || '',
        emergencyContactEmail: caregiver.emergencyContact?.email || '',
        emergencyContactAddress: caregiver.emergencyContact?.address || '',
      });
    }
  }, [caregiver]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        gender: formData.gender,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        employmentType: formData.employmentType,
        shiftPreference: formData.shiftPreference,
        qualificationLevel: formData.qualificationLevel,
        yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        specializations: formData.specializations,
        firstAidCprCertified: formData.firstAidCprCertified,
        firstAidCprExpiry: formData.firstAidCprExpiry ? new Date(formData.firstAidCprExpiry) : null,
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phoneNumber: formData.emergencyContactPhone,
          email: formData.emergencyContactEmail,
          address: formData.emergencyContactAddress,
        }
      };

      await caregiversService.updateCaregiver(id, updateData);
      setIsEditing(false);
      // Reload caregiver data
      const updatedCaregiver = await caregiversService.getCaregiverById(id);
      setCaregiver(updatedCaregiver);
    } catch (error) {
      console.error('Error updating caregiver:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await caregiversService.updateCaregiverStatus(id, newStatus);
      setCaregiver(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
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

  if (loading) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading caregiver details...</div>
        </div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className={Styles.PageStyle}>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Caregiver not found</div>
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
            <Field label="Employee ID" name="employeeId" value={formData.employeeId} isEditing={isEditing} onChange={handleChange} />
            <Field label="First Name" name="firstName" value={formData.firstName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Last Name" name="lastName" value={formData.lastName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Email" name="email" type="email" value={formData.email} isEditing={isEditing} onChange={handleChange} />
            <Field label="Phone Number" name="phoneNumber" value={formData.phoneNumber} isEditing={isEditing} onChange={handleChange} />
            <Field label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} isEditing={isEditing} onChange={handleChange} />
            <Field label="Age" value={calculateAge(caregiver.dateOfBirth)} isEditing={false} />
            <SelectField
              label="Gender"
              name="gender"
              options={['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']}
              value={formData.gender}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Care Home" value={location?.name || 'Loading...'} isEditing={false} />
          </div>
        </section>

        {/* Employment Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Employment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Start Date" name="startDate" type="date" value={formData.startDate} isEditing={isEditing} onChange={handleChange} />
            <SelectField
              label="Employment Type"
              name="employmentType"
              options={['FULL_TIME', 'PART_TIME', 'CONTRACT', 'CASUAL']}
              value={formData.employmentType}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <SelectField
              label="Shift Preference"
              name="shiftPreference"
              options={['ANY', 'DAY', 'NIGHT', 'ROTATING']}
              value={formData.shiftPreference}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <SelectField
              label="Status"
              name="status"
              options={['ACTIVE', 'INACTIVE', 'SUSPENDED', 'TERMINATED', 'ON_LEAVE']}
              value={formData.status}
              isEditing={isEditing}
              onChange={(e) => {
                handleChange(e);
                if (!isEditing) {
                  handleStatusChange(e.target.value);
                }
              }}
            />
          </div>
        </section>

        {/* Professional Qualifications */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Professional Qualifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Qualification Level"
              name="qualificationLevel"
              options={['NONE', 'BASIC_CARE', 'NVQ_LEVEL_2', 'NVQ_LEVEL_3', 'NVQ_LEVEL_4', 'NVQ_LEVEL_5', 'REGISTERED_NURSE', 'SENIOR_CARER']}
              value={formData.qualificationLevel}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <Field label="Years of Experience" name="yearsOfExperience" type="number" value={formData.yearsOfExperience} isEditing={isEditing} onChange={handleChange} />
            <Field label="Specializations" name="specializations" value={formData.specializations.join(', ')} isEditing={isEditing} onChange={(e) => handleArrayChange('specializations', e.target.value)} />
            <CheckboxField label="First Aid/CPR Certified" name="firstAidCprCertified" checked={formData.firstAidCprCertified} isEditing={isEditing} onChange={handleChange} />
            <Field label="First Aid/CPR Expiry" name="firstAidCprExpiry" type="date" value={formData.firstAidCprExpiry} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section>

        {/* Home Address */}
        {/* <section>
          <h2 className="text-xl font-semibold mb-4">Home Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Street" name="street" value={formData.street} isEditing={isEditing} onChange={handleChange} />
            <Field label="City" name="city" value={formData.city} isEditing={isEditing} onChange={handleChange} />
            <Field label="County" name="county" value={formData.county} isEditing={isEditing} onChange={handleChange} />
            <Field label="Postcode" name="postcode" value={formData.postcode} isEditing={isEditing} onChange={handleChange} />
            <Field label="Country" name="country" value={formData.country} isEditing={isEditing} onChange={handleChange} />
          </div>
        </section> */}

        {/* Emergency Contact */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Contact Name" name="emergencyContactName" value={formData.emergencyContactName} isEditing={isEditing} onChange={handleChange} />
            <Field label="Relationship" name="emergencyContactRelationship" value={formData.emergencyContactRelationship} isEditing={isEditing} onChange={handleChange} />
            <Field label="Phone Number" name="emergencyContactPhone" value={formData.emergencyContactPhone} isEditing={isEditing} onChange={handleChange} />
            <Field label="Email" name="emergencyContactEmail" type="email" value={formData.emergencyContactEmail} isEditing={isEditing} onChange={handleChange} />
            <Field label="Address" name="emergencyContactAddress" value={formData.emergencyContactAddress} isEditing={isEditing} onChange={handleChange} />
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
      <p>{checked ? '' : ''}</p>
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

export default CareGiver;