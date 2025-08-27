export interface BuiltInput {
  ff: number[][];      // feedforward windows
  rnn: number[][][];   // recurrent sequences
}

export function buildInput(series: number[], windowSize: number): BuiltInput {
  const ff: number[][] = [];
  const rnn: number[][][] = [];
  if (windowSize <= 0) return { ff, rnn };
  for (let i = 0; i <= series.length - windowSize; i++) {
    const window = series.slice(i, i + windowSize);
    ff.push(window);
    rnn.push(window.map(v => [v]));
  }
  return { ff, rnn };
}
