// ============================================================
// File: src/store/index.ts
// ============================================================
import { configureStore } from '@reduxjs/toolkit';
import brainsReducer from '@/store/brainsSlice';

export const store = configureStore({
  reducer: {
    brains: brainsReducer,
    // datasets: datasetsReducer, // add when ready
    // charts: chartsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
