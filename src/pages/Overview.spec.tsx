import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import brainReducer from '../features/brain/brainSlice';
import Overview from './Overview';

describe('Overview page', () => {
  it('renders CompositeChart', () => {
    const store = configureStore({ reducer: { brain: brainReducer } });
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Overview />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Composite Chart Placeholder/i)).toBeInTheDocument();
  });
});
