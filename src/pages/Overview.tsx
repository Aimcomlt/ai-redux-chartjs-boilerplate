import React from 'react';
import { CompositeChart, KpiCard } from '../components/common';

export const Overview: React.FC = () => (
  <div className="overview-page">
    <section className="kpi-section">
      <KpiCard label="Accuracy" value="95%" />
      <KpiCard label="Loss" value="0.05" />
    </section>
    <CompositeChart />
  </div>
);

export default Overview;
