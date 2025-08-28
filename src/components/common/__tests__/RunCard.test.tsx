import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RunCard } from '../RunCard';
import styles from '../RunCard.module.css';

describe('RunCard', () => {
  it('applies status color', () => {
    const { container } = render(<RunCard title="Run" status="running" />);
    expect(container.firstChild).toHaveClass(styles['status-running']);
  });

  it('shows progress only when running', () => {
    const { container } = render(
      <RunCard title="Run" status="running" progress={{ iter: 1, error: 0.1 }} />
    );
    expect(screen.getByText(/Iter 1/)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.progressBar}`)).not.toBeNull();

    const { container: idleContainer } = render(
      <RunCard title="Run" status="idle" />
    );
    expect(idleContainer.querySelector(`.${styles.progressBar}`)).toBeNull();
  });
});
