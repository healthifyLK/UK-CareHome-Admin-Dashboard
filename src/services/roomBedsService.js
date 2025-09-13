// Update src/services/roomBedsService.js
import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class RoomBedsService {
  async createRoomBed(data) {
    return await apiService.post(API_ENDPOINTS.ROOM_BEDS.BASE, data);
  }

  async getByLocation(locationId) {
    return await apiService.get(API_ENDPOINTS.ROOM_BEDS.BY_LOCATION(locationId));
  }

  async getAvailableByLocation(locationId) {
    return await apiService.get(API_ENDPOINTS.ROOM_BEDS.AVAILABLE(locationId));
  }

  async getAllRoomBeds() {
    // Since there's no direct "get all" endpoint, we'll need to get all locations first
    // and then fetch room beds for each location
    const locations = await apiService.get(API_ENDPOINTS.LOCATIONS.BASE);
    const allRoomBeds = [];
    
    for (const location of locations) {
      try {
        const roomBeds = await this.getByLocation(location.id);
        allRoomBeds.push(...roomBeds);
      } catch (error) {
        console.error(`Error fetching room beds for location ${location.id}:`, error);
      }
    }
    
    return allRoomBeds;
  }

  // New methods for bed assignment
  async assignCareReceiverToBed(careReceiverId, roomBedId) {
    try {
      return await apiService.post(API_ENDPOINTS.ROOM_BEDS.ASSIGN, {
        careReceiverId: careReceiverId,
        roomBedId: roomBedId
      });
    } catch (error) {
      console.error('Error assigning care receiver to bed:', error);
      throw error;
    }
  }

  async unassignCareReceiverFromBed(careReceiverId) {
    try {
      return await apiService.post(API_ENDPOINTS.ROOM_BEDS.UNASSIGN(careReceiverId));
    } catch (error) {
      console.error('Error unassigning care receiver from bed:', error);
      throw error;
    }
  }

  async getCareReceiverBedAssignment(careReceiverId) {
    try {
      return await apiService.get(API_ENDPOINTS.ROOM_BEDS.ASSIGNMENT(careReceiverId));
    } catch (error) {
      console.error('Error getting care receiver bed assignment:', error);
      throw error;
    }
  }
}

export default new RoomBedsService();