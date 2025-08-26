// ============================================================
// File: src/lib/brain/train.ts (scaffold/stub)
// ============================================================
import type { BrainConfig, SeriesPoint } from '@/types/brain';

// NOTE: Replace this stub with actual brain.js integration & dataset preprocessing.
export async function trainBrain(config: BrainConfig, dataset: any): Promise<{
  predictions: SeriesPoint[];
  metrics: { mse: number; mae: number; mape: number };
  modelJSON: unknown;
  trainTimeMs: number;
}> {
  const t0 = performance.now();

  // TODO: Build inputs from dataset (open price), normalize, windowing for FF, sequences for RNN/LSTM
  // TODO: Create brain.js network by config.architecture & hyper, fit on dataset
  // TODO: Generate predictions aligned to timestamps

  // Stub: echo baseline with tiny noise so UI wiring can proceed
  const points: SeriesPoint[] = (dataset?.series ?? []).map((p: any, i: number) => ({ t: p.t, y: p.y * (1 + (Math.sin(i/25)/100)) }));
  const metrics = { mse: 0.001, mae: 0.02, mape: 0.8 };
  const modelJSON = { mock: true, arch: config.architecture, hyper: config.hyper };

  const trainTimeMs = performance.now() - t0;
  await new Promise(r => setTimeout(r, 250)); // simulate work
  return { predictions: points, metrics, modelJSON, trainTimeMs };
}
