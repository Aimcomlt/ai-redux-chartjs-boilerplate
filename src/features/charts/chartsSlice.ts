import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { BrainId } from '@/types/brain';

export interface SeriesRef {
  brainId: BrainId | 'actual';
  visible: boolean;
}

export interface ChartRecord {
  id: string;
  name: string;
  series: SeriesRef[];
}

export interface ChartsState {
  byId: Record<string, ChartRecord>;
  allIds: string[];
}

const initialState: ChartsState = {
  byId: {
    main: {
      id: 'main',
      name: 'Main Chart',
      series: [{ brainId: 'actual', visible: true }],
    },
  },
  allIds: ['main'],
};

const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    addChart: {
      reducer(state, action: PayloadAction<ChartRecord>) {
        const chart = action.payload;
        state.byId[chart.id] = chart;
        state.allIds.push(chart.id);
      },
      prepare(name?: string) {
        const id = `chart_${nanoid(8)}`;
        return {
          payload: {
            id,
            name: name ?? `Chart ${id.slice(-4)}`,
            series: [{ brainId: 'actual', visible: true }],
          } as ChartRecord,
        };
      },
    },
    removeChart(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((x) => x !== id);
    },
    addSeries(
      state,
      action: PayloadAction<{ chartId: string; brainId: BrainId | 'actual'; visible?: boolean }>,
    ) {
      const { chartId, brainId, visible = true } = action.payload;
      const chart = state.byId[chartId];
      if (!chart) return;
      if (chart.series.find((s) => s.brainId === brainId)) return;
      chart.series.push({ brainId, visible });
    },
    removeSeries(
      state,
      action: PayloadAction<{ chartId: string; brainId: BrainId | 'actual' }>,
    ) {
      const { chartId, brainId } = action.payload;
      const chart = state.byId[chartId];
      if (!chart) return;
      chart.series = chart.series.filter((s) => s.brainId !== brainId);
    },
    moveSeries(
      state,
      action: PayloadAction<{
        fromChartId: string;
        toChartId: string;
        brainId: BrainId | 'actual';
      }>,
    ) {
      const { fromChartId, toChartId, brainId } = action.payload;
      const from = state.byId[fromChartId];
      const to = state.byId[toChartId];
      if (!from || !to) return;
      const idx = from.series.findIndex((s) => s.brainId === brainId);
      if (idx === -1) return;
      const [ref] = from.series.splice(idx, 1);
      if (!to.series.find((s) => s.brainId === brainId)) {
        to.series.push(ref);
      }
    },
    setSeriesVisibility(
      state,
      action: PayloadAction<{ chartId: string; brainId: BrainId | 'actual'; visible: boolean }>,
    ) {
      const { chartId, brainId, visible } = action.payload;
      const chart = state.byId[chartId];
      if (!chart) return;
      const ref = chart.series.find((s) => s.brainId === brainId);
      if (ref) ref.visible = visible;
    },
  },
});

export const {
  addChart,
  removeChart,
  addSeries,
  removeSeries,
  moveSeries,
  setSeriesVisibility,
} = chartsSlice.actions;

export default chartsSlice.reducer;
export type { ChartsState };
