export const chartOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      enabled: true,
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'x',
      },
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'minute',
      },
    },
  },
};
