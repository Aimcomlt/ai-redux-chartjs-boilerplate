import { describe, it, expect, vi, afterEach } from 'vitest';

let shouldThrow = false;

vi.mock('@/lib/brain/train', () => ({
  trainBrain: vi.fn((_config, _dataset, opts) => {
    if (shouldThrow) throw new Error('fail');
    opts?.onProgress?.(1, 0.5, 10);
    return Promise.resolve({
      predictions: [{ t: 1, y: 2 }],
      metrics: { mse: 0, mae: 0, mape: 0 },
      modelJSON: { model: true },
      trainTimeMs: 5,
    });
  }),
}));

const loadWorker = async () => {
  vi.resetModules();
  return import('./train.worker');
};

describe('train worker', () => {
  afterEach(() => {
    // @ts-expect-error cleanup global
    delete globalThis.self;
    shouldThrow = false;
  });

  it('posts progress and done messages', async () => {
    const postMessage = vi.fn();
    // @ts-expect-error define worker global
    globalThis.self = { postMessage };
    await loadWorker();
    // @ts-expect-error invoke worker
    self.onmessage({ data: { config: {}, dataset: {}, logProgress: true } });
    await new Promise((r) => setTimeout(r, 0));
    expect(postMessage).toHaveBeenNthCalledWith(1, {
      type: 'progress',
      iter: 1,
      error: 0.5,
      elapsedMs: expect.any(Number),
    });
    expect(postMessage).toHaveBeenNthCalledWith(2, {
      type: 'done',
      result: {
        predictions: [{ t: 1, y: 2 }],
        metrics: { mse: 0, mae: 0, mape: 0 },
        modelJSON: { model: true },
        trainTimeMs: 5,
      },
    });
  });

  it('posts error messages', async () => {
    shouldThrow = true;
    const postMessage = vi.fn();
    // @ts-expect-error define worker global for error case
    globalThis.self = { postMessage };
    await loadWorker();
    // @ts-expect-error invoke worker with loose data
    self.onmessage({ data: { config: {}, dataset: {}, logProgress: false } });
    await new Promise((r) => setTimeout(r, 0));
    expect(postMessage).toHaveBeenCalledWith({ type: 'error', error: 'fail' });
  });
});
