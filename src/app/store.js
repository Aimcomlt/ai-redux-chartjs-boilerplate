import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import BrainRootReducer from '../features/chartData/brainRootReducer'



export const store = configureStore({
  counter: counterReducer,
  reducer: BrainRootReducer,
 // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(composeWithDevTools),
})