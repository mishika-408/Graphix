import { useState, useMemo } from 'react';
import { PlotlyChart } from '@/components/PlotlyChart';
import { EquationInput } from '@/components/EquationInput';
import { Input } from '@/components/ui/input';
import { evaluate3D, validate3D } from '@/lib/math-utils';
import { MathConcepts } from '@/components/MathConcepts';
import { motion } from 'framer-motion';

const EXAMPLES = [
  { label: 'Ripple wave', expr: 'sin(sqrt(x^2 + y^2))' },
  { label: 'Bowl / paraboloid', expr: 'x^2 + y^2' },
  { label: 'Saddle', expr: 'x^2 - y^2' },
  { label: 'Rolling hills', expr: 'sin(x) * cos(y)' },
  { label: 'Bell curve', expr: 'exp(-x^2 - y^2)' },
  { label: 'Flat plane', expr: 'x + y' },
];

export default function Grapher3D() {
  const [expression, setExpression] = useState('sin(sqrt(x^2 + y^2))');
  const [xMin, setXMin] = useState('-5');
  const [xMax, setXMax] = useState('5');
  const [yMin, setYMin] = useState('-5');
  const [yMax, setYMax] = useState('5');

  const xMinNum = parseFloat(xMin) || -5;
  const xMaxNum = parseFloat(xMax) || 5;
  const yMinNum = parseFloat(yMin) || -5;
  const yMaxNum = parseFloat(yMax) || 5;

  const plotData = useMemo(() => {
    if (!expression.trim()) return [];
    try {
      const data = evaluate3D(expression, xMinNum, xMaxNum, yMinNum, yMaxNum);
      return [
        {
          type: 'surface' as const,
          x: data.x,
          y: data.y,
          z: data.z,
          colorscale: [
            [0, 'hsl(270, 85%, 35%)'],
            [0.25, 'hsl(270, 85%, 50%)'],
            [0.5, 'hsl(190, 100%, 40%)'],
            [0.75, 'hsl(190, 100%, 55%)'],
            [1, 'hsl(50, 100%, 60%)'],
          ],
          contours: {
            z: {
              show: true,
              usecolormap: true,
              highlightcolor: 'hsl(190, 100%, 50%)',
              project: { z: true },
            },
          },
        },
      ];
    } catch {
      return [];
    }
  }, [expression, xMinNum, xMaxNum, yMinNum, yMaxNum]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 h-full"
    >
      {/* Controls */}
      <div className="space-y-4">

        {/* Explainer */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-2">
          <h2 className="text-base font-semibold text-secondary">What is 3D graphing?</h2>
          <p className="text-sm text-muted-foreground">
            In 3D mode you type a formula using <span className="text-foreground font-mono">x</span> and <span className="text-foreground font-mono">y</span>. The graph shows the <span className="text-foreground font-mono">z</span> height at every (x, y) point — like a landscape seen from above. You get three axes: <span className="text-foreground">X</span> (left-right), <span className="text-foreground">Y</span> (forward-back), and <span className="text-foreground">Z</span> (up-down).
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">Controls:</span> drag to rotate, scroll to zoom, right-click drag to pan.
          </p>
        </div>

        {/* Quick examples */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <h2 className="text-base font-semibold text-secondary">Try an example</h2>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.expr}
                onClick={() => setExpression(ex.expr)}
                className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground transition-colors border border-border"
                data-testid={`button-example-${ex.label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equation */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-secondary">Your 3D equation</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Type a formula using x and y. The result becomes the height (z).</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">z =</label>
            <EquationInput
              value={expression}
              onChange={setExpression}
              placeholder="e.g. sin(x) * cos(y)"
              color="hsl(270, 85%, 60%)"
              error={expression.trim() ? validate3D(expression) : null}
            />
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>Use <span className="font-mono text-foreground">x^2</span> for squared, <span className="font-mono text-foreground">*</span> for multiply, <span className="font-mono text-foreground">sqrt(x)</span> for square root.</p>
          </div>
        </div>

        {/* Math Concepts */}
        <MathConcepts title="What do these words mean?" concepts={[
          {
            term: '3D surface',
            emoji: '🏔️',
            short: 'a landscape shaped by math',
            detail: 'Instead of a flat curve, you get a 3D surface — like a landscape. For every point on the ground (x, y), the formula tells you the height z. High values stick up; low values dip down.',
            example: 'x^2 + y^2 makes a bowl shape — highest at the edges, lowest at the center.',
          },
          {
            term: 'X, Y, Z axes',
            emoji: '🧭',
            short: 'the three directions in 3D space',
            detail: 'X goes left and right. Y goes forward and backward. Z goes up and down. Together they describe any point in 3D space, just like a map with altitude.',
            example: 'The point (2, 3, 5) is 2 units right, 3 units forward, and 5 units up.',
          },
          {
            term: 'sin and cos in 3D',
            emoji: '〰️',
            short: 'waves spread across a surface',
            detail: 'When you use sin(x)*cos(y), the wave pattern repeats across both directions — like ripples in a pond viewed from above.',
            example: 'sin(sqrt(x^2 + y^2)) makes a circular ripple spreading out from the center — like dropping a stone in water.',
          },
          {
            term: 'exp (e^x)',
            emoji: '📉',
            short: 'grows or shrinks very fast',
            detail: 'exp(x) means e raised to the power x (e ≈ 2.718). It grows explosively for positive x and shrinks toward zero for negative x.',
            example: 'exp(-x^2 - y^2) makes a bell-curve mountain — tall in the middle, fading smoothly to zero at the edges.',
          },
        ]} />

        {/* Range controls */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-secondary">Visible area</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Which part of the graph do you want to see?</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">X axis (left ↔ right)</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">From x =</label>
                <Input
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(e.target.value)}
                  className="font-mono"
                  data-testid="input-x-min-3d"
                />
              </div>
              <span className="text-muted-foreground mt-5">to</span>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">x =</label>
                <Input
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(e.target.value)}
                  className="font-mono"
                  data-testid="input-x-max-3d"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Y axis (front ↔ back)</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">From y =</label>
                <Input
                  type="number"
                  value={yMin}
                  onChange={(e) => setYMin(e.target.value)}
                  className="font-mono"
                  data-testid="input-y-min-3d"
                />
              </div>
              <span className="text-muted-foreground mt-5">to</span>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">y =</label>
                <Input
                  type="number"
                  value={yMax}
                  onChange={(e) => setYMax(e.target.value)}
                  className="font-mono"
                  data-testid="input-y-max-3d"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-card-border rounded-lg p-6">
        <PlotlyChart
          data={plotData}
          layout={{
            title: { text: '3D Surface', font: { size: 18, color: 'hsl(270, 85%, 60%)' } },
            scene: {
              xaxis: { title: 'X', gridcolor: 'hsl(228, 25%, 20%)', color: 'hsl(210, 100%, 98%)' },
              yaxis: { title: 'Y', gridcolor: 'hsl(228, 25%, 20%)', color: 'hsl(210, 100%, 98%)' },
              zaxis: { title: 'Z (height)', gridcolor: 'hsl(228, 25%, 20%)', color: 'hsl(210, 100%, 98%)' },
              bgcolor: 'hsl(229, 35%, 8%)',
            },
          }}
        />
      </div>
    </motion.div>
  );
}
