import Healthify_Logo from './Images/Healthify-icon.png'
import CareHomesIcon from './Images/home-heart.svg'
import CareReceiversIcon from './Images/hand-holding-medical.svg'
import CareGiversIcon from './Images/user-nurse.svg'
import CareRosterIcon from './Images/calendar-clock.svg'
import CareBedsIcon from './Images/hospital-bed.svg'

export const IMG = [
    Healthify_Logo,
    CareHomesIcon,
    CareReceiversIcon,
    CareGiversIcon,
    CareRosterIcon,
    CareBedsIcon,
]

export const SideMenuItems = [
    {
        name: "Care Homes",
        icon: "fi fi-rr-home-heart",
        path: "/care-homes",
    },
    {
        name: "Care Receivers",
        icon: "fi fi-rr-hand-holding-medical",
        path: "/care-receivers"
    },
    {
        name: "Care Givers",
        icon: "fi fi-rr-user-nurse",
        path: "/care-givers"
    },
    {
        name: "Roster",
        icon: "fi fi-rr-calendar-clock",
        path: "/roster"
    },
    {
        name: "Care Beds",
        icon: "fi fi-rr-hospital-bed",
        path: "/care-beds"
    },
    
]

export const TableFilterBtn = ["Allocations", "Care Receivers", "Care Givers", "Beds", "Alerts"];


export const CareHomes = [
    {
        id: 1,
        name: "Care Home 2",
        status: "Active",
        location: "London",
        Total_Beds: 40,
        Occupied_Beds: 32,
        Allocations: [
            { id: 1, bed: "CH101", careReceiver: "John", careGiver1: "Max", careGiver2: "Hamilton" },
            { id: 2, bed: "CH102", careReceiver: "Sarah", careGiver1: "Alex", careGiver2: "Emma" },
            { id: 3, bed: "CH103", careReceiver: "Mike", careGiver1: "Lisa", careGiver2: "James" },
            { id: 4, bed: "CH104", careReceiver: "Anna", careGiver1: "David", careGiver2: "Sophie" },
            { id: 5, bed: "CH105", careReceiver: "Tom", careGiver1: "Kate", careGiver2: "Robert" },
            { id: 6, bed: "CH106", careReceiver: "Emma", careGiver1: "Nick", careGiver2: "Maria" },
            { id: 7, bed: "CH107", careReceiver: "Chris", careGiver1: "Amy", careGiver2: "Daniel" },
            { id: 8, bed: "CH108", careReceiver: "Lisa", careGiver1: "Ryan", careGiver2: "Jessica" },
            { id: 9, bed: "CH109", careReceiver: "David", careGiver1: "Sarah", careGiver2: "Michael" },
            { id: 10, bed: "CH110", careReceiver: "Sophie", careGiver1: "Tom", careGiver2: "Linda" },
        ],
        CareGivers: ["Hamilton", "Emma", "James", "Sophie", "Robert", "Maria", "Daniel", "Jessica", "Michael", "Linda", "Oliver", "Grace", "Nathan", "Victoria"],
    },
    {
        id: 2,
        name: "Care Home 3",
        status: "Active",
        location: "London",
        Total_Beds: 40,
        Occupied_Beds: 32,
    },
    {
        id: 3,
        name: "Care Home 4",
        status: "Closed",
        location: "London",
        Total_Beds: 40,
        Occupied_Beds: 32,
    },
]

export const CareHomeNames = ["Care Home 1", "Care Home 2", "Care Home 3", "Care Home 4"]

// ... existing code ...
export const careBedTableHeader = ["Room Number", "Bed Number", "Care Home", "Floor", "Wing", "Status", "Features", "Action"]

export const careGiverTableHeader = ["ID", "First Name", "Last Name", "Current Care Home", "Number of Patients", "Employment Type", "Action"]
export const careReceiverTableHeader = ["ID", "First Name", "Last Name", "Current Care Home", "Age", "Care Giver 1", "Admitted Date", "# of E. Contacts", "Flags", "Condition", "Action"]

export const availableCareGivers = ["Alice","Clara","Eva","Grace","Isabella","Jack","Karen",]


