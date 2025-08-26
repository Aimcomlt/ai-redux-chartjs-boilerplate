// ============================================================
// File: src/features/brains/BrainModal.tsx
// ============================================================
import React, { useMemo, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createBrain, TrainBrainArgs, trainBrainRequested } from '@/store/brainsSlice';
import type { Activation, BrainModelType } from '@/types/brain';

interface BrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDatasetId?: string; // e.g., 'open'
}

const ACTIVATIONS: Activation[] = ['sigmoid', 'relu', 'leaky-relu', 'tanh', 'threshold'];
const TYPES: BrainModelType[] = ['feedforward', 'rnn', 'lstm'];

export const BrainModal: React.FC<BrainModalProps> = ({ isOpen, onClose, defaultDatasetId = 'open' }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [type, setType] = useState<BrainModelType>('lstm');
  const [activation, setActivation] = useState<Activation>('sigmoid');
  const [hidden, setHidden] = useState('32'); // comma-separated
  const [learningRate, setLearningRate] = useState(0.01);
  const [momentum, setMomentum] = useState(0.1);
  const [iterations, setIterations] = useState(2000);
  const [errorThresh, setErrorThresh] = useState(0.005);
  const [windowSize, setWindowSize] = useState(20);
  const [beta1, setBeta1] = useState(0.9);
  const [beta2, setBeta2] = useState(0.999);
  const [epsilon, setEpsilon] = useState(1e-8);

  const hiddenLayers = useMemo(() => hidden.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0), [hidden]);

  if (!isOpen) return null;

  const submit = async () => {
    const result = await dispatch(createBrain({
      name: name || undefined,
      architecture: { type, hiddenLayers, activation },
      hyper: { learningRate, momentum, iterations, errorThresh, windowSize, beta1, beta2, epsilon },
    }));
    const rec: any = result.payload;
    if (rec?.config?.id) {
      const args: TrainBrainArgs = { brainId: rec.config.id, datasetId: defaultDatasetId };
      dispatch(trainBrainRequested(args));
    }
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Brain</h2>
          <button aria-label="Close" onClick={onClose} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Name</span>
            <input className="rounded-lg border p-2" value={name} onChange={e => setName(e.target.value)} placeholder="Brain A" />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Type</span>
            <select className="rounded-lg border p-2" value={type} onChange={e => setType(e.target.value as BrainModelType)}>
              {TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Activation</span>
            <select className="rounded-lg border p-2" value={activation} onChange={e => setActivation(e.target.value as Activation)}>
              {ACTIVATIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Hidden Layers</span>
            <input className="rounded-lg border p-2" value={hidden} onChange={e => setHidden(e.target.value)} placeholder="32,16" />
            <span className="text-xs text-gray-500">Comma-separated integers</span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Learning Rate</span>
            <input type="number" step="0.001" className="rounded-lg border p-2" value={learningRate} onChange={e => setLearningRate(parseFloat(e.target.value))} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Momentum</span>
            <input type="number" step="0.01" className="rounded-lg border p-2" value={momentum} onChange={e => setMomentum(parseFloat(e.target.value))} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Iterations</span>
            <input type="number" className="rounded-lg border p-2" value={iterations} onChange={e => setIterations(parseInt(e.target.value,10))} />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Error Threshold</span>
            <input type="number" step="0.0001" className="rounded-lg border p-2" value={errorThresh} onChange={e => setErrorThresh(parseFloat(e.target.value))} />
          </label>

          {type === 'feedforward' && (
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-medium">Window Size (time steps)</span>
              <input type="number" className="rounded-lg border p-2" value={windowSize} onChange={e => setWindowSize(parseInt(e.target.value,10))} />
            </label>
          )}

          <div className="md:col-span-2">
            <details className="rounded-lg border p-3">
              <summary className="cursor-pointer font-medium">Advanced (Adam)</summary>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">beta1</span>
                  <input type="number" step="0.01" className="rounded-lg border p-2" value={beta1} onChange={e => setBeta1(parseFloat(e.target.value))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">beta2</span>
                  <input type="number" step="0.001" className="rounded-lg border p-2" value={beta2} onChange={e => setBeta2(parseFloat(e.target.value))} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium">epsilon</span>
                  <input type="number" step="0.0000001" className="rounded-lg border p-2" value={epsilon} onChange={e => setEpsilon(parseFloat(e.target.value))} />
                </label>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">Cancel</button>
          <button onClick={submit} className="rounded-xl bg-black px-4 py-2 text-white">Create & Train</button>
        </div>
      </div>
    </div>
  );
};

export default BrainModal;
}
