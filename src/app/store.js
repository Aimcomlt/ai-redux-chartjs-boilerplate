import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import brainReducer from '../features/brain/brainSlice';
import { marketApi } from '../features/markets/marketApi';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    brain: brainReducer,
    [marketApi.reducerPath]: marketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(marketApi.middleware),
});
