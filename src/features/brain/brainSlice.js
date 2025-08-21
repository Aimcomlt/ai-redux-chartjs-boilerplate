import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    setHyperparams(state, action) {
      state.hyperparams = action.payload;
    },
    setPredictions(state, action) {
      const { labels = [], values = [] } = action.payload || {};
      state.predictions.labels = labels;
      state.predictions.values = values;
    },
    setMetrics(state, action) {
      const { labels = [], values = [] } = action.payload || {};
      state.metrics.labels = labels;
      state.metrics.values = values;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setModel(state, action) {
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
