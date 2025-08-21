import React, { useState } from 'react';
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
import { chartSize } from '../features/chartSettings';
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

export function ChartI() {
  const state = useSelector((state) => state.brain);
  const [tickAmount, setTickAmount] = useState(5);
  chartSize.push(tickAmount);
  if (chartSize.length >= 2) {
    chartSize.splice(0, 1);
  }

  const { refetch } = useGetOhlcQuery({ symbol: 'BTCUSDT', interval: '1m' });
  const fetchData = () => {
    refetch();
  };

  const data = {
    labels: state.data.labels,
    datasets: state.data.datasets.map((ds) =>
      lineDataset(ds.data, ds.label, ds.borderColor, ds.backgroundColor),
    ),
  };

  return (
    <div style={{ display: 'flexbox', width: '900px', marginTop: '30px' }}>
      <div
        style={{
          width: '900px',
          backgroundColor: 'rgba(10,12,40,0.9)',
          borderRadius: '9px',
        }}
      >
        <Line data={data} options={chartOptions} />
        <br />
        <button
          kind="primary"
          size="2x2"
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            marginBottom: '12px',
          }}
          onClick={() =>
            setInterval(() => {
              fetchData();
            }, 60100)
          }
        >
          ⏳START 1 MIN BRAIN CYCLE
        </button>
        <button
          kind="primary"
          size="2x2"
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            marginBottom: '12px',
          }}
          onClick={() => fetchData()}
        >
          START TRAINNING SESSIONS
        </button>
        <br />
      </div>

      <p>{tickAmount}</p>
      <br />

      <div style={{ display: 'flexbox', flexDirection: 'row' }}>
        <button
          onClick={() => setTickAmount(5)}
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            width: '60px',
          }}
        >
          5
        </button>
        <button
          onClick={() => setTickAmount(10)}
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            width: '60px',
          }}
        >
          10
        </button>
        <button
          onClick={() => setTickAmount(15)}
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            width: '60px',
          }}
        >
          15
        </button>
        <button
          onClick={() => setTickAmount(20)}
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            width: '60px',
          }}
        >
          20
        </button>
        <button
          onClick={() => setTickAmount(30)}
          style={{
            borderRadius: '9px',
            marginTop: '25px',
            marginRight: '12px',
            width: '60px',
          }}
        >
          30
        </button>
      </div>

      <button
        onClick={() => setTickAmount(500)}
        style={{
          borderRadius: '9px',
          marginTop: '25px',
          marginRight: '12px',
          width: '60px',
        }}
      >
        ALL TIME
      </button>
    </div>
  );
}
