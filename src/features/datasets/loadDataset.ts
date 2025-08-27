export interface LoadedDataset {
  id: string;
  timestamps: number[];
  open: number[];
}

// Fetches the sample dataset bundled in the public folder.
export async function loadDataset(id: string): Promise<LoadedDataset> {
  const resp = await fetch('/data/sample.json');
  if (!resp.ok) throw new Error('Failed to fetch dataset');
  const json = await resp.json();

  // support multiple shapes of json
  let timestamps: number[] = [];
  let open: number[] = [];
  if (Array.isArray(json)) {
    timestamps = json.map((d: any) => Array.isArray(d) ? d[0] : d.t);
    open = json.map((d: any) => Array.isArray(d) ? d[1] : d.y);
  } else if (json.timestamps && json.open) {
    timestamps = json.timestamps;
    open = json.open;
  } else if (json.series) {
    timestamps = json.series.map((p: any) => p.t);
    open = json.series.map((p: any) => p.y);
  }

  return { id, timestamps, open };
}
