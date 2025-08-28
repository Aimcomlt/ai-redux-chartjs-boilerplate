import React, { useState } from 'react';
import { DataQualityBanner } from '../components/common/DataQualityBanner';
import { HyperparamSlider } from '../components/common/HyperparamSlider';
import { RunCard } from '../components/common/RunCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectTrainingStatus,
  selectProgress,
  trainModelAsync,
} from '@/features/training/trainingSlice';
import {
  selectOpenSeries,
  selectTimestamps,
} from '@/features/datasets/datasetsSlice';
import type { BrainConfig } from '@/types/brain';

export const ModelLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectTrainingStatus);
  const progress = useAppSelector(selectProgress);
  const open = useAppSelector(selectOpenSeries);
  const timestamps = useAppSelector(selectTimestamps);

  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(1000);

  const startTraining = () => {
    const config: BrainConfig = {
      id: 'temp',
      name: 'TempBrain',
      architecture: { type: 'feedforward', hiddenLayers: [8, 8], activation: 'sigmoid' },
      hyper: {
        learningRate,
        iterations,
        errorThresh: 0.005,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    dispatch(
      trainModelAsync({
        config,
        dataset: { timestamps, open },
      }),
    );
  };

  return (
    <div className="model-lab-page">
      <DataQualityBanner message={open.length ? 'Data loaded' : 'No data'} />
      <div
        style={{
          padding: '16px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '16px',
        }}
      >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem' }}>Hyperparameters</h3>
        <HyperparamSlider
          label="Learning Rate"
          value={learningRate}
          min={0}
          max={1}
          step={0.01}
          precision={4}
          onChange={setLearningRate}
        />
        <HyperparamSlider
          label="Iterations"
          value={iterations}
          min={100}
          max={5000}
          step={100}
          onChange={setIterations}
        />
      </div>
      <button onClick={startTraining}>Train Model</button>
      <RunCard title="Latest Run" status={status} progress={progress} />
    </div>
  );
};

export default ModelLab;
