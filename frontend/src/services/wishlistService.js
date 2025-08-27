import axiosInstance from "./authService";

export const fetchWishlist = async () => {
  try {
    const response = await axiosInstance.get("/api/wishlist/");
    return response.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};
export const fetchWishlistCount = async () => {
  try {
    const data = await fetchWishlist(); // reuse fetchWishlist
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return 0; // fallback
  }
};


export const addWishlistItem = async (productId) => {
  try {
    const response = await axiosInstance.post("/api/wishlist/add/", {
      product_id: productId,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

export const removeWishlistItem = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/api/wishlist/remove/${productId}/`);
    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    throw error;
  }
};
