import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { loadDataset } from './loadDataset';
import { minMax } from './preprocess/normalize';

export interface DatasetRecord {
  id: string;
  timestamps: number[];
  open: number[];
  normalized: number[];
  series: { t: number; y: number }[];
}

export interface DatasetsState {
  byId: Record<string, DatasetRecord>;
  allIds: string[];
  activeDatasetId: string | null;
}

const initialState: DatasetsState = {
  byId: {},
  allIds: [],
  activeDatasetId: null,
};

export const loadDatasetRequested = createAsyncThunk(
  'datasets/load',
  async (id: string) => {
    const { timestamps, open } = await loadDataset(id);
    const series = timestamps.map((t, i) => ({ t, y: open[i] }));
    const normalized = minMax(open);
    return { id, timestamps, open, normalized, series } as DatasetRecord;
  }
);

const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    setActiveDataset(state, action: PayloadAction<string | null>) {
      state.activeDatasetId = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(loadDatasetRequested.fulfilled, (state, action) => {
      const rec = action.payload as DatasetRecord;
      state.byId[rec.id] = rec;
      if (!state.allIds.includes(rec.id)) state.allIds.push(rec.id);
      if (!state.activeDatasetId) state.activeDatasetId = rec.id;
    });
  },
});

export const { setActiveDataset } = datasetsSlice.actions;
export default datasetsSlice.reducer;

export const selectDatasets = (state: RootState) => state.datasets;
export const selectActiveDatasetId = (state: RootState) => state.datasets.activeDatasetId;
export const selectTimestamps = (state: RootState) => {
  const id = state.datasets.activeDatasetId;
  return id ? state.datasets.byId[id]?.timestamps ?? [] : [];
};
export const selectOpenSeries = (state: RootState) => {
  const id = state.datasets.activeDatasetId;
  return id ? state.datasets.byId[id]?.open ?? [] : [];
};
export const selectNormalizedSeries = (state: RootState) => {
  const id = state.datasets.activeDatasetId;
  return id ? state.datasets.byId[id]?.normalized ?? [] : [];
};
