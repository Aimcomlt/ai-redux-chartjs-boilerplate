import React from 'react';
import {
  CompositeChart,
  KpiCard,
  DataQualityBanner,
} from '../components/common';
import { useAppSelector } from '@/store/hooks';
import { selectPredictions, selectMetrics } from '@/features/training/trainingSlice';
import {
  selectOpenSeries,
  selectTimestamps,
} from '@/features/datasets/datasetsSlice';

export const Overview: React.FC = () => {
  const predictions = useAppSelector(selectPredictions);
  const metrics = useAppSelector(selectMetrics);
  const open = useAppSelector(selectOpenSeries);
  const timestamps = useAppSelector(selectTimestamps);

  const labels = predictions.map((p) => new Date(p.t).toLocaleString());
  const predicted = predictions.map((p) => p.y);
  const actual = predictions.map((p) => {
    const idx = timestamps.indexOf(p.t);
    return idx !== -1 ? open[idx] : 0;
  });

  const hasResults = predictions.length > 0;

  return (
    <div className="overview-page">
      {hasResults ? (
        <>
          <section className="kpi-section">
            <KpiCard
              label="MSE"
              value={metrics?.mse?.toFixed(4) ?? '-'}
            />
            <KpiCard
              label="MAE"
              value={metrics?.mae?.toFixed(4) ?? '-'}
            />
            <KpiCard
              label="MAPE"
              value={metrics?.mape?.toFixed(2) ?? '-'}
            />
          </section>
          <CompositeChart
            labels={labels}
            actualData={actual}
            predictedData={predicted}
          />
        </>
      ) : (
        <DataQualityBanner message="No training results yet" />
      )}
    </div>
  );
};

export default Overview;
