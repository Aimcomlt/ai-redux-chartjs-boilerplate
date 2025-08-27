// ============================================================
// File: src/store/index.ts
// ============================================================
import { configureStore, type PreloadedState } from '@reduxjs/toolkit';
import brainsReducer, { type BrainsState } from '@/store/brainsSlice';
import datasetsReducer, { type DatasetsState } from '@/features/datasets/datasetsSlice';
import { loadSession, saveSession } from '@/lib/persist/session';

const preloaded = loadSession();

export const store = configureStore({
  reducer: {
    brains: brainsReducer,
    datasets: datasetsReducer,
    // charts: chartsReducer,
  },
  preloadedState: preloaded as PreloadedState<{ brains: BrainsState; datasets: DatasetsState }>,
});

store.subscribe(() => saveSession(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
