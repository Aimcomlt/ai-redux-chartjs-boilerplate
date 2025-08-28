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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface CompositeChartProps {
  labels: (string | number)[];
  actualData: number[];
  predictedData: number[];
}

export const CompositeChart: React.FC<CompositeChartProps> = ({
  labels,
  actualData,
  predictedData,
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Actual',
        data: actualData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        fill: false,
      },
      {
        label: 'Predicted',
        data: predictedData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Predictions vs Actual',
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default CompositeChart;
