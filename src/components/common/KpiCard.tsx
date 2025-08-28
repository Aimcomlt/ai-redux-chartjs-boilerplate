import React from 'react';
import styles from './KpiCard.module.css';

export interface KpiCardProps {
  label: string;
  value: string | number;
  helpText?: string;
  colorScheme?: 'default' | 'blue' | 'green' | 'red' | 'amber';
  formatValue?: (v: string | number) => string;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  helpText,
  colorScheme = 'default',
  formatValue,
  className,
}) => {
  const displayValue = formatValue ? formatValue(value) : String(value);
  const schemeClass = styles[`accent-${colorScheme}` as keyof typeof styles];
  const classes = [styles.card, schemeClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div tabIndex={0} className={classes}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{displayValue}</div>
      {helpText && <div className={styles.helpText}>{helpText}</div>}
    </div>
  );
};

export default KpiCard;
