import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import BrainRootReducer from '../features/chartData/brainRootReducer';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ...BrainRootReducer, // or use combineReducers prior to passing
  },
});
