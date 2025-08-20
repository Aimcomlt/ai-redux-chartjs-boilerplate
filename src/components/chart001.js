import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../features/normalizerFactories/btc-usdt';
import { chartSize } from '../features/chartSettings';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Random Line Chart on refresh...',
    },
  },
};

export function ChartI() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.brain);
  const [tickAmount, setTickAmount] = useState(5);
  chartSize.push(tickAmount);
  if (chartSize.length >= 2) {
    chartSize.splice(0, 1);
  }

  const fetchData = (time) => {
    dispatch(
      getData({
        time: time,
        tickAmount: tickAmount,
      }),
    );
    dispatch({
      type: 'SUCCESS_BITCOIN',
      payload: {},
      tickAmount,
    });
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
        <Line data={state.data} options={{ responsive: true }} />
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
              fetchData('min1');
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
          onClick={() => fetchData('min1')}
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
