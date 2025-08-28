import React, { useState } from 'react';
import {
  DataQualityBanner,
  HyperparamSlider,
  RunCard,
} from '../components/common';
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
      <HyperparamSlider
        label="Learning Rate"
        value={learningRate}
        min={0}
        max={1}
        step={0.01}
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
      <button onClick={startTraining}>Train Model</button>
      {status === 'running' && progress ? (
        <div aria-live="polite">
          Iter {progress.iter} Error {progress.error.toFixed(4)}
        </div>
      ) : null}
      <RunCard title="Latest Run" status={status} />
    </div>
  );
};

export default ModelLab;
