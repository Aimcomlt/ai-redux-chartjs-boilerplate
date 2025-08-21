import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import brainReducer from './brainSlice';
import { startTraining } from './brainThunks.js';

class MockWorker {
  static instances: MockWorker[] = [];
  onmessage: ((event: { data: any }) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();
  constructor() {
    MockWorker.instances.push(this);
  }
}

describe('startTraining', () => {
  beforeEach(() => {
    MockWorker.instances = [];
    // @ts-ignore
    globalThis.Worker = MockWorker as any;
  });

  it('updates metrics on progress messages', () => {
    const store = configureStore({ reducer: { brain: brainReducer } });
    store.dispatch(startTraining({}));
    const worker = MockWorker.instances[0];
    expect(store.getState().brain.status).toBe('training');

    worker.onmessage && worker.onmessage({ data: { progress: 0.42 } });

    const { metrics } = store.getState().brain;
    expect(metrics.labels).toEqual([1]);
    expect(metrics.values).toEqual([0.42]);
  });

  it('stores model and resets status on completion', () => {
    const store = configureStore({ reducer: { brain: brainReducer } });
    store.dispatch(startTraining({}));
    const worker = MockWorker.instances[0];

    const payload = { modelJSON: { foo: 'bar' }, norm: 1 };
    worker.onmessage && worker.onmessage({ data: { done: payload } });

    const state = store.getState().brain;
    expect(state.modelJSON).toEqual(payload.modelJSON);
    expect(state.norm).toBe(payload.norm);
    expect(state.status).toBe('idle');
    expect(worker.terminate).toHaveBeenCalled();
  });
});
