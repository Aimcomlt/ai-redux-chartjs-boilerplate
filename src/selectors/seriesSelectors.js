import { createSelector } from '@reduxjs/toolkit';

const toArray = (series) => (Array.isArray(series) ? series : Object.values(series || {}));

const selectPredictions = (state) => state.brain.predictions;
const selectMetrics = (state) => state.brain.metrics;

export const selectPredictionSeries = createSelector([selectPredictions], ({ labels = [], values = [] }) => ({
  labels: toArray(labels),
  values: toArray(values),
}));

export const selectMetricSeries = createSelector([selectMetrics], ({ labels = [], values = [] }) => ({
  labels: toArray(labels),
  values: toArray(values),
}));
