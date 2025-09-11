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
        name: "Care Home 02",
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
        name: "Care Home 03",
        status: "Active",
        location: "London",
        Total_Beds: 40,
        Occupied_Beds: 32,
    },
    {
        id: 3,
        name: "Care Home 04",
        status: "Closed",
        location: "London",
        Total_Beds: 40,
        Occupied_Beds: 32,
    },
]

export const careBedsData = [
    { id: 1, bed: "CH101", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 2, bed: "CH102", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 3, bed: "CH103", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 4, bed: "CH104", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 5, bed: "CH105", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 6, bed: "CH106", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 7, bed: "CH107", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 8, bed: "CH108", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 9, bed: "CH109", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
    { id: 10, bed: "CH110", CareHome: "Care Home 1", Status: "Occupied", Condition: "Good" },
]