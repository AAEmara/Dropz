import axiosInstance from "../services/authService";

export const fetchProducts = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/api/products/", { params });
    // The API returns a paginated response with products in the 'results' array
    return Array.isArray(response.data?.results) ? response.data.results : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
