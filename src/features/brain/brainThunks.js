import { setMetrics, setModel, setStatus } from './brainSlice';

// Thunk to kick off training in a web worker and funnel progress back into
// redux state.  It expects an object containing `{ series, hyperparams, norm }`.
// Progress messages from the worker are stored under `metrics` where the
// iteration number becomes the label and the error the value.

export const startTraining = ({ series = [], hyperparams = {}, norm = null }) =>
  (dispatch, getState) => {
    const worker = new Worker(
      new URL('../../workers/trainBrain.worker.js', import.meta.url),
      { type: 'module' }
    );

    dispatch(setStatus('training'));

    worker.onmessage = ({ data }) => {
      const { progress, done, error } = data || {};

      if (typeof progress !== 'undefined') {
        const { metrics } = getState().brain;
        dispatch(
          setMetrics({
            labels: [...metrics.labels, metrics.labels.length + 1],
            values: [...metrics.values, progress],
          })
        );
      }

      if (done) {
        dispatch(setModel({ modelJSON: done.modelJSON, norm: done.norm }));
        dispatch(setStatus('idle'));
        worker.terminate();
      }

      if (error) {
        dispatch(setStatus('error'));
        worker.terminate();
      }
    };

    worker.postMessage({ series, hyperparams, norm });
  };

