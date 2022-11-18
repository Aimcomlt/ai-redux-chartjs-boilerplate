import axios from 'axios';
import { chartSize } from '../../components/chart001';
const brain = require('brain.js');


const config = {
  iterations: 20000,
  errorThresh: 0.05,
  log: true,
  learningRate: 0.3,
  momentum: 0.13,
  hiddenLayers: [4, 4, 4, 12, 6, 3], // array of ints for the sizes of the hidden layers in the network
  activation: 'tanh' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
  //leakyReluAlpha: 0.13, // supported for activation type 'leaky-relu'
};
const BrainOne = new brain.NeuralNetwork(config);

  const epoxNum = [];
  const open = [];
  const high = [];
  const low = [];
  const close = [];

  const AvrOpLatess = [];

  const OpBrainResult = [];
  let OpBrainResltSlice = [];

  let OPlatess = [];
  let Epoch = [];
  let start = 1;
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

        start++; //start = 1
        
        end++;
        var grab = chartSize[0].valueOf();
        if(end >= grab) {start = end - grab} else {start = 0};
        console.log('CHART SIZE(GRAB):', grab, 'START VALUE: ', start, 'END VALUE: ', end);

        ////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////

        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m`);

//console.log(response.data)

        if(epoxNum.length >= 500)
        {
        var depth = response.data.length -1;
        epoxNum.push(response.data[depth][0])
        open.push(response.data[depth][1]*1);
        high.push(response.data[depth][2]*1);
        low.push(response.data[depth][3]*1);
        close.push(response.data[depth][4]*1);
        }else
        {
        for (let i = 0; i < (response.data.length); i++) {
            epoxNum.push(response.data[i][0]*1);
            open.push(response.data[i][1]*1);
            high.push(response.data[i][2]*1); 
            low.push(response.data[i][3]*1);
            close.push(response.data[i][4]*1);
        }
        }
        var a = start + 499;
         var b = end + 499;

         OPlatess = open.slice(a, b).map((item) => {
          return OPlatess=item
        })
         Epoch = epoxNum.slice(a, b).map((item) => {
          return Epoch=item
        })
console.log(OPlatess.length)
let avrageOPlatess = OPlatess.reduce((h1,h2) => {
  return (h1 + h2)
})
 AvrOpLatess.push(avrageOPlatess / OPlatess.length);
console.log(AvrOpLatess)
console.log('OPEN && EPOCH ARRAY :', OPlatess, Epoch, '-----','LATESS: ', open[open.length - 1]);

const BrainOneTrainningSet = [];
for(let i = 0; i < open.length; i++) {
  BrainOneTrainningSet.push({
    input:{
     hgh: high[i - 1] * 0.00001, 
     lw: low[i - 1] * 0.00001, 
     cl: close[i - 1] * 0.00001,
    },
    output:{
     op: open[i - 1] * 0.00001
    }
   
   })
}
console.log('TRAINNING SET: ', BrainOneTrainningSet)
BrainOne.train(BrainOneTrainningSet, {    
                      
  iterations: 20000,
  errorThresh: 0.05,
  log: true,
  learningRate: 0.3,
  momentum: 0.13,
  hiddenLayers: [4], // array of ints for the sizes of the hidden layers in the network
  activation: 'tanh', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
 //leakyReluAlpha: 0.13, // supported for activation type 'leaky-relu'

});
 const BrainOneRun = BrainOne.run({
 hgh: high[high.length - 1] * 0.00001, 
 lw: low[low.length - 1] * 0.00001, 
 cl: close[close.length - 1] * 0.00001,
 })
 OpBrainResult.push(BrainOneRun.op / 0.00001);
 OpBrainResltSlice = OpBrainResult.slice(start, end).map((item) => {
  return OpBrainResltSlice=item
 })
 console.log('PREDICTION RESULT: ', OpBrainResult, 'FROM SOURCE: ', BrainOneRun.op);
 console.log('%c BRAIN ONE NEURAL NETWORK: ', 'color: red', BrainOne)
dispatch({
    type: "SUCCESS_BITCOIN",
    payload: {
      OpBrainResltSlice,
        AvrOpLatess,
        Epoch,
        OPlatess,
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