export const careBedsData = [
    { id: 1, bed: "CH101", CareHome: "Care Home 1", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 2, bed: "CH102", CareHome: "Care Home 1", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 3, bed: "CH103", CareHome: "Care Home 2", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 4, bed: "CH104", CareHome: "Care Home 3", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 5, bed: "CH105", CareHome: "Care Home 2", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 6, bed: "CH106", CareHome: "Care Home 1", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 7, bed: "CH107", CareHome: "Care Home 3", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 8, bed: "CH108", CareHome: "Care Home 1", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 9, bed: "CH109", CareHome: "Care Home 3", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
    { id: 10, bed: "CH110", CareHome: "Care Home 2", Brand: "XYZ", Model: "123", Status: "Occupied", Condition: "Good" },
]

export const careGiverData = [
  { id: 1, FirstName: "Alice", LastName: "Johnson", CareHome: "Care Home 2", P_count: 12, R_Leave: 2 },
  { id: 2, FirstName: "Brian", LastName: "Smith", CareHome: "Care Home 2", P_count: 8, R_Leave: 1 },
  { id: 3, FirstName: "Clara", LastName: "Shoemaker", CareHome: "Care Home 2", P_count: 15, R_Leave: 3 },
  { id: 4, FirstName: "Daniel", LastName: "Lee", CareHome: "Care Home 2", P_count: 10, R_Leave: 0 },
  { id: 5, FirstName: "Eva", LastName: "Martinez", CareHome: "Care Home 2", P_count: 9, R_Leave: 2 },
  { id: 6, FirstName: "Frank", LastName: "Brown", CareHome: "Care Home 2", P_count: 7, R_Leave: 1 },
  { id: 7, FirstName: "Grace", LastName: "Kim", CareHome: "Care Home 2", P_count: 14, R_Leave: 0 },
  { id: 8, FirstName: "Henry", LastName: "Wilson", CareHome: "Care Home 2", P_count: 11, R_Leave: 3 },
  { id: 9, FirstName: "Isabella", LastName: "Davis", CareHome: "Care Home 2", P_count: 8, R_Leave: 1 },
  { id: 10, FirstName: "Jack", LastName: "Garcia", CareHome: "Care Home 2", P_count: 13, R_Leave: 2 },
  { id: 11, FirstName: "Karen", LastName: "Nguyen", CareHome: "Care Home 2", P_count: 9, R_Leave: 0 },
  { id: 12, FirstName: "Leo", LastName: "Gonzalez", CareHome: "Care Home 2", P_count: 10, R_Leave: 1 },
  { id: 13, FirstName: "Mia", LastName: "Patel", CareHome: "Care Home 2", P_count: 12, R_Leave: 2 },
  { id: 14, FirstName: "Noah", LastName: "Clark", CareHome: "Care Home 2", P_count: 7, R_Leave: 0 },
  { id: 15, FirstName: "Olivia", LastName: "Rodriguez", CareHome: "Care Home 2", P_count: 11, R_Leave: 2 }
];

export const careReceiverData = [
  { id: 1, FirstName: "John", LastName: "Doe", CareHome: "Care Home 2", Age: 72, CareGiver1: "Alice", CareGiver2: "Brian", EmergencyContacts: 3, Flags: "None", Condition: "Stable" },
  { id: 2, FirstName: "Mary", LastName: "Smith", CareHome: "Care Home 2", Age: 68, CareGiver1: "Clara", CareGiver2: "Daniel", EmergencyContacts: 2, Flags: "Fall Risk", Condition: "Recovering" },
  { id: 3, FirstName: "James", LastName: "White", CareHome: "Care Home 2", Age: 80, CareGiver1: "Eva", CareGiver2: "Frank", EmergencyContacts: 1, Flags: "Diabetic", Condition: "Stable" },
  { id: 4, FirstName: "Patricia", LastName: "Johnson", CareHome: "Care Home 2", Age: 75, CareGiver1: "Grace", CareGiver2: "Henry", EmergencyContacts: 4, Flags: "None", Condition: "Under Observation" },
  { id: 5, FirstName: "Robert", LastName: "Brown", CareHome: "Care Home 2", Age: 78, CareGiver1: "Isabella", CareGiver2: "Jack", EmergencyContacts: 2, Flags: "High Blood Pressure", Condition: "Stable" },
  { id: 6, FirstName: "Linda", LastName: "Garcia", CareHome: "Care Home 2", Age: 70, CareGiver1: "Karen", CareGiver2: "Leo", EmergencyContacts: 3, Flags: "None", Condition: "Recovering" },
  { id: 7, FirstName: "Charles", LastName: "Martinez", CareHome: "Care Home 2", Age: 82, CareGiver1: "Mia", CareGiver2: "Noah", EmergencyContacts: 1, Flags: "None", Condition: "Stable" },
  { id: 8, FirstName: "Barbara", LastName: "Davis", CareHome: "Care Home 2", Age: 69, CareGiver1: "Olivia", CareGiver2: "Paul", EmergencyContacts: 2, Flags: "Memory Loss", Condition: "Under Observation" },
  { id: 9, FirstName: "Michael", LastName: "Lopez", CareHome: "Care Home 2", Age: 76, CareGiver1: "Quinn", CareGiver2: "Rachel", EmergencyContacts: 3, Flags: "Fall Risk", Condition: "Stable" },
  { id: 10, FirstName: "Elizabeth", LastName: "Gonzalez", CareHome: "Care Home 2", Age: 74, CareGiver1: "Steve", CareGiver2: "Tom", EmergencyContacts: 2, Flags: "None", Condition: "Recovering" },
  { id: 11, FirstName: "Joseph", LastName: "Wilson", CareHome: "Care Home 2", Age: 73, CareGiver1: "Uma", CareGiver2: "Victor", EmergencyContacts: 3, Flags: "Diabetic", Condition: "Stable" },
  { id: 12, FirstName: "Susan", LastName: "Anderson", CareHome: "Care Home 2", Age: 71, CareGiver1: "Wendy", CareGiver2: "Xavier", EmergencyContacts: 2, Flags: "None", Condition: "Under Observation" },
  { id: 13, FirstName: "Thomas", LastName: "Thomas", CareHome: "Care Home 2", Age: 77, CareGiver1: "Yara", CareGiver2: "Zach", EmergencyContacts: 1, Flags: "High Blood Pressure", Condition: "Stable" },
  { id: 14, FirstName: "Jessica", LastName: "Taylor", CareHome: "Care Home 2", Age: 67, CareGiver1: "Alice", CareGiver2: "Brian", EmergencyContacts: 3, Flags: "None", Condition: "Recovering" },
  { id: 15, FirstName: "Daniel", LastName: "Moore", CareHome: "Care Home 2", Age: 79, CareGiver1: "Clara", CareGiver2: "Daniel", EmergencyContacts: 2, Flags: "None", Condition: "Stable" }
];

export const CareGiverShifts = [
    {
      id: "e060d904-5db5-428f-b638-89509d741b79",
      locationId: "d7a5138b-33ee-4ebe-b678-4f6f889f5686",
      caregiverId: "054d6dda-8119-4855-ae17-ca8b9e4a969d",
      roomBedId: "b1b9cd24-0d19-4f76-a3aa-f6645b7df677",
      shiftDate: "2025-09-13T00:00:00.000Z",
      shiftType: "FULL_DAY",
      startTime: "08:00:00",
      endTime: "20:00:00",
      status: "PUBLISHED",
      shiftStatus: "SCHEDULED",
      notes: "Regular care shift for Nroshan",
      duration: 12,
      caregiver: { name: "Sarah Johnson", id: "054d6dda-8119-4855-ae17-ca8b9e4a969d" },
      location: { name: "Main Ward A", id: "d7a5138b-33ee-4ebe-b678-4f6f889f5686" }
    },
    {
      id: "e060d904-5db5-428f-b638-89509d741b80",
      locationId: "d7a5138b-33ee-4ebe-b678-4f6f889f5686",
      caregiverId: "054d6dda-8119-4855-ae17-ca8b9e4a969d",
      roomBedId: "b1b9cd24-0d19-4f76-a3aa-f6645b7df677",
      shiftDate: "2025-09-14T00:00:00.000Z",
      shiftType: "MORNING",
      startTime: "06:00:00",
      endTime: "14:00:00",
      status: "PUBLISHED",
      shiftStatus: "SCHEDULED",
      notes: "Morning shift",
      duration: 8,
      caregiver: { name: "Sarah Johnson", id: "054d6dda-8119-4855-ae17-ca8b9e4a969d" },
      location: { name: "Main Ward A", id: "d7a5138b-33ee-4ebe-b678-4f6f889f5686" }
    },
    {
      id: "e060d904-5db5-428f-b638-89509d741b81",
      locationId: "d7a5138b-33ee-4ebe-b678-4f6f889f5687",
      caregiverId: "054d6dda-8119-4855-ae17-ca8b9e4a969e",
      roomBedId: "b1b9cd24-0d19-4f76-a3aa-f6645b7df678",
      shiftDate: "2025-09-13T00:00:00.000Z",
      shiftType: "NIGHT",
      startTime: "22:00:00",
      endTime: "06:00:00",
      status: "PUBLISHED",
      shiftStatus: "SCHEDULED",
      notes: "Night shift coverage",
      duration: 8,
      caregiver: { name: "Michael Chen", id: "054d6dda-8119-4855-ae17-ca8b9e4a969e" },
      location: { name: "ICU Ward", id: "d7a5138b-33ee-4ebe-b678-4f6f889f5687" }
    },
    {
      id: "e060d904-5db5-428f-b638-89509d741b82",
      locationId: "d7a5138b-33ee-4ebe-b678-4f6f889f5688",
      caregiverId: "054d6dda-8119-4855-ae17-ca8b9e4a969f",
      roomBedId: "b1b9cd24-0d19-4f76-a3aa-f6645b7df679",
      shiftDate: "2025-09-15T00:00:00.000Z",
      shiftType: "EVENING",
      startTime: "14:00:00",
      endTime: "22:00:00",
      status: "PUBLISHED",
      shiftStatus: "SCHEDULED",
      notes: "Evening care duties",
      duration: 8,
      caregiver: { name: "Emma Wilson", id: "054d6dda-8119-4855-ae17-ca8b9e4a969f" },
      location: { name: "Pediatric Ward", id: "d7a5138b-33ee-4ebe-b678-4f6f889f5688" }
    }
  ]
