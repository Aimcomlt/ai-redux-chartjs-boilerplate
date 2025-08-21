import brain from 'brain.js';

// Web worker responsible for training a brain.js network.
// It expects to receive a message containing:
//   { series, hyperparams, norm }
// and will respond with progress updates via `{ progress }` as training
// occurs.  When training finishes a `{ done: { modelJSON, norm } }` message
// is emitted.  If an error occurs a `{ error }` message is sent instead.

self.onmessage = function ({ data }) {
  const { series = [], hyperparams = {}, norm = null } = data || {};

  try {
    const net = new brain.recurrent.LSTMTimeStep(hyperparams);

    net.train(series, {
      ...hyperparams,
      // Forward any training progress to the main thread
      log: (error) => self.postMessage({ progress: error }),
    });

    const modelJSON = net.toJSON();
    self.postMessage({ done: { modelJSON, norm } });
  } catch (err) {
    self.postMessage({ error: err?.message || String(err) });
  }
};

