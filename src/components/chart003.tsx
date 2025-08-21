import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
//import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useGetOhlcQuery } from '../features/markets/marketApi';
import { chartOptions } from '../charts/config';
import { barDataset } from '../charts/datasets';
import { selectMetricSeries } from '../selectors/seriesSelectors';
import { selectChartSize } from '../features/chartSettings/chartSettingsSlice';
import type { RootState } from '../app/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

//////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

export function ChartIII() {
  const { labels, values } = useSelector<
    RootState,
    ReturnType<typeof selectMetricSeries>
  >(selectMetricSeries);
  const tickAmount = useSelector<RootState, number>(selectChartSize);
  useGetOhlcQuery({ symbol: 'BTCUSDT', interval: '1m' });

  const data = {
    labels,
    datasets: [
      barDataset(values as number[], 'Metrics', 'rgba(226, 153, 18, 0.9)'),
    ],
  };

  return (
    <div style={{ display: 'flexbox', width: '900px' }}>
      <Bar data={data} options={chartOptions} />
      <br />
      <p>{tickAmount}</p>
    </div>
  );
}
