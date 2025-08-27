// ============================================================
// File: src/lib/persist/session.ts
// ============================================================
import type { RootState } from '@/store';
import type { BrainsState } from '@/store/brainsSlice';
import { serializeColorRegistry, hydrateColorRegistry } from '@/styles/ColorRegistry';

interface PersistedSession {
  brains: Pick<BrainsState, 'byId' | 'allIds' | 'predictions'>;
  charts?: unknown;
  colors: [string, string][];
}

const KEY = 'app_session';

export function loadSession(): Partial<RootState> | undefined {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return undefined;
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return undefined;
    const data = JSON.parse(raw) as PersistedSession;
    hydrateColorRegistry(data.colors || []);
    return {
      brains: data.brains ?? { byId: {}, allIds: [], predictions: {} },
      ...(data.charts ? { charts: data.charts } : {}),
    } as Partial<RootState>;
  } catch (err) {
    console.warn('Failed to load session', err);
    return undefined;
  }
}

export function saveSession(state: RootState): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const charts = (state as unknown as { charts?: unknown }).charts;
    const session: PersistedSession = {
      brains: {
        byId: state.brains.byId,
        allIds: state.brains.allIds,
        predictions: state.brains.predictions,
      },
      charts,
      colors: serializeColorRegistry(),
    };
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Failed to save session', err);
  }
}
