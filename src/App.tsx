// ============================================================
// File: src/App.tsx (example wiring)
// ============================================================
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import ChartCanvas from '@/features/charts/ChartCanvas';
import BrainModal from '@/features/brains/BrainModal';

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <Provider store={store}>
      <div className="mx-auto max-w-5xl p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Brain Lab</h1>
          <button onClick={() => setOpen(true)} className="rounded-xl bg-black px-4 py-2 text-white">Add Brain</button>
        </header>
        <ChartCanvas />
        <BrainModal isOpen={open} onClose={() => setOpen(false)} defaultDatasetId="open" />
      </div>
    </Provider>
  );
}
