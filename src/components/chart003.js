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
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../features/normalizerFactories/btc-usdt';
import { chartOptions } from '../charts/config';
import { barDataset } from '../charts/datasets';

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
  const dispatch = useDispatch();
  const state = useSelector((state) => state.brain001);
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
    labels: state.dataC.labels,
    datasets: state.dataC.datasets.map((ds) =>
      barDataset(ds.data, ds.label, ds.backgroundColor),
    ),
  };

  return (
    <div
      style={{ display: 'flexbox', width: '900px' }}
      onChange={() => fetchData('min1')}
    >
      <Bar data={data} options={chartOptions} />
      <br />
    </div>
  );
}
