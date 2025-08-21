import React from 'react';

interface RunCardProps {
  title: string;
  status: string;
}

export const RunCard: React.FC<RunCardProps> = ({ title, status }) => (
  <div className="run-card">
    <h4>{title}</h4>
    <p>{status}</p>
  </div>
);

export default RunCard;
