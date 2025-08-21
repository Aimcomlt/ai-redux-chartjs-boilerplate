import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import brainReducer from '../features/brain/brainSlice';
import chartSettingsReducer from '../features/chartSettings/chartSettingsSlice';
import { marketApi } from '../features/markets/marketApi';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    brain: brainReducer,
    chartSettings: chartSettingsReducer,
    [marketApi.reducerPath]: marketApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(marketApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
