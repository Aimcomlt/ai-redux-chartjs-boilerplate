import axios from 'axios';
import { chartSize } from '../../components/chart001'

  const epoxNum = [];
export const open = [];
  const high = [];
  const low = [];
  const close = [];

  let start = -1;
  let end = 0;

export const getData = ({
    time,
    tickAmount
}) => async dispatch => {
    try{
        dispatch({
            type: "AWAITING_BITCOIN"
        })

        console.log(tickAmount)
//////////////////////////////////////////////////
//////////////////////////////////////////////////

        start++;
        
        end++;
        var grab = chartSize[0].valueOf();
        console.log(grab,start,end);
        if(end < grab) {start--} else {start = end - grab};
        ////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////

        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m`);

//console.log(response.data)

        if(epoxNum.length >= 500)
        {
        var depth = response.data.length -1;
        epoxNum.push(response.data[depth][0])
        open.push(response.data[depth][1]);
        high.push(response.data[depth][2]);
        low.push(response.data[depth][3]);
        close.push(response.data[depth][4]);
        }else
        {
        for (let i = 0; i < (response.data.length); i++) {
            epoxNum.push(response.data[i][0]);
            open.push(response.data[i][1]);
            high.push(response.data[i][2]); 
            low.push(response.data[i][3]);
            close.push(response.data[i][4]);
        }
        }
console.log('OPEN ARRAY :', open)
dispatch({
    type: "SUCCESS_BITCOIN",
    payload: {
        epoxNum,
        open,
        high,
        low,
        close
    }
  })
 
} catch (e) {
  dispatch({
    type: "REJECTED_BITCOIN",
  })
}
}