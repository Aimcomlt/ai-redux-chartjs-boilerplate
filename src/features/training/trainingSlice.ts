import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { BrainConfig, PredictionPoint, TrainingMetrics } from '@/types/brain';
import { trainBrain } from '@/lib/brain/train';

export interface TrainingState {
  predictions: PredictionPoint[];
  metrics: TrainingMetrics | null;
  status: 'idle' | 'running' | 'complete' | 'error';
  error?: string;
  progress?: { iter: number; error: number; elapsedMs: number };
}

const initialState: TrainingState = {
  predictions: [],
  metrics: null,
  status: 'idle',
};

export interface TrainModelArgs {
  config: BrainConfig;
  dataset: { timestamps: number[]; open: number[] };
}

export const trainModelAsync = createAsyncThunk(
  'training/trainModel',
  async (
    { config, dataset }: TrainModelArgs,
    { dispatch },
  ) => {
    const result = await trainBrain(config, dataset, {
      logProgress: true,
      onProgress(iter, error, elapsedMs) {
        dispatch(progressUpdated({ iter, error, elapsedMs }));
      },
    });
    return result;
  },
);

export const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    progressUpdated(
      state,
      action: PayloadAction<{ iter: number; error: number; elapsedMs: number }>,
    ) {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(trainModelAsync.pending, (state) => {
        state.status = 'running';
        state.error = undefined;
        state.progress = undefined;
      })
      .addCase(trainModelAsync.fulfilled, (state, action) => {
        state.status = 'complete';
        state.predictions = action.payload.predictions;
        state.metrics = action.payload.metrics;
      })
      .addCase(trainModelAsync.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message;
      });
  },
});

export const { progressUpdated } = trainingSlice.actions;

export const selectPredictions = (state: RootState) =>
  state.training.predictions;
export const selectMetrics = (state: RootState) => state.training.metrics;
export const selectTrainingStatus = (state: RootState) => state.training.status;
export const selectProgress = (state: RootState) => state.training.progress;

export default trainingSlice.reducer;
