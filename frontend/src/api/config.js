import axios from "axios";

// Create the instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Needed to send HttpOnly refresh cookie
});

// Request interceptor: attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by refreshing token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login/") &&
      !originalRequest.url.includes("/api/auth/refresh_token/")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/api/auth/refresh_token/");
        const newAccessToken = res.data.access;

        // Save the new access token
        localStorage.setItem("access_token", newAccessToken);

        // Set new token in the header and retry the request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // Optionally clear localStorage or redirect to login
        localStorage.removeItem("access_token");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;