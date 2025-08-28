import React, { useId } from 'react';
import styles from './HyperparamSlider.module.css';

export interface HyperparamSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
  precision?: number;
  disabled?: boolean;
  className?: string;
}

export const HyperparamSlider: React.FC<HyperparamSliderProps> = ({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.1,
  onChange,
  suffix = '',
  precision = 2,
  disabled = false,
  className,
}) => {
  const sliderId = useId();
  const valueId = useId();
  const formatted = value.toFixed(precision) + suffix;
  const classes = [styles.container, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <label htmlFor={sliderId} className={styles.labelLine}>
        <span>{label}:</span>
        <span id={valueId} className={styles.valueDisplay}>
          {formatted}
        </span>
      </label>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-describedby={valueId}
        disabled={disabled}
        className={styles.slider}
      />
    </div>
  );
};

export default HyperparamSlider;
