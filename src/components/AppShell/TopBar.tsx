import React, { useEffect, useState } from 'react';

export const TopBar: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="top-bar">
      <button onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌞' : '🌙'}
      </button>
    </header>
  );
};

export default TopBar;
