import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const binanceBaseUrl =
  import.meta.env.VITE_BINANCE_BASE_URL ?? 'https://api.binance.com/api/v3/';

if (!import.meta.env.VITE_BINANCE_BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_BINANCE_BASE_URL is not defined; falling back to https://api.binance.com/api/v3/'
  );
}

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({ baseUrl: binanceBaseUrl }),
  endpoints: (builder) => ({
    getOhlc: builder.query<any, { symbol?: string; interval?: string }>({
      query: ({ symbol = 'BTCUSDT', interval = '1m' } = {}) =>
        `klines?symbol=${symbol}&interval=${interval}`,
    }),
    getTicker: builder.query<any, { symbol?: string }>({
      query: ({ symbol = 'BTCUSDT' } = {}) =>
        `ticker/24hr?symbol=${symbol}`,
    }),
  }),
});

export const { useGetOhlcQuery, useGetTickerQuery } = marketApi;
