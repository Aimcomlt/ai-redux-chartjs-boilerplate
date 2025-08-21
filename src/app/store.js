import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import brainReducer from '../features/brain/brainSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    brain: brainReducer,
  },
});
