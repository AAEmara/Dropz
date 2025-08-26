import axiosInstance from './authService';

export const fetchCartItems = async () => {
  try {
    const response = await axiosInstance.get('/api/cart/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addCartItem = async (productId, quantity) => {
  try {
    const response = await axiosInstance.post('/api/cart/additem', {
      product_id: productId,
      quantity: quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const increaseQuantity = async (cartItemId) => {
  try {
    const response = await axiosInstance.post(`/api/cart/increase/${cartItemId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Unknown error" };
  }
};

export const decreaseQuantity = async (cartItemId) => {
  try {
    const response = await axiosInstance.post(`/api/cart/decrease/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error decreasing quantity:', error);
    throw error;
  }
};

export const removeCartItem = async (cartItemId) => {
  try {
    const response = await axiosInstance.delete(`/api/cart/delete/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};