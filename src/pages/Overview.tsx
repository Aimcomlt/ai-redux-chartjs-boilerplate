import React from 'react';
import { CompositeChart } from '../components/common/CompositeChart';
import { KpiCard } from '../components/common/KpiCard';
import { DataQualityBanner } from '../components/common/DataQualityBanner';
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
              value={metrics?.mse ?? '-'}
              formatValue={(v) =>
                typeof v === 'number' ? v.toFixed(4) : String(v)
              }
            />
            <KpiCard
              label="MAE"
              value={metrics?.mae ?? '-'}
              formatValue={(v) =>
                typeof v === 'number' ? v.toFixed(4) : String(v)
              }
            />
            <KpiCard
              label="MAPE"
              value={metrics?.mape ?? '-'}
              formatValue={(v) =>
                typeof v === 'number' ? v.toFixed(2) : String(v)
              }
            />
          </section>
          <CompositeChart
            labels={labels}
            actualData={actual}
            predictedData={predicted}
          />
        </>
      ) : (
        <DataQualityBanner
          variant="warning"
          message="No training results yet. Run a model in Model Lab to see metrics and charts."
        />
      )}
    </div>
  );
};

export default Overview;
