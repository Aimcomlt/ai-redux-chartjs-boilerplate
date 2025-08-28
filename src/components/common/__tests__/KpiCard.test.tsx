import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiCard } from '../KpiCard';
import styles from '../KpiCard.module.css';

describe('KpiCard', () => {
  it('renders label and value', () => {
    render(<KpiCard label="Accuracy" value="95%" />);
    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('applies colorScheme class and formats value', () => {
    const { container } = render(
      <KpiCard
        label="Score"
        value={1.2345}
        colorScheme="blue"
        formatValue={(v) => Number(v).toFixed(2)}
      />
    );
    expect(screen.getByText('1.23')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(styles['accent-blue']);
  });
});
