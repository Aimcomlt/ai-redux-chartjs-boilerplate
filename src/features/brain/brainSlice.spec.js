import { describe, it, expect } from 'vitest';
import reducer, {
  setHyperparams,
  setPredictions,
  setMetrics,
  setStatus,
  setModel,
} from './brainSlice';

const initialState = {
  status: 'idle',
  hyperparams: {},
  predictions: { labels: [], values: [] },
  metrics: { labels: [], values: [] },
  modelJSON: null,
  norm: null,
};

describe('brain reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setHyperparams', () => {
    const actual = reducer(initialState, setHyperparams({ lr: 0.1 }));
    expect(actual.hyperparams).toEqual({ lr: 0.1 });
  });

  it('should handle setPredictions with defaults', () => {
    const actual = reducer(initialState, setPredictions());
    expect(actual.predictions).toEqual({ labels: [], values: [] });
  });

  it('should handle setPredictions with values', () => {
    const actual = reducer(initialState, setPredictions({ labels: ['a'], values: [1] }));
    expect(actual.predictions).toEqual({ labels: ['a'], values: [1] });
  });

  it('should handle setMetrics', () => {
    const actual = reducer(initialState, setMetrics({ labels: ['m1'], values: [0.5] }));
    expect(actual.metrics).toEqual({ labels: ['m1'], values: [0.5] });
  });

  it('should handle setStatus', () => {
    const actual = reducer(initialState, setStatus('loading'));
    expect(actual.status).toBe('loading');
  });

  it('should handle setModel', () => {
    const model = { layers: [] };
    const actual = reducer(initialState, setModel({ modelJSON: model, norm: 1 }));
    expect(actual.modelJSON).toEqual(model);
    expect(actual.norm).toBe(1);
  });
});
