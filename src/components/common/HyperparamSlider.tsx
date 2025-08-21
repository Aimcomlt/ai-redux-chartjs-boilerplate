import React from 'react';

interface HyperparamSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export const HyperparamSlider: React.FC<HyperparamSliderProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  onChange,
}) => (
  <label className="hyperparam-slider">
    {label}
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <span>{value}</span>
  </label>
);

export default HyperparamSlider;
