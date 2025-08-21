import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, it, expect } from 'vitest';
import brainReducer from '../features/brain/brainSlice';
import chartSettingsReducer from '../features/chartSettings/chartSettingsSlice';
import { lineDataset } from '../charts/datasets';
import { selectMetricSeries } from '../selectors/seriesSelectors';
import { Line } from 'react-chartjs-2';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }: { data: unknown }) => <div data-testid="chart-output">{JSON.stringify(data)}</div>,
}));

const TestChart: React.FC = () => {
  const { labels, values } = useSelector(selectMetricSeries);
  const data = { labels, datasets: [lineDataset(values, 'Metrics', 'rgba(0,0,0,1)')] };
  return <Line data={data} />;
};

describe('Chart components', () => {
  it('render datasets from Redux state', () => {
    const brainInitial = brainReducer(undefined, { type: 'init' });
    const chartInitial = chartSettingsReducer(undefined, { type: 'init' });

    const store = configureStore({
      reducer: { brain: brainReducer, chartSettings: chartSettingsReducer },
      preloadedState: {
        brain: {
          ...brainInitial,
          metrics: { labels: ['A', 'B'], values: [1, 2] },
        },
        chartSettings: chartInitial,
      },
    });

    render(
      <Provider store={store}>
        <TestChart />
      </Provider>
    );

    const data = JSON.parse(screen.getByTestId('chart-output').textContent || '{}');
    expect(data.labels).toEqual(['A', 'B']);
    expect(data.datasets[0].data).toEqual([1, 2]);
  });
});
