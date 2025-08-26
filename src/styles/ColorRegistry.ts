// ============================================================
// File: src/styles/ColorRegistry.ts
// ============================================================
const PALETTE = [
  '#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf'
];
const map = new Map<string,string>();
let idx = 0;
export function assignColor(key: string) {
  if (map.has(key)) return map.get(key)!;
  const color = PALETTE[idx % PALETTE.length];
  map.set(key, color);
  idx++;
  return color;
}
