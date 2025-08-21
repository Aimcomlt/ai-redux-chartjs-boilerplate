import brain from 'brain.js';

// Web worker responsible for training a brain.js network.
// It expects to receive a message containing:
//   { series, hyperparams, norm }
// and will respond with progress updates via `{ progress }` as training
// occurs.  When training finishes a `{ done: { modelJSON, norm } }` message
// is emitted.  If an error occurs a `{ error }` message is sent instead.

interface TrainingMessage {
  series?: unknown[];
  hyperparams?: Record<string, unknown>;
  norm?: unknown;
}

interface WorkerResponse {
  progress?: number;
  done?: { modelJSON: unknown; norm: unknown };
  error?: string;
}

type LSTM = {
  train: (series: unknown, opts: Record<string, unknown>) => void;
  toJSON: () => unknown;
};

self.onmessage = function ({ data }: MessageEvent<TrainingMessage>) {
  const { series = [], hyperparams = {}, norm = null } = data || {};

  try {
    const NetConstructor = (brain as unknown as {
      recurrent: { LSTMTimeStep: new (opts?: unknown) => LSTM };
    }).recurrent.LSTMTimeStep;
    const net = new NetConstructor(hyperparams);

    net.train(series, {
      ...hyperparams,
      // Forward any training progress to the main thread
      log: (error: number) =>
        self.postMessage({ progress: error } as WorkerResponse),
    });

    const modelJSON = net.toJSON();
    self.postMessage({ done: { modelJSON, norm } } as WorkerResponse);
  } catch (err) {
    self.postMessage({ error: (err as Error)?.message || String(err) } as WorkerResponse);
  }
};

