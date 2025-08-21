import { setMetrics, setModel, setStatus } from './brainSlice';
import type { AppDispatch, RootState } from '../../app/store';

// Thunk to kick off training in a web worker and funnel progress back into
// redux state.  It expects an object containing `{ series, hyperparams, norm }`.
// Progress messages from the worker are stored under `metrics` where the
// iteration number becomes the label and the error the value.

interface StartTrainingArgs {
  series?: unknown[];
  hyperparams?: Record<string, unknown>;
  norm?: unknown;
}

interface WorkerMessage {
  progress?: number;
  done?: { modelJSON: unknown; norm: unknown };
  error?: string;
}

export const startTraining = ({
  series = [],
  hyperparams = {},
  norm = null,
}: StartTrainingArgs) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const worker = new Worker(
      new URL('../../workers/trainBrain.worker.ts', import.meta.url),
      { type: 'module' }
    );

    dispatch(setStatus('training'));

    worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
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

