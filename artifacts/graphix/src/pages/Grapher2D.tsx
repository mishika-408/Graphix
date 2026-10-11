import { useState, useMemo } from 'react';
import { PlotlyChart } from '@/components/PlotlyChart';
import { EquationInput } from '@/components/EquationInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { evaluate2D, validate2D } from '@/lib/math-utils';
import { MathConcepts } from '@/components/MathConcepts';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Equation {
  id: string;
  expression: string;
  color: string;
}

const COLORS = [
  'hsl(190, 100%, 50%)',
  'hsl(270, 85%, 60%)',
  'hsl(15, 100%, 60%)',
  'hsl(50, 100%, 55%)',
  'hsl(330, 85%, 55%)',
];

const EXAMPLES = [
  { label: 'Straight line', expr: '2*x + 1' },
  { label: 'Parabola', expr: 'x^2' },
  { label: 'Sine wave', expr: 'sin(x)' },
  { label: 'Cosine wave', expr: 'cos(x)' },
  { label: 'Cubic', expr: 'x^3 - x' },
  { label: 'Square root', expr: 'sqrt(x)' },
  { label: 'Absolute value', expr: 'abs(x)' },
  { label: 'Upside-down parabola', expr: '-x^2 + 4' },
];

export default function Grapher2D() {
  const [equations, setEquations] = useState<Equation[]>([
    { id: '1', expression: 'sin(x)', color: COLORS[0] },
    { id: '2', expression: 'x^2 - 2', color: COLORS[1] },
    { id: '3', expression: 'cos(x) * 2', color: COLORS[2] },
  ]);

  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');

  const addEquation = () => {
    const newId = Date.now().toString();
    const colorIndex = equations.length % COLORS.length;
    setEquations([
      ...equations,
      { id: newId, expression: '', color: COLORS[colorIndex] },
    ]);
  };

  const removeEquation = (id: string) => {
    setEquations(equations.filter((eq) => eq.id !== id));
  };

  const updateEquation = (id: string, expression: string) => {
    setEquations(
      equations.map((eq) => (eq.id === id ? { ...eq, expression } : eq))
    );
  };

  const addExample = (expr: string) => {
    const newId = Date.now().toString();
    const colorIndex = equations.length % COLORS.length;
    setEquations([
      ...equations,
      { id: newId, expression: expr, color: COLORS[colorIndex] },
    ]);
  };

  const xMinNum = parseFloat(xMin) || -10;
  const xMaxNum = parseFloat(xMax) || 10;

  const plotData = useMemo(() => {
    return equations
      .filter((eq) => eq.expression.trim())
      .map((eq) => {
        try {
          const points = evaluate2D(eq.expression, xMinNum, xMaxNum);
          return {
            x: points.map((p) => p.x),
            y: points.map((p) => p.y),
            type: 'scatter' as const,
            mode: 'lines' as const,
            name: eq.expression,
            line: { color: eq.color, width: 2.5 },
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Plotly.Data[];
  }, [equations, xMinNum, xMaxNum]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 h-full"
    >
      {/* Controls */}
      <div className="space-y-4">

        {/* What to type */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-2">
          <h2 className="text-base font-semibold text-primary">How to type math</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground font-mono">
            <span>x squared → <span className="text-foreground">x^2</span></span>
            <span>x cubed → <span className="text-foreground">x^3</span></span>
            <span>2 times x → <span className="text-foreground">2*x</span></span>
            <span>square root → <span className="text-foreground">sqrt(x)</span></span>
            <span>sine → <span className="text-foreground">sin(x)</span></span>
            <span>cosine → <span className="text-foreground">cos(x)</span></span>
          </div>
        </div>

        {/* Quick examples */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <h2 className="text-base font-semibold text-primary">Quick examples — click to add</h2>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.expr}
                onClick={() => addExample(ex.expr)}
                className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground transition-colors border border-border"
                data-testid={`button-example-${ex.label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Equations */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-primary">Your equations</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Type a math expression using x. Each line gets its own color on the graph.</p>
          </div>
          <div className="space-y-2">
            {equations.map((eq, idx) => (
              <div key={eq.id} className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-4 text-right shrink-0 mt-2.5">{idx + 1}</span>
                <EquationInput
                  value={eq.expression}
                  onChange={(value) => updateEquation(eq.id, value)}
                  placeholder="e.g. x^2 or sin(x)"
                  color={eq.color}
                  error={eq.expression.trim() ? validate2D(eq.expression) : null}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEquation(eq.id)}
                  disabled={equations.length === 1}
                  className="flex-shrink-0 h-8 w-8 mt-0.5"
                  data-testid={`button-remove-equation-${eq.id}`}
                  title="Remove this equation"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={addEquation}
            variant="outline"
            className="w-full"
            data-testid="button-add-equation"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another equation
          </Button>
        </div>

        {/* Math Concepts */}
        <MathConcepts title="What do these words mean?" concepts={[
          {
            term: 'Graph',
            emoji: '📈',
            short: 'a picture of a math rule',
            detail: 'A graph is a visual way to show how two numbers relate. The horizontal line is called the x-axis (left ↔ right) and the vertical line is the y-axis (up ↓ down). Every point on the curve follows your equation.',
            example: 'For y = 2*x, when x is 3, y is 6. So the point (3, 6) is on the graph.',
          },
          {
            term: 'x',
            emoji: '🔢',
            short: 'the input number',
            detail: 'x is the number you "put in". The graph tries every possible value of x from left to right and works out y for each one. Together they draw the curve.',
            example: 'In y = x^2, if x = 4 then y = 16. If x = -4 then y is also 16 — that\'s why a parabola is symmetric!',
          },
          {
            term: 'Parabola',
            emoji: '∪',
            short: 'the U-shaped curve from x²',
            detail: 'Any equation with x² (x squared) makes a parabola — a smooth U shape. It opens upward if the number in front of x² is positive, downward if negative.',
            example: 'x^2 opens up. -x^2 flips it upside down. x^2 + 3 shifts it up. x^2 - 3 shifts it down.',
          },
          {
            term: 'Sine & Cosine',
            emoji: '〰️',
            short: 'smooth repeating waves',
            detail: 'sin(x) and cos(x) are wave functions — they go up and down forever in a smooth, repeating pattern. They come from circles and appear everywhere in nature: sound waves, light, tides, and music.',
            example: 'sin(x) starts at 0, rises to 1, falls back to -1, and repeats. cos(x) is the same wave but starts at 1 instead.',
          },
          {
            term: 'Straight line',
            emoji: '📏',
            short: 'y = mx + b',
            detail: 'A straight line equation has the form y = m*x + b. The number m controls the steepness (slope) — bigger m means steeper. The number b controls where it crosses the y-axis.',
            example: 'y = 2*x + 1: rises steeply. y = 0.5*x - 3: rises gently and starts lower.',
          },
          {
            term: 'Absolute value',
            emoji: '| |',
            short: 'always the positive version',
            detail: 'abs(x) means "how far from zero" — it strips the minus sign. So abs(-5) = 5 and abs(5) = 5. Its graph makes a V shape.',
            example: 'abs(x) looks like a V with the point at (0, 0). abs(x - 2) shifts the V to the right.',
          },
        ]} />

        {/* X Range */}
        <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-primary">Zoom level</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Show the graph from x = ___ to x = ___</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">From x =</label>
              <Input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(e.target.value)}
                className="font-mono"
                data-testid="input-x-min"
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
                data-testid="input-x-max"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">You can also zoom and pan directly on the graph using your mouse or fingers.</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-card-border rounded-lg p-6">
        <PlotlyChart
          data={plotData}
          layout={{
            title: { text: '2D Graph', font: { size: 18, color: 'hsl(190, 100%, 50%)' } },
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
          }}
        />
      </div>
    </motion.div>
  );
}
