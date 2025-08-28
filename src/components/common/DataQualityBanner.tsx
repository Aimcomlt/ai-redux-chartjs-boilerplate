import React, { useState } from 'react';
import styles from './DataQualityBanner.module.css';

export type BannerVariant = 'info' | 'warning' | 'error' | 'success';

export interface DataQualityBannerProps {
  variant?: BannerVariant;
  message: string;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
}

const variantIcons: Record<BannerVariant, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
};

export const DataQualityBanner: React.FC<DataQualityBannerProps> = ({
  variant = 'info',
  message,
  dismissible = false,
  onClose,
  className,
}) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  const role = variant === 'error' ? 'alert' : 'status';
  const classes = [styles.banner, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <div className={classes} role={role} aria-live={variant === 'error' ? 'assertive' : 'polite'}>
      <span className={styles.icon}>{variantIcons[variant]}</span>
      <span className={styles.message}>{message}</span>
      {dismissible && (
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Close banner"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default DataQualityBanner;
