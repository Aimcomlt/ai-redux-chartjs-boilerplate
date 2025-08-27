import type { BrainConfig } from '@/types/brain';
import { trainBrain } from '@/lib/brain/train';

interface TrainWorkerMessage {
  config: BrainConfig;
  dataset: { timestamps: number[]; open: number[] };
  logProgress?: boolean;
}

self.onmessage = async ({ data }: MessageEvent<TrainWorkerMessage>) => {
  const { config, dataset, logProgress } = data;
  const start = performance.now();
  try {
    const result = await trainBrain(config, dataset, {
      logProgress,
      onProgress: (iter, error) => {
        if (logProgress) {
          self.postMessage({
            type: 'progress',
            iter,
            error,
            elapsedMs: performance.now() - start,
          });
        }
      },
    });
    self.postMessage({ type: 'done', result });
  } catch (err) {
    self.postMessage({ type: 'error', error: (err as Error).message });
  }
};
