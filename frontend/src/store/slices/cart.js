// store/slices/cart.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCartItems,
  addCartItem,
  increaseQuantity,
  decreaseQuantity,
  removeCartItem
} from '../../services/cartService';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
    count: 0,
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  setError: (state, action) => {
  const { cartItemId, message } = action.payload;
  state.items = state.items.map(item =>
    item.cart_item_id === cartItemId
      ? { ...item, error: message }
      : { ...item, error: null }
  );
}
,
    setCart: (state, action) => {
  state.items = Array.isArray(action.payload) ? action.payload : [];
  state.totalPrice = state.items.reduce((sum, item) => sum + Number(item.item_subtotal), 0);
  state.count = state.items.length;
},
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.item_subtotal = parseFloat(existingItem.product.price) * existingItem.quantity;
      } else {
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.cart_item_id === action.payload);
      if (item) {
        item.quantity += 1;
        item.item_subtotal = parseFloat(item.product.price) * item.quantity;
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.cart_item_id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.item_subtotal = parseFloat(item.product.price) * item.quantity;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.cart_item_id !== action.payload);
    }
  }
});

export const {
  setLoading,
  setError,
  setCart,
  addItem,
  incrementQuantity,
  decrementQuantity,
  removeItem
} = cartSlice.actions;

export const loadCart = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData));
    console.log(cartData)
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addToCart = (productId, quantity = 1) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await addCartItem(productId, quantity);
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData));
  } catch (error) {
    dispatch(setError(error.response?.data?.non_field_errors?.[0] || 'Failed to add item to cart'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const increaseItemQuantity = (cartItemId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await increaseQuantity(cartItemId); 
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData)); 
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const decreaseItemQuantity = (cartItemId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await decreaseQuantity(cartItemId);
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData));
  } catch (error) {
    dispatch(setError(error.message));
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData));
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeFromCart = (cartItemId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await removeCartItem(cartItemId);
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData));
  } catch (error) {
    dispatch(setError(error.message));
    const cartData = await fetchCartItems();
    dispatch(setCart(cartData));
  } finally {
    dispatch(setLoading(false));
  }
};

export default cartSlice.reducer;