// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cart';
import wishlistReducer from './slices/wishlist';
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist:wishlistReducer
    // other reducers...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;