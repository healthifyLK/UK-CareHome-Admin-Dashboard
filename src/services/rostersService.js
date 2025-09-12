import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class RostersService {
  async getRosters(startDate, endDate, locationId = null) {
    try {
      let queryParams = `?startDate=${startDate}&endDate=${endDate}`;
      if (locationId) {
        queryParams += `&locationId=${locationId}`;
      }
      return await apiService.get(`${API_ENDPOINTS.ROSTERS.BASE}${queryParams}`);
    } catch (error) {
      console.error('Error fetching rosters:', error);
      throw error;
    }
  }

  async getRosterById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.ROSTERS.BY_ID(id));
    } catch (error) {
      console.error('Error fetching roster:', error);
      throw error;
    }
  }

  async createRoster(rosterData) {
    try {
      return await apiService.post(API_ENDPOINTS.ROSTERS.BASE, rosterData);
    } catch (error) {
      console.error('Error creating roster:', error);
      throw error;
    }
  }

  async updateRoster(id, rosterData) {
    try {
      return await apiService.put(API_ENDPOINTS.ROSTERS.BY_ID(id), rosterData);
    } catch (error) {
      console.error('Error updating roster:', error);
      throw error;
    }
  }

  async confirmShift(id) {
    try {
      return await apiService.patch(API_ENDPOINTS.ROSTERS.CONFIRM(id));
    } catch (error) {
      console.error('Error confirming shift:', error);
      throw error;
    }
  }

  async startShift(id) {
    try {
      return await apiService.patch(API_ENDPOINTS.ROSTERS.START(id));
    } catch (error) {
      console.error('Error starting shift:', error);
      throw error;
    }
  }

  async completeShift(id) {
    try {
      return await apiService.patch(API_ENDPOINTS.ROSTERS.COMPLETE(id));
    } catch (error) {
      console.error('Error completing shift:', error);
      throw error;
    }
  }

  async deleteRoster(id) {
    try {
      return await apiService.delete(API_ENDPOINTS.ROSTERS.BY_ID(id));
    } catch (error) {
      console.error('Error deleting roster:', error);
      throw error;
    }
  }
}

export default new RostersService();