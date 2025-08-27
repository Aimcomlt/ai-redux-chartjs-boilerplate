// ============================================================
// File: src/store/brainsSlice.ts
// ============================================================
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import type {
  BrainArchitecture,
  BrainConfig,
  BrainHyperparams,
  BrainId,
  BrainMetrics,
  BrainRecord,
  BrainPredictionSeries,
  SeriesPoint,
} from '@/types/brain';
import { assignColor } from '@/styles/ColorRegistry';
import type { RootState } from '@/store';
import type { DatasetRecord } from '@/features/datasets/datasetsSlice';

export interface BrainsState {
  byId: Record<BrainId, BrainRecord>;
  allIds: BrainId[];
  predictions: Record<BrainId, BrainPredictionSeries>; // latest predictions per brain
}

const initialState: BrainsState = {
  byId: {},
  allIds: [],
  predictions: {},
};

export interface CreateBrainPayload {
  name?: string;
  architecture?: Partial<BrainArchitecture>;
  hyper?: Partial<BrainHyperparams>;
}

const DEFAULT_ARCH: BrainArchitecture = {
  type: 'lstm',
  hiddenLayers: [32],
  activation: 'sigmoid',
};

const DEFAULT_HYPER: BrainHyperparams = {
  learningRate: 0.01,
  iterations: 2000,
  errorThresh: 0.005,
  windowSize: 20,
  momentum: 0.1,
  beta1: 0.9,
  beta2: 0.999,
  epsilon: 1e-8,
};

export const createBrain = createAsyncThunk(
  'brains/create',
  async (payload: CreateBrainPayload | undefined) => {
    const id = `brain_${nanoid(8)}`;
    const now = Date.now();
    const config: BrainConfig = {
      id,
      name: payload?.name ?? `Brain ${id.slice(-4)}`,
      architecture: {
        ...DEFAULT_ARCH,
        ...(payload?.architecture ?? {}),
      } as BrainArchitecture,
      hyper: {
        ...DEFAULT_HYPER,
        ...(payload?.hyper ?? {}),
      } as BrainHyperparams,
      createdAt: now,
      updatedAt: now,
    };
    const record: BrainRecord = {
      config,
      runtime: { status: 'idle' },
      metrics: {},
      color: assignColor(id),
    };
    // return for reducer
    return record;
  },
);

export interface TrainBrainArgs {
  brainId: BrainId;
  datasetId: string; // e.g., 'open'
}

interface TrainFulfilled {
  brainId: BrainId;
  series: BrainPredictionSeries;
  metrics: BrainMetrics & { trainTimeMs: number };
  modelJSON: unknown;
}

export const trainBrainRequested = createAsyncThunk<
  TrainFulfilled,
  TrainBrainArgs,
  { state: RootState }
>(
  'brains/train',
  async ({ brainId, datasetId }: TrainBrainArgs, { getState, dispatch }) => {
    const state = getState();
    const record = state.brains.byId[brainId];
    if (!record) throw new Error('Brain not found');

    const dataset: DatasetRecord | undefined = state.datasets.byId?.[datasetId];
    if (!dataset) throw new Error('Dataset not found');

    const worker = new Worker(
      new URL('../workers/train.worker.ts', import.meta.url),
      {
        type: 'module',
      },
    );

    return await new Promise<TrainFulfilled>((resolve, reject) => {
      worker.onmessage = (e) => {
        const data = e.data;
        if (data.type === 'progress') {
          dispatch(
            trainingProgress({
              brainId,
              iter: data.iter,
              error: data.error,
              elapsedMs: data.elapsedMs,
            }),
          );
        } else if (data.type === 'done') {
          const { predictions, metrics, modelJSON, trainTimeMs } =
            data.result as {
              predictions: SeriesPoint[];
              metrics: BrainMetrics;
              modelJSON: unknown;
              trainTimeMs: number;
            };
          const series: BrainPredictionSeries = {
            brainId,
            points: predictions,
          };
          resolve({
            brainId,
            series,
            metrics: { ...metrics, trainTimeMs },
            modelJSON,
          });
          worker.terminate();
        } else if (data.type === 'error') {
          reject(new Error(data.error));
          worker.terminate();
        }
      };
      worker.postMessage({ config: record.config, dataset, logProgress: true });
    });
  },
);

const brainsSlice = createSlice({
  name: 'brains',
  initialState,
  reducers: {
    removeBrain(state, action: PayloadAction<BrainId>) {
      const id = action.payload;
      delete state.byId[id];
      delete state.predictions[id];
      state.allIds = state.allIds.filter((x) => x !== id);
    },
    loadBrainFromJSON(
      state,
      action: PayloadAction<{ id?: BrainId; name?: string; json: unknown }>,
    ) {
      const id = action.payload.id ?? `brain_${nanoid(8)}`;
      const now = Date.now();
      state.byId[id] = {
        config: {
          id,
          name: action.payload.name ?? `Imported ${id.slice(-4)}`,
          architecture: DEFAULT_ARCH,
          hyper: DEFAULT_HYPER,
          createdAt: now,
          updatedAt: now,
        },
        runtime: { status: 'ready' },
        metrics: {},
        model: { json: action.payload.json },
        color: assignColor(id),
      };
      state.allIds.push(id);
    },
    trainingProgress(
      state,
      action: PayloadAction<{
        brainId: BrainId;
        iter: number;
        error: number;
        elapsedMs: number;
      }>,
    ) {
      const { brainId, iter, error, elapsedMs } = action.payload;
      const rec = state.byId[brainId];
      if (rec && rec.runtime.status === 'training') {
        rec.runtime.progress = { iter, error, elapsedMs };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBrain.fulfilled, (state, action) => {
        const rec = action.payload as BrainRecord;
        state.byId[rec.config.id] = rec;
        state.allIds.push(rec.config.id);
      })
      .addCase(trainBrainRequested.pending, (state, action) => {
        const id = action.meta.arg.brainId;
        const rec = state.byId[id];
        if (rec) rec.runtime = { status: 'training' };
      })
      .addCase(trainBrainRequested.fulfilled, (state, action) => {
        const { brainId, series, metrics, modelJSON } = action.payload;
        const rec = state.byId[brainId];
        if (rec) {
          rec.runtime = { status: 'ready' };
          rec.metrics = metrics;
          rec.model = { json: modelJSON };
          rec.config.updatedAt = Date.now();
          state.predictions[brainId] = series;
        }
      })
      .addCase(trainBrainRequested.rejected, (state, action) => {
        const id = action.meta.arg.brainId;
        const rec = state.byId[id];
        if (rec) rec.runtime = { status: 'error', error: action.error.message };
      });
  },
});

export const { removeBrain, loadBrainFromJSON, trainingProgress } =
  brainsSlice.actions;
export default brainsSlice.reducer;
