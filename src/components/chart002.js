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
  const state = useSelector((state) => state.brain);
  useGetOhlcQuery({ symbol: 'BTCUSDT', interval: '1m' });

  const data = {
    labels: state.dataB.labels,
    datasets: state.dataB.datasets.map((ds) =>
      lineDataset(ds.data, ds.label, ds.borderColor, ds.backgroundColor),
    ),
  };

  return (
    <div style={{ display: 'flexbox', width: '900px' }}>
      <Line data={data} options={chartOptions} />
      <br />
    </div>
  );
}
