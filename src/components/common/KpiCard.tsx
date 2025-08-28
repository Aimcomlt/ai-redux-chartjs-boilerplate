import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value }) => (
  <div
    className="kpi-card"
    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
  >
    <h3 style={{ margin: 0, fontSize: '1rem' }}>{label}</h3>
    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</p>
  </div>
);

export default KpiCard;
