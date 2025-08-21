import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

interface ChartSettingsState {
  size: number;
}

const initialState: ChartSettingsState = {
  size: 5,
};

const chartSettingsSlice = createSlice({
  name: 'chartSettings',
  initialState,
  reducers: {
    setChartSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
});

export const { setChartSize } = chartSettingsSlice.actions;
export const selectChartSize = (state: RootState) => state.chartSettings.size;
export default chartSettingsSlice.reducer;
