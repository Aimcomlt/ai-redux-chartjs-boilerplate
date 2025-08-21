import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Series {
  labels: unknown[];
  values: unknown[];
}

interface BrainState {
  status: string;
  hyperparams: Record<string, unknown>;
  predictions: Series;
  metrics: Series;
  modelJSON: unknown | null;
  norm: unknown | null;
}

const initialState: BrainState = {
  status: 'idle',
  hyperparams: {},
  predictions: {
    labels: [],
    values: [],
  },
  metrics: {
    labels: [],
    values: [],
  },
  modelJSON: null,
  norm: null,
};

const brainSlice = createSlice({
  name: 'brain',
  initialState,
  reducers: {
    setHyperparams(state, action: PayloadAction<Record<string, unknown>>) {
      state.hyperparams = action.payload;
    },
    setPredictions(state, action: PayloadAction<Partial<Series> | undefined>) {
      const { labels = [], values = [] } = action.payload || {};
      state.predictions.labels = labels;
      state.predictions.values = values;
    },
    setMetrics(state, action: PayloadAction<Partial<Series> | undefined>) {
      const { labels = [], values = [] } = action.payload || {};
      state.metrics.labels = labels;
      state.metrics.values = values;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setModel(
      state,
      action: PayloadAction<{ modelJSON?: unknown; norm?: unknown } | undefined>
    ) {
      const { modelJSON = null, norm = null } = action.payload || {};
      state.modelJSON = modelJSON;
      state.norm = norm;
    },
  },
});

export const {
  setHyperparams,
  setPredictions,
  setMetrics,
  setStatus,
  setModel,
} = brainSlice.actions;

export default brainSlice.reducer;
