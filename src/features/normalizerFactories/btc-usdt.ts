import axios from 'axios';
import brain from 'brain.js';
import { selectChartSize } from '../chartSettings/chartSettingsSlice';

type Activation = 'sigmoid' | 'relu' | 'leaky-relu' | 'tanh';

const createConfig = (activation: Activation = 'tanh', overrides: Partial<any> = {}) => ({
  iterations: 20000,
  errorThresh: 0.05,
  inputSize: 3,
  outputSize: 1,
  log: false,
  learningRate: 0.4,
  momentum: 0.23,
  sizes: [4, 4, 4, 12, 6, 3],
  hiddenLayers: [4, 4, 4, 12, 6, 3],
  activation,
  ...overrides,
});

const loadNetwork = (key: string, activation: Activation) => {
  const net = new brain.recurrent.LSTMTimeStep(createConfig(activation));
  if (typeof window !== 'undefined') {
    const json = window.localStorage.getItem(key);
    if (json) {
      net.fromJSON(JSON.parse(json));
    }
  }
  return net;
};

const saveNetwork = (key: string, net: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(net.toJSON()));
  }
};

const getLastIndex = (): number => {
  if (typeof window !== 'undefined') {
    return parseInt(window.localStorage.getItem('BrainTrainingIndex') || '0', 10);
  }
  return 0;
};

const setLastIndex = (idx: number) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('BrainTrainingIndex', String(idx));
  }
};

const brainOneActivation: Activation = 'tanh';
const brainTwoActivation: Activation = 'tanh';
const brainThreeActivation: Activation = 'tanh';

export interface CandleData {
  epoxNum: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
}

export async function fetchMarketData(): Promise<CandleData> {
  const response = await axios.get(
    `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m`,
  );
  const epoxNum: number[] = [];
  const open: number[] = [];
  const high: number[] = [];
  const low: number[] = [];
  const close: number[] = [];
  for (const item of response.data as any[]) {
    epoxNum.push(Number(item[0]));
    open.push(Number(item[1]));
    high.push(Number(item[2]));
    low.push(Number(item[3]));
    close.push(Number(item[4]));
  }
  return { epoxNum, open, high, low, close };
}

export interface NormalizedData {
  start: number;
  end: number;
  OPlatess: number[];
  Epoch: number[];
  AvrOpLatessSlice: number[];
  trainingData: number[][][];
}

export function normalizeData(data: CandleData, chartSize: number): NormalizedData {
  const end = data.open.length;
  const start = Math.max(0, end - chartSize);
  const OPlatess = data.open.slice(start, end);
  const Epoch = data.epoxNum.slice(start, end);
  const avg =
    OPlatess.reduce((sum, val) => sum + val, 0) / (OPlatess.length || 1);
  const AvrOpLatessSlice = Array(OPlatess.length).fill(avg);

  const trainingData: number[][][] = [];
  const lastIndex = getLastIndex();
  for (let i = Math.max(1, lastIndex); i < data.open.length; i++) {
    trainingData.push([
      [data.high[i - 1] * 0.00001, data.low[i - 1] * 0.00001, data.close[i - 1] * 0.00001],
      [data.open[i - 1] * 0.00001],
    ]);
  }

  return { start, end, OPlatess, Epoch, AvrOpLatessSlice, trainingData };
}

export interface TrainingResult {
  brainMesurementSlice001: number[];
  brMesurementSliceColor001: string[];
  OpBrainResltSlice: number[];
  OpBrainResltSlice002: number[];
  OpBrainResltSlice003: number[];
}

export function trainNetworks(
  normalized: NormalizedData,
  data: CandleData,
): TrainingResult {
  const BrainOne = loadNetwork('BrainOneNetwork', brainOneActivation);
  const BrainTwo = loadNetwork('BrainTwoNetwork', brainTwoActivation);
  const BrainThree = loadNetwork('BrainThreeNetwork', brainThreeActivation);

  if (normalized.trainingData.length) {
    BrainOne.train(
      normalized.trainingData,
      createConfig(brainOneActivation, { learningRate: 0.3, momentum: 0.13 }),
    );
    BrainTwo.train(normalized.trainingData, createConfig(brainTwoActivation));
    BrainThree.train(normalized.trainingData, {
      ...createConfig(brainThreeActivation),
      sizes: [3, 4, 4, 4, 12, 6, 3, 1],
    });

    saveNetwork('BrainOneNetwork', BrainOne);
    saveNetwork('BrainTwoNetwork', BrainTwo);
    saveNetwork('BrainThreeNetwork', BrainThree);
    setLastIndex(data.open.length);
  }

  const latestInput = [
    data.high[data.high.length - 1] * 0.00001,
    data.low[data.low.length - 1] * 0.00001,
    data.close[data.close.length - 1] * 0.00001,
  ];

  const runNet = (net: any): number => {
  const result = net.run([latestInput]);
  return Array.isArray(result) ? result[0] : result;
  };

  const p1 = runNet(BrainOne) / 0.00001;
  const p2 = runNet(BrainTwo) / 0.00001;
  const p3 = runNet(BrainThree) / 0.00001;

  const length = normalized.end - normalized.start;
  const OpBrainResltSlice = Array(length).fill(p1);
  const OpBrainResltSlice002 = Array(length).fill(p2);
  const OpBrainResltSlice003 = Array(length).fill(p3);

  const diff = p2 > p3 ? p2 - p3 : p3 - p2;
  const color = p2 > p3 ? 'rgba(42, 255, 3, 1)' : 'rgba(255, 3, 3, 1)';
  const brainMesurementSlice001 = Array(length).fill(diff);
  const brMesurementSliceColor001 = Array(length).fill(color);

  return {
    brainMesurementSlice001,
    brMesurementSliceColor001,
    OpBrainResltSlice,
    OpBrainResltSlice002,
    OpBrainResltSlice003,
  };
}

interface GetDataArgs {
  time?: number;
}

export const getData =
  ({ time }: GetDataArgs = {}) =>
  async (dispatch: any, getState: any) => {
    dispatch({ type: 'AWAITING_BITCOIN' });
    try {
      const chartSize = selectChartSize(getState());
      const candleData = await fetchMarketData();
      const normalized = normalizeData(candleData, chartSize);
      const trainingResult = trainNetworks(normalized, candleData);

      const payload = {
        brainMesurementSlice001: trainingResult.brainMesurementSlice001,
        brMesurementSliceColor001: trainingResult.brMesurementSliceColor001,
        OpBrainResltSlice003: trainingResult.OpBrainResltSlice003,
        OpBrainResltSlice002: trainingResult.OpBrainResltSlice002,
        OpBrainResltSlice: trainingResult.OpBrainResltSlice,
        AvrOpLatessSlice: normalized.AvrOpLatessSlice,
        Epoch: normalized.Epoch,
        OPlatess: normalized.OPlatess,
        epoxNum: candleData.epoxNum,
        open: candleData.open,
        high: candleData.high,
        low: candleData.low,
        close: candleData.close,
      };
      dispatch({ type: 'SUCCESS_BITCOIN', payload });
      return payload;
    } catch (e) {
      dispatch({ type: 'REJECTED_BITCOIN' });
      throw e;
    }
  };
