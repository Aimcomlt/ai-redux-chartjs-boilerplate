import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HyperparamSlider } from '../HyperparamSlider';

describe('HyperparamSlider', () => {
  it('updates value via keyboard and calls onChange', () => {
    const onChange = vi.fn();
    render(
      <HyperparamSlider label="Test" value={0} min={0} max={10} step={1} onChange={onChange} />
    );
    const slider = screen.getByRole('slider');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    fireEvent.change(slider, { target: { value: '1' } });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('displays formatted value', () => {
    render(
      <HyperparamSlider
        label="LR"
        value={0.1234}
        precision={2}
        suffix="%"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('LR:')).toBeInTheDocument();
    expect(screen.getByText('0.12%')).toBeInTheDocument();
  });
});
