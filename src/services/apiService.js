import { API_CONFIG, API_ENDPOINTS } from '../config/apiConfig';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('authToken');
  }

  // Create headers with auth token
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Retry mechanism for failed requests
  async retryRequest(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt < this.retryAttempts && this.isRetryableError(error)) {
        await this.delay(this.retryDelay * attempt);
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  // Check if error is retryable
  isRetryableError(error) {
    return error.status >= 500 || error.status === 429 || error.name === 'NetworkError';
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic fetch method with timeout and retry
  async fetch(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        ...this.getHeaders(options.includeAuth !== false),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // GET request
  async get(url, options = {}) {
    return this.retryRequest(async () => {
      const response = await this.fetch(url, { ...options, method: 'GET' });
      return response.json();
    });
  }

  // POST request
  async post(url, data, options = {}) {
    return this.retryRequest(async () => {
      const response = await this.fetch(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    });
  }

  // PUT request
  async put(url, data, options = {}) {
    return this.retryRequest(async () => {
      const response = await this.fetch(url, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    });
  }

  // PATCH request
  async patch(url, data, options = {}) {
    return this.retryRequest(async () => {
      const response = await this.fetch(url, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response.json();
    });
  }

  // DELETE request
  async delete(url, options = {}) {
    return this.retryRequest(async () => {
      const response = await this.fetch(url, { ...options, method: 'DELETE' });
      return response.json();
    });
  }
}

export default new ApiService();