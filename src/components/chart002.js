import React from 'react';
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
import { useDispatch, useSelector } from "react-redux";
import { getData } from '../features/normalizerFactories/btc-usdt';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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



//////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

export function ChartII() {
    const dispatch = useDispatch();
    const state = useSelector(state => state.brain);
   // const [tickAmount, setTickAmount] = useState(5);

    const fetchData = (time) => {
    dispatch(getData({
       time: time,
    }))
    dispatch({
        type: "SUCCESS_BITCOIN",
        payload: {},

    })
}

    return <div style={{display: 'flexbox', width: '900px'}} onChange={() => fetchData("min1")}>

              <Line data={state.dataB} options={{responsive: true}}/> 
              <br />


    </div>;
    
}
