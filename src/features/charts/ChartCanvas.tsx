// ============================================================
// File: src/features/charts/ChartCanvas.tsx (minimal stub)
// ============================================================
import React from 'react';
import { useAppSelector } from '@/store/hooks';

export const ChartCanvas: React.FC = () => {
  const brains = useAppSelector(s => s.brains);
  // Replace with Lightweight-Charts/uPlot implementation.
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-2 text-sm text-gray-600">Chart stub — series count: {Object.keys(brains.predictions).length}</div>
      <div className="h-64 w-full bg-[repeating-linear-gradient(0deg,transparent,transparent_14px,#eee_14px,#eee_15px)]" />
    </div>
  );
};

export default ChartCanvas;
