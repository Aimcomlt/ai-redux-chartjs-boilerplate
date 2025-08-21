import { describe, it, expect } from 'vitest';
import { selectPredictionSeries, selectMetricSeries } from './seriesSelectors';
import type { RootState } from '../app/store';

describe('series selectors', () => {
  const baseState = {
    brain: {
      predictions: { labels: ['a', 'b'], values: [1, 2] },
      metrics: { labels: { l1: 'x', l2: 'y' }, values: { v1: 0.1, v2: 0.2 } },
    },
  } as unknown as RootState;

  it('returns prediction series arrays', () => {
    const result = selectPredictionSeries(baseState);
    expect(result).toEqual({ labels: ['a', 'b'], values: [1, 2] });
  });

  it('converts metric objects to arrays', () => {
    const result = selectMetricSeries(baseState);
    expect(result).toEqual({ labels: ['x', 'y'], values: [0.1, 0.2] });
  });

  it('handles empty state gracefully', () => {
    const result = selectMetricSeries({ brain: { metrics: {} } } as unknown as RootState);
    expect(result).toEqual({ labels: [], values: [] });
  });
});
