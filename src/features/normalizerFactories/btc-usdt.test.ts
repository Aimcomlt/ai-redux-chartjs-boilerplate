import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';

vi.mock('brain.js', () => ({
  default: {
    recurrent: {
      LSTMTimeStep: class {
        train() {}
        run() {
          return [0];
        }
        toJSON() {
          return {};
        }
        fromJSON() {}
      },
    },
  },
}));

vi.mock('axios');

import { fetchMarketData, normalizeData, CandleData } from './btc-usdt';

describe('fetchMarketData', () => {
  it('maps kline data', async () => {
    const data = [
      [1, '1', '2', '0.5', '1.5'],
      [2, '2', '3', '1.5', '2.5'],
    ];
    (axios.get as any).mockResolvedValue({ data });
    const result = await fetchMarketData();
    expect(result.open).toEqual([1, 2]);
    expect(result.high).toEqual([2, 3]);
    expect(result.low).toEqual([0.5, 1.5]);
    expect(result.close).toEqual([1.5, 2.5]);
    expect(result.epoxNum).toEqual([1, 2]);
  });
});

describe('normalizeData', () => {
  it('creates training data and averages', () => {
    const candleData: CandleData = {
      epoxNum: [1, 2, 3],
      open: [1, 2, 3],
      high: [2, 3, 4],
      low: [0.5, 1.5, 2.5],
      close: [1.5, 2.5, 3.5],
    };
    const result = normalizeData(candleData, 2);
    expect(result.OPlatess).toEqual([2, 3]);
    expect(result.Epoch).toEqual([2, 3]);
    expect(result.AvrOpLatessSlice).toEqual([2.5, 2.5]);
    expect(result.trainingData[0][0]).toEqual([
      2 * 0.00001,
      0.5 * 0.00001,
      1.5 * 0.00001,
    ]);
    expect(result.trainingData[0][1]).toEqual([1 * 0.00001]);
  });
});
