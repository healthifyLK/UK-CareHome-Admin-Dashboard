import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class CaregiversService {
  async getAllCaregivers(locationId = null) {
    try {
      const queryParams = locationId ? `?locationId=${locationId}` : '';
      return await apiService.get(`${API_ENDPOINTS.CAREGIVERS.BASE}${queryParams}`);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      throw error;
    }
  }

  async getCaregiverById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.CAREGIVERS.BY_ID(id));
    } catch (error) {
      console.error('Error fetching caregiver:', error);
      throw error;
    }
  }

  async registerCaregiver(caregiverData) {
    try {
      return await apiService.post(API_ENDPOINTS.CAREGIVERS.REGISTER, caregiverData);
    } catch (error) {
      console.error('Error registering caregiver:', error);
      throw error;
    }
  }

  async updateCaregiver(id, caregiverData) {
    try {
      return await apiService.put(API_ENDPOINTS.CAREGIVERS.BY_ID(id), caregiverData);
    } catch (error) {
      console.error('Error updating caregiver:', error);
      throw error;
    }
  }

  async updateCaregiverStatus(id, status) {
    try {
      return await apiService.patch(API_ENDPOINTS.CAREGIVERS.STATUS(id), { status });
    } catch (error) {
      console.error('Error updating caregiver status:', error);
      throw error;
    }
  }
}

export default new CaregiversService();