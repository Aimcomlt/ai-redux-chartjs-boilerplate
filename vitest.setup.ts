import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserver,
});

// Mock IntersectionObserver
class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserver,
});

// Mock canvas getContext for Chart.js
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  canvas: document.createElement('canvas'),
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
}));

// Stub node-canvas and gl to avoid native bindings
vi.mock('canvas', () => ({
  Canvas: class {},
  Image: class {},
  createCanvas: () => document.createElement('canvas'),
}), { virtual: true });
vi.mock('gl', () => ({}), { virtual: true });
vi.mock('chart.js', () => ({
  Chart: class {},
  register: () => {},
  CategoryScale: class {},
  LinearScale: class {},
  PointElement: class {},
  LineElement: class {},
  Title: class {},
  Tooltip: class {},
  Legend: class {},
}), { virtual: true });

// Stub out react-chartjs-2 components with simple div placeholders
vi.mock('react-chartjs-2', () => {
  const ChartStub = ({ data }: { data?: unknown }) =>
    React.createElement(
      'div',
      { 'data-testid': 'chart-output' },
      data ? JSON.stringify(data) : null
    );

  return {
    Line: ChartStub,
    Bar: ChartStub,
    Pie: ChartStub,
    Doughnut: ChartStub,
    Radar: ChartStub,
    PolarArea: ChartStub,
    Bubble: ChartStub,
    Scatter: ChartStub,
  } as Record<string, unknown>;
});
