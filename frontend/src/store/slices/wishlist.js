// src/store/slices/wishlist.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../../services/wishlistService";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    count: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setWishlist: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.count = state.items.length;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.count += 1;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      state.count = state.items.length;
    },
  },
});

export const { setLoading, setError, setWishlist, addItem, removeItem } =
  wishlistSlice.actions;

// --- Thunks ---
export const loadWishlist = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const data = await fetchWishlist();
    dispatch(setWishlist(data.items));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addToWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const newItem = await addWishlistItem(productId);
    dispatch(addItem(newItem));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const removeFromWishlist = (productId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await removeWishlistItem(productId);
    dispatch(removeItem(productId));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default wishlistSlice.reducer;
