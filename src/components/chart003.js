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
  const { labels, values } = useSelector(selectMetricSeries);
  useGetOhlcQuery({ symbol: 'BTCUSDT', interval: '1m' });

  const data = {
    labels,
    datasets: [barDataset(values, 'Metrics', 'rgba(226, 153, 18, 0.9)')],
  };

  return (
    <div style={{ display: 'flexbox', width: '900px' }}>
      <Bar data={data} options={chartOptions} />
      <br />
    </div>
  );
}
