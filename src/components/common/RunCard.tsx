import React from 'react';
import styles from './RunCard.module.css';

export type RunStatus = 'idle' | 'running' | 'complete' | 'error';

export interface RunCardProps {
  title: string;
  status: RunStatus;
  progress?: { iter?: number; error?: number };
  className?: string;
}

export const RunCard: React.FC<RunCardProps> = ({
  title,
  status,
  progress,
  className,
}) => {
  const classes = [styles.card, styles[`status-${status}`], className]
    .filter(Boolean)
    .join(' ');
  const role = status === 'error' ? 'alert' : status === 'running' ? 'status' : undefined;

  return (
    <div className={classes} role={role} aria-live={status === 'running' ? 'polite' : undefined}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <span className={styles.statusText}>{status}</span>
      </div>
      {status === 'running' && (
        <>
          <div className={styles.progressBar}>
            <div className={styles.progressIndicator} />
          </div>
          {progress && (
            <div className={styles.progressDetails}>
              {progress.iter !== undefined && (
                <span>Iter {progress.iter}</span>
              )}
              {progress.error !== undefined && (
                <span>Error {progress.error.toFixed(4)}</span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RunCard;
