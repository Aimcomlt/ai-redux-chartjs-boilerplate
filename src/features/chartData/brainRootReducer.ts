//import bitcoinReducer from "./bitcoinReducer";
import type { Reducer } from '@reduxjs/toolkit';
import brainReducer from './brainReducer';
import brainReducer001 from './brainReducer001';

const BrainRootReducer: Record<string, Reducer> = {
  brain: brainReducer,
  brain001: brainReducer001,
};

export default BrainRootReducer;
