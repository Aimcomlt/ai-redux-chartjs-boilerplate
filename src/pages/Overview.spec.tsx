import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import trainingReducer from '@/features/training/trainingSlice';
import datasetsReducer from '@/features/datasets/datasetsSlice';
import Overview from './Overview';

describe('Overview page', () => {
  it('renders CompositeChart', () => {
    const store = configureStore({
      reducer: { training: trainingReducer, datasets: datasetsReducer },
      preloadedState: {
        datasets: {
          byId: {
            open: {
              id: 'open',
              timestamps: [1, 2, 3],
              open: [1, 2, 3],
              normalized: [0, 0.5, 1],
              series: [
                { t: 1, y: 1 },
                { t: 2, y: 2 },
                { t: 3, y: 3 },
              ],
            },
          },
          allIds: ['open'],
          activeDatasetId: 'open',
        },
      },
    });
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Overview />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/No training results yet/i)).toBeInTheDocument();
  });
});
