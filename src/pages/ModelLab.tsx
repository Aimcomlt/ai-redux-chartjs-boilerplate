import React, { useState } from 'react';
import {
  DataQualityBanner,
  HyperparamSlider,
  RunCard,
} from '../components/common';

export const ModelLab: React.FC = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [status, setStatus] = useState('Idle');

  const startTraining = () => {
    setStatus('Training started...');
    setTimeout(() => {
      setStatus('Training complete');
    }, 1000);
  };

  return (
    <div className="model-lab-page">
      <DataQualityBanner message="Data looks good" />
      <HyperparamSlider
        label="Learning Rate"
        value={learningRate}
        min={0}
        max={1}
        step={0.01}
        onChange={setLearningRate}
      />
      <button onClick={startTraining}>Train Model</button>
      <div aria-live="polite">{status}</div>
      <RunCard title="Latest Run" status={status} />
    </div>
  );
};

export default ModelLab;
