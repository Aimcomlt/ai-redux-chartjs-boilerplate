// ============================================================
// File: src/App.tsx (example wiring)
// ============================================================
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import ChartCanvas from '@/features/charts/ChartCanvas';
import BrainModal from '@/features/brains/BrainModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addChart } from '@/features/charts/chartsSlice';

function AppContent() {
  const [open, setOpen] = useState(false);
  const charts = useAppSelector((s) => s.charts);
  const dispatch = useAppDispatch();
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brain Lab</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            Add Brain
          </button>
          <button
            onClick={() => dispatch(addChart())}
            className="rounded-xl bg-gray-200 px-4 py-2"
          >
            Add Chart
          </button>
        </div>
      </header>
      <div className="space-y-4">
        {charts.allIds.map((id) => (
          <ChartCanvas key={id} chartId={id} />
        ))}
      </div>
      <BrainModal
        isOpen={open}
        onClose={() => setOpen(false)}
        defaultDatasetId="open"
      />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
