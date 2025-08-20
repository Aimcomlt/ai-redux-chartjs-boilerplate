import axios from 'axios';
import { chartSize } from '../../components/chart001';
const brain = require('brain.js');

const createConfig = (activation = 'tanh', overrides = {}) => ({
  iterations: 20000,
  errorThresh: 0.05,
  inputSize: 3,
  outputSize: 1,
  log: true,
  learningRate: 0.4,
  momentum: 0.23,
  sizes: [4, 4, 4, 12, 6, 3],
  hiddenLayers: [4, 4, 4, 12, 6, 3], // array of ints for the sizes of the hidden layers in the network
  activation, // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
  //leakyReluAlpha: 0.13, // supported for activation type 'leaky-relu'
  ...overrides,
});

// helper utilities to persist networks and track training progress
const loadNetwork = (key, activation) => {
  const net = new brain.NeuralNetwork(createConfig(activation));
  if (typeof window !== 'undefined') {
    const json = window.localStorage.getItem(key);
    if (json) {
      net.fromJSON(JSON.parse(json));
    }
  }
  return net;
};

const saveNetwork = (key, net) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(net.toJSON()));
  }
};

const getLastIndex = () => {
  if (typeof window !== 'undefined') {
    return parseInt(window.localStorage.getItem('BrainTrainingIndex') || '0', 10);
  }
  return 0;
};

const setLastIndex = (idx) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('BrainTrainingIndex', String(idx));
  }
};

const brainOneActivation = 'tanh';
const brainTwoActivation = 'tanh';
const brainThreeActivation = 'tanh';

let brainMesurement001 = [];
let brMesurementColor001 = [];

let brainMesurementSlice001 = [];
let brMesurementSliceColor001 = [];

  const epoxNum = [];
  const open = [];
  const high = [];
  const low = [];
  const close = [];

  const AvrOpLatess = [];
  let AvrOpLatessSlice = []; 




  const OpBrainResult = [];
  let OpBrainResltSlice = [];

  const OpBrainResult002 = [];
  let OpBrainResltSlice002 = [];

  const OpBrainResult003 = [];
  let OpBrainResltSlice003 = [];

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
console.log(OPlatess.length) // will allways be the value of the state by default 5 or any other state ex: 10 20 30 500 that the client will choose in the session
//Knowing the state value is all so the array length. We can build a simple average line that will update with the state's value
const avrageOPlatess = OPlatess.reduce((h1,h2) => {
  return (h1 + h2)
})

 AvrOpLatess.push(avrageOPlatess / OPlatess.length * 1);
 
 console.log('AVRAGE CHECK OUT OF THE BOX: ', AvrOpLatess)
  AvrOpLatessSlice = AvrOpLatess.slice(start, end).map((item) => {
  return AvrOpLatessSlice=item
 });

console.log('OPEN AVRAGE from SLICE FUNCTION: ', AvrOpLatessSlice)
console.log('OPEN && EPOCH ARRAY :', OPlatess, Epoch, '-----','LATESS: ', open[open.length - 1]);

// build training set using only new data
const BrainOneTrainningSet = [];
const lastIndex = getLastIndex();
for (let i = Math.max(1, lastIndex); i < open.length; i++) {
  BrainOneTrainningSet.push({
    input: {
      hgh: high[i - 1] * 0.00001,
      lw: low[i - 1] * 0.00001,
      cl: close[i - 1] * 0.00001,
    },
    output: {
      op: open[i - 1] * 0.00001,
    },
  });
}
console.log('TRAINNING SET: ', BrainOneTrainningSet);

// load existing networks or create new ones
const BrainOne = loadNetwork('BrainOneNetwork', brainOneActivation);
const BrainTwo = loadNetwork('BrainTwoNetwork', brainTwoActivation);
const BrainThree = loadNetwork('BrainThreeNetwork', brainThreeActivation);

