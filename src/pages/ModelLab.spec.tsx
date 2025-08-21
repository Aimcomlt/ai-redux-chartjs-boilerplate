import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import brainReducer from '../features/brain/brainSlice';
import ModelLab from './ModelLab';

describe('ModelLab page', () => {
  it('renders training controls', () => {
    const store = configureStore({ reducer: { brain: brainReducer } });
    render(
      <Provider store={store}>
        <ModelLab />
      </Provider>
    );
    expect(screen.getByText('Train Model')).toBeInTheDocument();
    expect(screen.getByText(/Latest Run/i)).toBeInTheDocument();
  });
});
