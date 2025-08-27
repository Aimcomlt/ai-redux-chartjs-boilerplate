// ============================================================
// File: src/types/brain.ts
// ============================================================
export type BrainId = string;

export type BrainModelType = 'feedforward' | 'rnn' | 'lstm';
export type Activation =
  | 'sigmoid'
  | 'relu'
  | 'leaky-relu'
  | 'tanh'
  | 'threshold';

export interface BrainHyperparams {
  learningRate: number; // 0.001 - 0.5
  momentum?: number; // optional for SGD
  iterations: number; // max iterations
  errorThresh: number; // early stop when <=
  windowSize?: number; // time window for FF inputs
  // Adam advanced (optional)
  beta1?: number;
  beta2?: number;
  epsilon?: number;
}

export interface BrainArchitecture {
  type: BrainModelType;
  hiddenLayers: number[]; // e.g., [32, 16]
  activation: Activation;
}

export interface BrainConfig {
  id: BrainId;
  name: string;
  architecture: BrainArchitecture;
  hyper: BrainHyperparams;
  createdAt: number;
  updatedAt: number;
}

export interface BrainMetrics {
  mse?: number;
  mae?: number;
  mape?: number;
  trainTimeMs?: number;
}

export interface BrainRuntime {
  status: 'idle' | 'training' | 'ready' | 'error';
  error?: string;
  progress?: { iter: number; error: number; elapsedMs: number };
}

export interface BrainModelSerialized {
  // JSON produced by brain.js network.toJSON()
  json: unknown;
}

export interface BrainRecord {
  config: BrainConfig;
  runtime: BrainRuntime;
  metrics: BrainMetrics;
  model?: BrainModelSerialized; // populated when trained/saved
  color?: string; // UI line color assignment
}

// Series point for charting (time, value)
export interface SeriesPoint {
  t: number;
  y: number;
}

export interface BrainPredictionSeries {
  brainId: BrainId;
  points: SeriesPoint[];
}
