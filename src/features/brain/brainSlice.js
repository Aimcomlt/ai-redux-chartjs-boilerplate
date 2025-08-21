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
  },
});

export const { setHyperparams, setPredictions, setMetrics, setStatus } =
  brainSlice.actions;

export default brainSlice.reducer;
