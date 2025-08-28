import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataQualityBanner } from '../DataQualityBanner';
import styles from '../DataQualityBanner.module.css';

describe('DataQualityBanner', () => {
  it('renders correct variant class', () => {
    const { container } = render(
      <DataQualityBanner variant="warning" message="Be careful" />
    );
    const banner = container.firstChild as HTMLElement;
    expect(banner).toHaveClass(styles.warning);
    expect(banner).toHaveAttribute('role', 'status');
  });

  it('role changes for error', () => {
    render(<DataQualityBanner variant="error" message="Boom" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('dismiss click calls onClose', () => {
    const onClose = vi.fn();
    render(
      <DataQualityBanner message="Info" dismissible onClose={onClose} />
    );
    fireEvent.click(screen.getByLabelText(/Close banner/i));
    expect(onClose).toHaveBeenCalled();
  });
});
