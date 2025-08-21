import { describe, it, expect, vi, afterEach } from 'vitest';

let throwError = false;

vi.mock('brain.js', () => ({
  default: {
    recurrent: {
      LSTMTimeStep: class {
        train(_series, opts) {
          if (throwError) {
            throw new Error('fail');
          }
          opts.log(0.5);
        }
        toJSON() {
          return { model: true };
        }
      },
    },
  },
}));

const loadWorker = async () => {
  vi.resetModules();
  return import('./trainBrain.worker');
};

describe('trainBrain worker', () => {
  afterEach(() => {
    // @ts-expect-error: cleaning up mocked worker global
    delete globalThis.self;
    throwError = false;
  });

  it('posts progress and done messages', async () => {
    const postMessage = vi.fn();
    // @ts-expect-error: define worker global
    globalThis.self = { postMessage };
    await loadWorker();
    // @ts-expect-error: call worker handler
    self.onmessage({ data: { series: [], hyperparams: {}, norm: 'n' } });
    expect(postMessage).toHaveBeenNthCalledWith(1, { progress: 0.5 });
    expect(postMessage).toHaveBeenNthCalledWith(2, {
      done: { modelJSON: { model: true }, norm: 'n' },
    });
  });

  it('posts error messages', async () => {
    throwError = true;
    const postMessage = vi.fn();
    // @ts-expect-error: define worker global
    globalThis.self = { postMessage };
    await loadWorker();
    // @ts-expect-error: call worker handler
    self.onmessage({ data: {} });
    expect(postMessage).toHaveBeenCalledWith({ error: 'fail' });
  });
});
