import React from 'react';

interface RunCardProps {
  title: string;
  status: 'idle' | 'running' | 'complete' | 'error';
}

const statusColor: Record<RunCardProps['status'], string> = {
  idle: '#ccc',
  running: 'orange',
  complete: 'green',
  error: 'red',
};

export const RunCard: React.FC<RunCardProps> = ({ title, status }) => (
  <div
    className="run-card"
    style={{
      border: `2px solid ${statusColor[status]}`,
      padding: '8px',
      borderRadius: '4px',
    }}
  >
    <h4 style={{ margin: 0 }}>{title}</h4>
    <p style={{ margin: 0 }}>{status}</p>
  </div>
);

export default RunCard;