if (BrainOneTrainningSet.length) {
  BrainOne.train(
    BrainOneTrainningSet,
    createConfig(brainOneActivation, { learningRate: 0.3, momentum: 0.13 })
  );
  BrainTwo.train(BrainOneTrainningSet, createConfig(brainTwoActivation));
  BrainThree.train(BrainOneTrainningSet, {
    ...createConfig(brainThreeActivation),
    sizes: [3, 4, 4, 4, 12, 6, 3, 1],
  });

  saveNetwork('BrainOneNetwork', BrainOne);
  saveNetwork('BrainTwoNetwork', BrainTwo);
  saveNetwork('BrainThreeNetwork', BrainThree);
  setLastIndex(open.length);
}

const BrainOneRun = BrainOne.run({
  hgh: high[high.length - 1] * 0.00001,
  lw: low[low.length - 1] * 0.00001,
  cl: close[close.length - 1] * 0.00001,
});

OpBrainResult.push(BrainOneRun.op / 0.00001);
OpBrainResltSlice = OpBrainResult.slice(start, end).map((item) => {
  return (OpBrainResltSlice = item);
});

console.log('PREDICTION LINE 1 RESULT: ', OpBrainResult, 'FROM SOURCE: ', BrainOneRun.op);
console.log('%c BRAIN ONE NEURAL NETWORK: ', 'color: red', BrainOne);

///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////BRAIN TWO

const BrainTwoRun = BrainTwo.run({
  hgh: high[high.length - 1] * 0.00001,
  lw: low[low.length - 1] * 0.00001,
  cl: close[close.length - 1] * 0.00001,
});
OpBrainResult002.push(BrainTwoRun.op / 0.00001);
OpBrainResltSlice002 = OpBrainResult002.slice(start, end).map((item) => {
  return (OpBrainResltSlice002 = item);
});
console.log('PREDICTION LINE 2 RESULT: ', OpBrainResult002, 'FROM SOURCE: ', BrainTwoRun.op);
console.log('%c BRAIN TWO NEURAL NETWORK: ', 'color: orange', BrainTwo);

// Brain three is a copy of brain one that can continue training
const BrainThreeRun = BrainThree.run({
  hgh: high[high.length - 1] * 0.00001,
  lw: low[low.length - 1] * 0.00001,
  cl: close[close.length - 1] * 0.00001,
});
OpBrainResult003.push(BrainThreeRun.op / 0.00001);
OpBrainResltSlice003 = OpBrainResult003.slice(start, end).map((item) => {
  return (OpBrainResltSlice003 = item);
});
console.log('PREDICTION LINE 3 RESULT: ', OpBrainResult003, 'FROM SOURCE: ', BrainThreeRun.op);
console.log('%c BRAIN THREE NEURAL NETWORK: ', 'color: blue', BrainThree);

 //////////////////////////////
if(OpBrainResult002[OpBrainResult002.length -1] > OpBrainResult003[OpBrainResult003.length -1]) 
{ 
 brainMesurement001.push(OpBrainResult002[OpBrainResult002.length -1] - OpBrainResult003[OpBrainResult003.length -1])
}

if(OpBrainResult002[OpBrainResult002.length -1]  > OpBrainResult003[OpBrainResult003.length -1]) 
{ brMesurementColor001.push('rgba(42, 255, 3, 1)') 
}

if(OpBrainResult003[OpBrainResult003.length -1] > OpBrainResult002[OpBrainResult002.length -1]) 
{ 
brainMesurement001.push(OpBrainResult003[OpBrainResult003.length -1] - OpBrainResult002[OpBrainResult002.length -1])
}

if(OpBrainResult003[OpBrainResult003.length -1] > OpBrainResult002[OpBrainResult002.length -1]) 
{ brMesurementColor001.push('rgba(255, 3, 3, 1)') 
}

brainMesurementSlice001 = brainMesurement001.slice(start, end).map((item) => {
return brainMesurementSlice001=item
})

brMesurementSliceColor001 = brMesurementColor001.slice(start, end).map((item) => {
 return brMesurementSliceColor001=item
})
console.log('MESUREMENT:', brainMesurementSlice001, 'COLOR: ', brMesurementSliceColor001)


dispatch({
    type: "SUCCESS_BITCOIN",
    payload: {
      brainMesurementSlice001,
      brMesurementSliceColor001,
      OpBrainResltSlice003,
      OpBrainResltSlice002,
        OpBrainResltSlice,
        AvrOpLatessSlice,
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