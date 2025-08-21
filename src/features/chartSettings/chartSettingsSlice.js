import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  size: 5,
};

const chartSettingsSlice = createSlice({
  name: 'chartSettings',
  initialState,
  reducers: {
    setChartSize: (state, action) => {
      state.size = action.payload;
    },
  },
});

export const { setChartSize } = chartSettingsSlice.actions;
export const selectChartSize = (state) => state.chartSettings.size;
export default chartSettingsSlice.reducer;
