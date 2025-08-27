// ============================================================
// File: src/store/index.ts
// ============================================================
import { configureStore } from '@reduxjs/toolkit';
import brainsReducer from '@/store/brainsSlice';
import datasetsReducer from '@/features/datasets/datasetsSlice';

export const store = configureStore({
  reducer: {
    brains: brainsReducer,
    datasets: datasetsReducer,
    // charts: chartsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
