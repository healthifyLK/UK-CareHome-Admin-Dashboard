import apiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      }, { includeAuth: false });

      if (response.access_token) {
        apiService.setAuthToken(response.access_token);
        return response;
      }
      throw new Error('No access token received');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData, {
        includeAuth: false,
      });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    apiService.removeAuthToken();
  }

  isAuthenticated() {
    return !!apiService.getAuthToken();
  }
}

export default new AuthService();