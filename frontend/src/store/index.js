// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cart';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
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