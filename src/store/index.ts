// ============================================================
// File: src/store/index.ts
// ============================================================
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import brainsReducer, { type BrainsState } from '@/store/brainsSlice';
import datasetsReducer, { type DatasetsState } from '@/features/datasets/datasetsSlice';
import chartsReducer, { type ChartsState } from '@/features/charts/chartsSlice';
import trainingReducer, { type TrainingState } from '@/features/training/trainingSlice';
import { loadSession, saveSession } from '@/lib/persist/session';

const preloaded = loadSession();

export const store = configureStore({
  reducer: {
    brains: brainsReducer,
    datasets: datasetsReducer,
    charts: chartsReducer,
    training: trainingReducer,
  },
  preloadedState: preloaded as PreloadedState<{
    brains: BrainsState;
    datasets: DatasetsState;
    charts: ChartsState;
    training: TrainingState;
  }>,
});

store.subscribe(() => saveSession(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
