// ============================================================
// File: src/features/charts/ChartCanvas.tsx
// ============================================================
import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  Time,
} from 'lightweight-charts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { assignColor } from '@/styles/ColorRegistry';
import { useGetOhlcQuery } from '@/features/markets/marketApi';
import {
  addSeries,
  moveSeries,
  setSeriesVisibility,
} from '@/features/charts/chartsSlice';
export const ChartCanvas: React.FC<{ chartId: string }> = ({ chartId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const seriesRef = useRef<Record<string, ISeriesApi<'Line'>>>({});
  const actualColor = useRef(assignColor('actual')).current;
  const dispatch = useAppDispatch();

  // Redux state
  const brains = useAppSelector((s) => s.brains);
  const chartState = useAppSelector((s) => s.charts.byId[chartId]);
  const seriesMeta = chartState?.series ?? [];
  const { data: ohlcData } = useGetOhlcQuery({});

  // -----------------------------------------------------------------------
  // Chart creation / disposal
  // -----------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: 0,
      height: 0,
      layout: { background: { color: 'transparent' }, textColor: '#333' },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
    });
    chartRef.current = chart;

    const resize = () => {
      if (!container) return;
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };
    resize();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(container);
    } else {
      window.addEventListener('resize', resize);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', resize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = {};
    };
  }, []);

  // -----------------------------------------------------------------------
  // Baseline "Actual Open" series
  // -----------------------------------------------------------------------
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const key = 'actual';
    let series = seriesRef.current[key];
    if (!series) {
      series = chart.addLineSeries({
        color: actualColor,
        title: 'Actual Open',
        priceLineVisible: false,
      });
      seriesRef.current[key] = series;
    }
    if (ohlcData) {
      const data: LineData[] = (ohlcData as any[]).map((k) => ({
        time: Math.floor(k[0] / 1000) as Time,
        value: Number(k[1]),
      }));
      series.setData(data);
    }
    const meta = seriesMeta.find((s) => s.brainId === key);
    series.applyOptions({ visible: meta?.visible !== false });
  }, [ohlcData, seriesMeta]);

  // ensure all brains are represented in chart series
  useEffect(() => {
    const existing = new Set(seriesMeta.map((s) => s.brainId));
    brains.allIds.forEach((id) => {
      if (!existing.has(id)) {
        dispatch(addSeries({ chartId, brainId: id }));
      }
    });
  }, [brains.allIds, seriesMeta, dispatch, chartId]);

  // -----------------------------------------------------------------------
  // Prediction series for each brain
  // -----------------------------------------------------------------------
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const map = seriesRef.current;
    const preds = brains.predictions;

    Object.entries(preds).forEach(([id, seriesData]) => {
      if (!seriesMeta.find((s) => s.brainId === id)) return;
      let series = map[id];
      if (!series) {
        const color = brains.byId[id]?.color ?? assignColor(id);
        series = chart.addLineSeries({
          color,
          title: brains.byId[id]?.config.name ?? id,
          priceLineVisible: false,
        });
        map[id] = series;
      }
      const data: LineData[] = seriesData.points.map((p) => ({
        time: Math.floor(p.t / 1000) as Time,
        value: p.y,
      }));
      series.setData(data);
      const meta = seriesMeta.find((s) => s.brainId === id);
      series.applyOptions({ visible: meta?.visible !== false });
    });

    // remove series that no longer belong to this chart
    Object.keys(map).forEach((id) => {
      if (id === 'actual') return;
      if (!seriesMeta.find((s) => s.brainId === id)) {
        chart.removeSeries(map[id]);
        delete map[id];
      }
    });
  }, [brains.predictions, brains.byId, seriesMeta]);

  // -----------------------------------------------------------------------
  // Tooltip handling
  // -----------------------------------------------------------------------
  useEffect(() => {
    const chart = chartRef.current;
    const container = containerRef.current;
    if (!chart || !container) return;

    const tooltip = document.createElement('div');
    tooltip.className =
      'absolute z-10 rounded bg-white px-2 py-1 text-xs shadow pointer-events-none';
    tooltip.style.display = 'none';
    container.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const handler = (param: any) => {
      if (!tooltipRef.current) return;
      const point = param.point;
      if (
        !param.time ||
        !point ||
        point.x < 0 ||
        point.x > container.clientWidth ||
        point.y < 0 ||
        point.y > container.clientHeight
      ) {
        tooltipRef.current.style.display = 'none';
        return;
      }

      const time = new Date((param.time as number) * 1000);
      const actualSeries = seriesRef.current['actual'];
      const actual = actualSeries
        ? param.seriesPrices.get(actualSeries)
        : undefined;

      let html = `<div>${time.toLocaleString()}</div>`;
      if (actual !== undefined) {
        html += `<div><span style="color:${actualColor}">Actual: ${Number(
          actual,
        ).toFixed(2)}</span></div>`;
      }

      seriesMeta.forEach((ref) => {
        const id = ref.brainId;
        if (id === 'actual') return;
        const s = seriesRef.current[id];
        if (!s) return;
        const price = param.seriesPrices.get(s);
        if (price === undefined) return;
        const color = brains.byId[id]?.color ?? assignColor(id);
        const metrics = brains.byId[id]?.metrics;
        const err =
          actual !== undefined ? Math.abs(Number(price) - Number(actual)) : undefined;
        html += `<div><span style="color:${color}">${
          brains.byId[id]?.config.name ?? id
        }: ${Number(price).toFixed(2)}</span>`;
        if (err !== undefined) {
          const pctErr = (err / Number(actual)) * 100;
          html += ` <span>err ${err.toFixed(2)} (${pctErr.toFixed(2)}%)</span>`;
        }
        if (metrics) {
          const parts: string[] = [];
          if (metrics.mse !== undefined) parts.push(`mse ${metrics.mse.toFixed(4)}`);
          if (metrics.mae !== undefined) parts.push(`mae ${metrics.mae.toFixed(4)}`);
          if (metrics.mape !== undefined) parts.push(`mape ${metrics.mape.toFixed(4)}`);
          if (parts.length) html += ` <span>${parts.join(' ')}</span>`;
        }
        html += '</div>';
      });

      tooltipRef.current.innerHTML = html;
      tooltipRef.current.style.left = `${point.x + 15}px`;
      tooltipRef.current.style.top = `${point.y + 15}px`;
      tooltipRef.current.style.display = 'block';
    };

    chart.subscribeCrosshairMove(handler);
    return () => {
      chart.unsubscribeCrosshairMove(handler);
      tooltip.remove();
      tooltipRef.current = null;
    };
  }, [brains, seriesMeta]);

  // -----------------------------------------------------------------------
  // Legend toggles and move controls
  // -----------------------------------------------------------------------
  const handleMoveSeries = (id: string) => {
    const toChart = window.prompt('Move series to chart id:');
    if (toChart) dispatch(moveSeries({ fromChartId: chartId, toChartId: toChart, brainId: id }));
  };

  const legendItems = seriesMeta.map((ref) => ({
    id: ref.brainId,
    name:
      ref.brainId === 'actual'
        ? 'Actual Open'
        : brains.byId[ref.brainId]?.config.name ?? ref.brainId,
    color:
      ref.brainId === 'actual'
        ? actualColor
        : brains.byId[ref.brainId]?.color ?? assignColor(ref.brainId),
    visible: ref.visible !== false,
  }));

  return (
    <div className="relative rounded-2xl border p-4">
      <div ref={containerRef} className="h-64 w-full" />
      <div className="mt-2 flex flex-wrap gap-4 text-xs">
        {legendItems.map((item) => (
          <label
            key={item.id}
            onContextMenu={(e) => {
              e.preventDefault();
              handleMoveSeries(item.id);
            }}
            className="flex cursor-pointer items-center gap-1 select-none"
          >
            <input
              type="checkbox"
              checked={item.visible}
              onChange={() =>
                dispatch(
                  setSeriesVisibility({
                    chartId,
                    brainId: item.id,
                    visible: !item.visible,
                  }),
                )
              }
            />
            <span style={{ color: item.color }}>{item.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ChartCanvas;
