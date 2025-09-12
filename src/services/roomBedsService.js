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
}

export default new RoomBedsService();