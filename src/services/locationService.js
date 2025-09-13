import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class LocationsService {
  async getAllLocations(includeStats = true) {
    try {
      const queryParams = includeStats ? '?includeStats=true' : '';
      return await apiService.get(`${API_ENDPOINTS.LOCATIONS.BASE}${queryParams}`);
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  async getLocationById(id, includeStats = false) {
    try {
      const queryParams = includeStats ? '?includeStats=true' : '';
      return await apiService.get(`${API_ENDPOINTS.LOCATIONS.BY_ID(id)}${queryParams}`);
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  }

  async createLocation(locationData) {
    try {
      console.log('Creating location with data:', JSON.stringify(locationData, null, 2));
      
      // Clean the data - remove undefined values and ensure proper types
      const cleanedData = this.cleanLocationData(locationData);
      console.log('Cleaned location data:', JSON.stringify(cleanedData, null, 2));
      
      return await apiService.post(API_ENDPOINTS.LOCATIONS.BASE, cleanedData);
    } catch (error) {
      console.error('Error creating location:', error);
      
      // Try to get more detailed error information
      if (error.response) {
        try {
          const errorText = await error.response.text();
          console.error('Backend error response:', errorText);
        } catch (e) {
          console.error('Could not parse error response');
        }
      }
      
      throw error;
    }
  }

  // Helper method to clean location data
  cleanLocationData(data) {
    const cleaned = {};
    
    // Required fields
    if (data.name) cleaned.name = data.name.trim();
    if (data.address) cleaned.address = data.address.trim();
    
    // Optional fields - only include if they have values
    if (data.city && data.city.trim()) cleaned.city = data.city.trim();
    if (data.postcode && data.postcode.trim()) cleaned.postcode = data.postcode.trim();
    if (data.phoneNumber && data.phoneNumber.trim()) cleaned.phoneNumber = data.phoneNumber.trim();
    if (data.email && data.email.trim()) cleaned.email = data.email.trim();
    
    // Numeric fields - ensure they are numbers, not strings
    if (data.numberOfRooms !== undefined && data.numberOfRooms !== null && data.numberOfRooms !== '') {
      const num = parseInt(data.numberOfRooms);
      if (!isNaN(num) && num > 0) {
        cleaned.numberOfRooms = num;
      }
    }
    if (data.bedsPerRoom !== undefined && data.bedsPerRoom !== null && data.bedsPerRoom !== '') {
      const num = parseInt(data.bedsPerRoom);
      if (!isNaN(num) && num > 0 && num <= 26) {
        cleaned.bedsPerRoom = num;
      }
    }
    if (data.capacity !== undefined && data.capacity !== null && data.capacity !== '') {
      const num = parseInt(data.capacity);
      if (!isNaN(num) && num >= 0) {
        cleaned.capacity = num;
      }
    }
    
    // Boolean field
    cleaned.isActive = Boolean(data.isActive);
    
    // Settings object - only include if it has meaningful content
    if (data.settings && (data.settings.tagName || data.settings.note)) {
      cleaned.settings = {};
      if (data.settings.tagName && data.settings.tagName.trim()) {
        cleaned.settings.tagName = data.settings.tagName.trim();
      }
      if (data.settings.note && data.settings.note.trim()) {
        cleaned.settings.note = data.settings.note.trim();
      }
    } else {
      // Always include settings as empty object if not provided
      cleaned.settings = {};
    }
    
    return cleaned;
  }

  async updateLocation(id, locationData) {
    try {
      return await apiService.put(API_ENDPOINTS.LOCATIONS.BY_ID(id), locationData);
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async deleteLocation(id) {
    try {
      return await apiService.delete(API_ENDPOINTS.LOCATIONS.BY_ID(id));
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  async getLocationStats(id) {
    try {
      return await apiService.get(API_ENDPOINTS.LOCATIONS.STATS(id));
    } catch (error) {
      console.error('Error fetching location stats:', error);
      throw error;
    }
  }

  async getAvailableBeds(id) {
    try {
      return await apiService.get(API_ENDPOINTS.LOCATIONS.AVAILABLE_BEDS(id));
    } catch (error) {
      console.error('Error fetching available beds:', error);
      throw error;
    }
  }

  // New method for dashboard data
  async getDashboardData() {
    try {
      return await apiService.get(`${API_ENDPOINTS.LOCATIONS.BASE}/dashboard`);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
}

export default new LocationsService();