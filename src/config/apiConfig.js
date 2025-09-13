// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:4500',
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  };
  
  // API Endpoints
  export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
    },
    LOCATIONS: {
      BASE: '/locations',
      BY_ID: (id) => `/locations/${id}`,
      STATS: (id) => `/locations/${id}/stats`,
      AVAILABLE_BEDS: (id) => `/locations/${id}/room-beds/available`,
    },
    CAREGIVERS: {
      BASE: '/caregivers',
      REGISTER: '/caregivers/register',
      BY_ID: (id) => `/caregivers/${id}`,
      STATUS: (id) => `/caregivers/${id}/status`,
    },
    CARE_RECEIVERS: {
      BASE: '/care-receivers',
      REGISTER: '/care-receivers/register',
      BY_ID: (id) => `/care-receivers/${id}`,
      DISCHARGE: (id) => `/care-receivers/${id}/discharge`,
    },
    ROOM_BEDS: {
      BASE: '/room-beds',
      BY_LOCATION: (locationId) => `/room-beds/location/${locationId}`,
      AVAILABLE: (locationId) => `/room-beds/location/${locationId}/available`,
      ASSIGN: '/room-beds/assign',
      UNASSIGN: (careReceiverId) => `/room-beds/unassign/${careReceiverId}`,
      ASSIGNMENT: (careReceiverId) => `/room-beds/assignment/${careReceiverId}`,
    },
    ROSTERS: {
      BASE: '/rosters',
      BY_ID: (id) => `/rosters/${id}`,
      CONFIRM: (id) => `/rosters/${id}/confirm`,
      START: (id) => `/rosters/${id}/start`,
      COMPLETE: (id) => `/rosters/${id}/complete`,
    },
  };