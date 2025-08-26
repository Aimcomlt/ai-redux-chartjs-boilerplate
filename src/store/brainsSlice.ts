// ============================================================
// File: src/store/brainsSlice.ts
// ============================================================
import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { BrainArchitecture, BrainConfig, BrainHyperparams, BrainId, BrainMetrics, BrainRecord, BrainPredictionSeries } from '@/types/brain';
import { trainBrain } from '@/lib/brain/train';
import { assignColor } from '@/styles/ColorRegistry';

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
  async (payload: CreateBrainPayload | undefined, { dispatch }) => {
    const id = `brain_${nanoid(8)}`;
    const now = Date.now();
    const config: BrainConfig = {
      id,
      name: payload?.name ?? `Brain ${id.slice(-4)}`,
      architecture: { ...DEFAULT_ARCH, ...(payload?.architecture ?? {}) } as any,
      hyper: { ...DEFAULT_HYPER, ...(payload?.hyper ?? {}) } as any,
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
  }
);

export interface TrainBrainArgs {
  brainId: BrainId;
  datasetId: string; // e.g., 'open'
}

export const trainBrainRequested = createAsyncThunk(
  'brains/train',
  async ({ brainId, datasetId }: TrainBrainArgs, { getState }) => {
    // @ts-ignore
    const state = getState() as { brains: BrainsState, datasets: any };
    const record = state.brains.byId[brainId];
    if (!record) throw new Error('Brain not found');

    // obtain dataset (baseline open) from datasets slice
    const dataset = state.datasets?.byId?.[datasetId];
    if (!dataset) throw new Error('Dataset not found');

    const { predictions, metrics, modelJSON, trainTimeMs } = await trainBrain(record.config, dataset);

    const series: BrainPredictionSeries = {
      brainId,
      points: predictions,
    };

    const result = { brainId, series, metrics: { ...metrics, trainTimeMs }, modelJSON };
    return result;
  }
);

const brainsSlice = createSlice({
  name: 'brains',
  initialState,
  reducers: {
    removeBrain(state, action: PayloadAction<BrainId>) {
      const id = action.payload;
      delete state.byId[id];
      delete state.predictions[id];
      state.allIds = state.allIds.filter(x => x !== id);
    },
    loadBrainFromJSON(state, action: PayloadAction<{ id?: BrainId; name?: string; json: unknown }>) {
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
  },
  extraReducers: builder => {
    builder
      .addCase(createBrain.fulfilled, (state, action) => {
        const rec = action.payload as BrainRecord;
        state.byId[rec.config.id] = rec;
        state.allIds.push(rec.config.id);
      })
      .addCase(trainBrainRequested.pending, (state, action) => {
        const id = (action.meta.arg as TrainBrainArgs).brainId;
        const rec = state.byId[id];
        if (rec) rec.runtime = { status: 'training' };
      })
      .addCase(trainBrainRequested.fulfilled, (state, action) => {
        const { brainId, series, metrics, modelJSON } = action.payload as any;
        const rec = state.byId[brainId];
        if (rec) {
          rec.runtime = { status: 'ready' };
          rec.metrics = metrics as BrainMetrics;
          rec.model = { json: modelJSON };
          rec.config.updatedAt = Date.now();
          state.predictions[brainId] = series;
        }
      })
      .addCase(trainBrainRequested.rejected, (state, action) => {
        const id = (action.meta.arg as TrainBrainArgs).brainId;
        const rec = state.byId[id];
        if (rec) rec.runtime = { status: 'error', error: action.error.message };
      });
  }
});

export const { removeBrain, loadBrainFromJSON } = brainsSlice.actions;
export default brainsSlice.reducer;
