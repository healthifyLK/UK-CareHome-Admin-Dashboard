import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class CareReceiversService {
  async getAllCareReceivers(locationId = null) {
    try {
      const queryParams = locationId ? `?locationId=${locationId}` : '';
      return await apiService.get(`${API_ENDPOINTS.CARE_RECEIVERS.BASE}${queryParams}`);
    } catch (error) {
      console.error('Error fetching care receivers:', error);
      throw error;
    }
  }

  async getCareReceiverById(id) {
    try {
      return await apiService.get(API_ENDPOINTS.CARE_RECEIVERS.BY_ID(id));
    } catch (error) {
      console.error('Error fetching care receiver:', error);
      throw error;
    }
  }

  async registerCareReceiver(careReceiverData) {
    try {
      return await apiService.post(API_ENDPOINTS.CARE_RECEIVERS.REGISTER, careReceiverData);
    } catch (error) {
      console.error('Error registering care receiver:', error);
      throw error;
    }
  }

  async updateCareReceiver(id, careReceiverData) {
    try {
      return await apiService.put(API_ENDPOINTS.CARE_RECEIVERS.BY_ID(id), careReceiverData);
    } catch (error) {
      console.error('Error updating care receiver:', error);
      throw error;
    }
  }

  async dischargeCareReceiver(id) {
    try {
      return await apiService.post(API_ENDPOINTS.CARE_RECEIVERS.DISCHARGE(id));
    } catch (error) {
      console.error('Error discharging care receiver:', error);
      throw error;
    }
  }
}

export default new CareReceiversService();