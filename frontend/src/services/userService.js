import axiosInstance, { API_ENDPOINTS } from '../api/config.js';

/**
 * User service to handle user-related API calls
 */
export const userService = {
  /**
   * Fetch current user information
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.ME);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },

  /**
   * Update current user information
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateCurrentUser(userData) {
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.USER.ME, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },
};

export default userService;
