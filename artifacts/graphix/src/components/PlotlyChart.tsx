import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

// Stable references so the update effect doesn't re-run when no layout/config is passed
const DEFAULT_LAYOUT: Partial<Plotly.Layout> = {};
const DEFAULT_CONFIG: Partial<Plotly.Config> = {};

interface PlotlyChartProps {
  data: Plotly.Data[];
  layout?: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  className?: string;
}

export function PlotlyChart({
  data,
  layout = DEFAULT_LAYOUT,
  config = DEFAULT_CONFIG,
  className = '',
}: PlotlyChartProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  // Update the plot whenever data/layout/config change.
  // Plotly.react updates in-place — no purge needed between updates.
  useEffect(() => {
    if (!plotRef.current) return;

    const mergedLayout: Partial<Plotly.Layout> = {
      paper_bgcolor: 'hsl(229, 30%, 11%)',
      plot_bgcolor: 'hsl(229, 35%, 8%)',
      font: {
        color: 'hsl(210, 100%, 98%)',
        family: 'DM Sans, sans-serif',
      },
      xaxis: {
        gridcolor: 'hsl(228, 25%, 20%)',
        zerolinecolor: 'hsl(228, 25%, 25%)',
        color: 'hsl(210, 100%, 98%)',
      },
      yaxis: {
        gridcolor: 'hsl(228, 25%, 20%)',
        zerolinecolor: 'hsl(228, 25%, 25%)',
        color: 'hsl(210, 100%, 98%)',
      },
      margin: { l: 60, r: 40, t: 40, b: 60 },
      ...layout,
    };

    const mergedConfig: Partial<Plotly.Config> = {
      displayModeBar: true,
      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toImage'],
      scrollZoom: true,
      displaylogo: false,
      ...config,
    };

    try {
      Plotly.react(plotRef.current, data, mergedLayout, mergedConfig);
    } catch {
      // Plotly sometimes throws strings — swallow so they don't surface as
      // "uncaught exception that is not an Error object"
    }
  }, [data, layout, config]);

  // Separate effect: purge only when the component actually unmounts.
  // Keeping this out of the update effect prevents repeated purge calls
  // which is what Plotly throws strings on.
  useEffect(() => {
    return () => {
      try {
        if (plotRef.current) Plotly.purge(plotRef.current);
      } catch {
        // Plotly purge can throw a string — safe to ignore on unmount
      }
    };
  }, []);

  return (
    <div ref={plotRef} className={className} style={{ height: '100%', minHeight: '500px' }} />
  );
}
