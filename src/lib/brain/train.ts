import brain from 'brain.js';
import { buildInput } from '@/features/datasets/preprocess/buildInput';
import { minMax } from '@/features/datasets/preprocess/normalize';
import type { BrainConfig, SeriesPoint } from '@/types/brain';

export interface TrainBrainOptions {
  logProgress?: boolean;
  onProgress?: (iter: number, error: number, elapsedMs: number) => void;
}

export async function trainBrain(
  config: BrainConfig,
  dataset: { timestamps: number[]; open: number[] },
  opts: TrainBrainOptions = {},
): Promise<{
  predictions: SeriesPoint[];
  metrics: { mse: number; mae: number; mape: number };
  modelJSON: unknown;
  trainTimeMs: number;
}> {
  const t0 = performance.now();
  const { hyper, architecture } = config;
  const series = dataset.open;
  const normalized = minMax(series);
  const windowSize = Math.max(1, hyper.windowSize || 1);
  const built = buildInput(normalized, windowSize + 1);

  interface TrainStats {
    iterations: number;
    error: number;
  }
  const trainOpts: Record<string, unknown> = {
    iterations: hyper.iterations,
    errorThresh: hyper.errorThresh,
    learningRate: hyper.learningRate,
    momentum: hyper.momentum,
    beta1: hyper.beta1,
    beta2: hyper.beta2,
    epsilon: hyper.epsilon,
    log: false,
    callback: opts.logProgress
      ? (stats: TrainStats) => {
          opts.onProgress?.(
            stats.iterations,
            stats.error,
            performance.now() - t0,
          );
        }
      : undefined,
    callbackPeriod: 1,
  };
  type BrainNet = {
    train: (data: unknown, opts: Record<string, unknown>) => void;
    run: (input: unknown) => unknown;
    toJSON: () => unknown;
  };
  let net: BrainNet;
  let predictionsNorm: number[] = [];

  if (architecture.type === 'feedforward') {
    const trainingData = built.ff.map((w) => ({
      input: w.slice(0, windowSize),
      output: [w[windowSize]],
    }));
    net = new brain.NeuralNetwork({
      hiddenLayers: architecture.hiddenLayers,
      activation: architecture.activation,
    });
    net.train(trainingData, trainOpts);
    predictionsNorm = built.ff.map(
      (w) => (net.run(w.slice(0, windowSize)) as number[])[0],
    );
  } else {
    const sequences = built.rnn.map((seq) => seq.map(([v]) => v));
    net = new brain.recurrent.LSTMTimeStep({
      inputSize: 1,
      hiddenLayers: architecture.hiddenLayers,
      outputSize: 1,
      activation: architecture.activation,
    });
    net.train(sequences, trainOpts);
    predictionsNorm = sequences.map(
      (seq) => net.run(seq.slice(0, windowSize)) as number,
    );
  }

  const min = Math.min(...series);
  const max = Math.max(...series);
  const denorm = (v: number) => v * (max - min) + min;

  const predictions: SeriesPoint[] = predictionsNorm.map((y, i) => ({
    t: dataset.timestamps[i + windowSize],
    y: denorm(y),
  }));

  const actual = series.slice(windowSize, windowSize + predictionsNorm.length);
  const predValues = predictions.map((p) => p.y);
  const n = actual.length;
  const mse =
    n === 0
      ? 0
      : actual.reduce((sum, v, i) => {
          const diff = v - predValues[i];
          return sum + diff * diff;
        }, 0) / n;
  const mae =
    n === 0
      ? 0
      : actual.reduce((sum, v, i) => sum + Math.abs(v - predValues[i]), 0) / n;
  const mape =
    n === 0
      ? 0
      : (actual.reduce(
          (sum, v, i) => sum + Math.abs((v - predValues[i]) / (v || 1)),
          0,
        ) /
          n) *
        100;

  const modelJSON = net.toJSON();
  const trainTimeMs = performance.now() - t0;
  return { predictions, metrics: { mse, mae, mape }, modelJSON, trainTimeMs };
}
