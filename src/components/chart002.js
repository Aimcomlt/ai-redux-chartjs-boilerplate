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
import { getData } from '../features/normalizerFactories/btc-usdt';
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
  const dispatch = useDispatch();
  const state = useSelector((state) => state.brain);
  // const [tickAmount, setTickAmount] = useState(5);

  const fetchData = (time) => {
    dispatch(
      getData({
        time: time,
      }),
    );
    dispatch({
      type: 'SUCCESS_BITCOIN',
      payload: {},
    });
  };

  const data = {
    labels: state.dataB.labels,
    datasets: state.dataB.datasets.map((ds) =>
      lineDataset(ds.data, ds.label, ds.borderColor, ds.backgroundColor),
    ),
  };

  return (
    <div
      style={{ display: 'flexbox', width: '900px' }}
      onChange={() => fetchData('min1')}
    >
      <Line data={data} options={chartOptions} />
      <br />
    </div>
  );
}
