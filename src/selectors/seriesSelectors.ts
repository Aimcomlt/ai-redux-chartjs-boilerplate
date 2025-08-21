import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';

const toArray = (series: unknown): unknown[] =>
  Array.isArray(series) ? series : Object.values(series || {});

const selectPredictions = (state: RootState) => state.brain.predictions;
const selectMetrics = (state: RootState) => state.brain.metrics;

interface RawSeries {
  labels?: unknown[] | Record<string, unknown>;
  values?: unknown[] | Record<string, unknown>;
}

interface Series {
  labels: unknown[];
  values: unknown[];
}

export const selectPredictionSeries = createSelector(
  [selectPredictions],
  ({ labels = [], values = [] }: RawSeries): Series => ({
    labels: toArray(labels),
    values: toArray(values),
  }),
);

export const selectMetricSeries = createSelector(
  [selectMetrics],
  ({ labels = [], values = [] }: RawSeries): Series => ({
    labels: toArray(labels),
    values: toArray(values),
  }),
);
