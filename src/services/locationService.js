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
      return await apiService.post(API_ENDPOINTS.LOCATIONS.BASE, locationData);
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
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