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
import { useDispatch, useSelector } from 'react-redux';
import { useGetOhlcQuery } from '../features/markets/marketApi';
import {
  selectChartSize,
  setChartSize,
} from '../features/chartSettings/chartSettingsSlice';
import { chartOptions } from '../charts/config';
import { lineDataset } from '../charts/datasets';
import { selectPredictionSeries } from '../selectors/seriesSelectors';

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
  const dispatch = useDispatch();
  const { labels, values } = useSelector(selectPredictionSeries);
  const tickAmount = useSelector(selectChartSize);

  const { refetch } = useGetOhlcQuery({ symbol: 'BTCUSDT', interval: '1m' });
  const fetchData = () => {
    refetch();
  };

  const data = {
    labels,
    datasets: [lineDataset(values, 'Predictions', 'rgba(226, 153, 18, 0.9)')],
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
          onClick={() => dispatch(setChartSize(5))}
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
          onClick={() => dispatch(setChartSize(10))}
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
          onClick={() => dispatch(setChartSize(15))}
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
          onClick={() => dispatch(setChartSize(20))}
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
          onClick={() => dispatch(setChartSize(30))}
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
        onClick={() => dispatch(setChartSize(500))}
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
