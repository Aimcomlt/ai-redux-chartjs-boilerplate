const initalState = {
  Loading: false,
  dataC: {
    labels: [],
    datasets: [
      {
        type: 'bar',
        tension: 0.9,
        label: 'BOT CHART PREDICTION',
        data: [],
        backgroundColor: 'rgba(226, 153, 18, 0.9)',
        borderColor: 'rgba(178, 116, 0, 1)',
        pointBorderColor: 'rgba(25, 16, 0, 1)',
        options: {
          responsive: true,
        },
      },
    ],
  },
};
const brainReducer = (state = initalState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'AWAITING_BITCOIN':
      return {
        ...state,
        loading: true,
      };
    case 'REJECTED_BITCOIN':
      return {
        ...state,
        loading: false,
      };
    case 'SUCCESS_BITCOIN':
      return {
        ...state,
        loading: false,

        dataC: {
          labels: payload.Epoch,
          text: 'EXPERIMENTAL',
          datasets: [
            {
              type: 'bar',
              label: 'MESUREMENT',
              data: payload.brainMesurementSlice001.map((v) =>
                Array.isArray(v) ? v[0] : v,
              ),
              radius: 1,
              backgroundColor: payload.brMesurementSliceColor001,
              borderColor: payload.brMesurementSliceColor001,
              pointBorderColor: payload.brMesurementSliceColor001,
              borderWidth: 0.5,
              order: 2,
            },
          ],
        },
      };
    default:
      return state;
  }
};
export default brainReducer;
