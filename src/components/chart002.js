import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { useGetOhlcQuery } from '../features/markets/marketApi';
import { chartOptions } from '../charts/config';
import { lineDataset } from '../charts/datasets';
import { selectMetricSeries } from '../selectors/seriesSelectors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

//////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

export function ChartII() {
  const { labels, values } = useSelector(selectMetricSeries);
  useGetOhlcQuery({ symbol: 'BTCUSDT', interval: '1m' });

  const data = {
    labels,
    datasets: [lineDataset(values, 'Metrics', 'rgba(0, 179, 209, 1)')],
  };

  return (
    <div style={{ display: 'flexbox', width: '900px' }}>
      <Line data={data} options={chartOptions} />
      <br />
    </div>
  );
}
