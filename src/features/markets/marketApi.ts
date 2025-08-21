import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3/' }),
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
