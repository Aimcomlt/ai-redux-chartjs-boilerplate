const initalState = {
    Loading: false,
    data: {
      labels: [],
      datasets: [{
        type: 'line',
        tention: 0.9,
        label: "BOT CHART PREDICTION",
        data: [],
        backgroundColor: 'rgba(226, 153, 18, 0.9)',
        borderColor: 'rgba(178, 116, 0, 1)',
        pointBorderColor: 'rgba(25, 16, 0, 1)',
        options: {
          responsive: true
        }
      }],
    },  
  }
  const brainReducer = (state = initalState, action) => {
    const { type, payload } = action;
  
    switch (type) {
        case "AWAITING_BITCOIN":
          return {
            ...state,
            loading: true
          }
        case "REJECTED_BITCOIN":
          return {
            ...state,
            loading: false,
          }
        case "SUCCESS_BITCOIN":
  
            return {
                ...state,
                loading: false,

                data: {
                  labels: payload.epoxNum,
                  text: 'EXPERIMENTAL',
                  datasets: [
                            {
                              type: 'line',
                              label: "OPEN LATESS PRICE",
                              data: payload.open,
                              tention: 0.9,
                              backgroundColor: 'rgba(255, 0, 0, 1)',
                              borderColor: '	rgba(255, 0, 0, 1)',
                              pointBorderColor: 'rgba(25, 16, 1)',
                              order: 2
                              },
  
                            {
                              type: 'line',
                              label: "HIGH LATESS PRICE",
                              data: payload.high, 
                              tention: 0.9,
                              backgroundColor:'rgba(0,0,255, 0.7)',
                              borderColor: 'rgba(0,0,255, 0.9)',
                              pointBorderColor: 'rgba(0,0,255, 0.8)',                 
                              order: 3
                              },
 
                            {
                              type: 'line',
                              label: "LOW LATESS PRICE",
                              data: payload.low,
                              backgroundColor:'rgba(255,255,0, 0.8)',
                              borderColor: 'rgba(255,255,0, 0.9)',
                              pointBorderColor: 'rgba(255,255,0, 0.9)',                  
                              order: 4
                              },
           
                            {
                              type: 'line',
                              label: "CLOSE LATESS PRICE",
                              data: payload.close,
                              tention: 0.9,
                              backgroundColor:'rgba(10, 204, 0, 0.7)',
                              borderColor: 'rgba(10, 204, 0, 0.9)',
                              pointBorderColor: 'rgba(10, 204, 0, 0.7)',
                              order: 1
                              },
                            ]
                          },
                        }
                        default: return state;
                      }
                    }
              export default brainReducer;
  
  