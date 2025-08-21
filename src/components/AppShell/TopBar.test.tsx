import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TopBar } from './TopBar';

describe('TopBar', () => {
  it('toggles themes between light and dark', () => {
    render(<TopBar />);
    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    fireEvent.click(button);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    fireEvent.click(button);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
