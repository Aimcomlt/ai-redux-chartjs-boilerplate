import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value }) => (
  <div className="kpi-card">
    <h3>{label}</h3>
    <p>{value}</p>
  </div>
);

export default KpiCard;
