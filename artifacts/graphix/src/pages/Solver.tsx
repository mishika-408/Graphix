import { useState } from 'react';
import { EquationInput } from '@/components/EquationInput';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { solveEquation, simplifyExpression, differentiate, evaluateAt, validateSolverEquation } from '@/lib/math-utils';
import { MathConcepts } from '@/components/MathConcepts';
import { Calculator, Zap, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const EXAMPLES = [
  { label: 'Simple linear', expr: '2*x + 4 = 10' },
  { label: 'Quadratic', expr: 'x^2 - 5*x + 6 = 0' },
  { label: 'Two solutions', expr: 'x^2 = 9' },
  { label: 'Cubic', expr: 'x^3 - x = 0' },
];

const ACTIONS = [
  {
    key: 'solve',
    label: 'Find x',
    sublabel: 'What value of x makes this true?',
    icon: Target,
    colorClass: 'bg-primary text-primary-foreground hover:bg-primary/90',
  },
  {
    key: 'simplify',
    label: 'Simplify',
    sublabel: 'Rewrite in a shorter form',
    icon: Zap,
    colorClass: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
  },
  {
    key: 'derivative',
    label: 'Slope formula',
    sublabel: 'How fast is it changing? (calculus)',
    icon: TrendingUp,
    colorClass: 'bg-accent text-accent-foreground hover:bg-accent/90',
  },
  {
    key: 'evaluate',
    label: 'Calculate',
    sublabel: 'Plug in a number for x',
    icon: Calculator,
    colorClass: 'bg-muted text-foreground hover:bg-muted/70 border border-border',
  },
];

export default function Solver() {
  const [equation, setEquation] = useState('x^2 - 5*x + 6 = 0');
  const [variable, setVariable] = useState('x');
  const [evalValue, setEvalValue] = useState('');
  const [results, setResults] = useState<{
    type: 'solve' | 'simplify' | 'derivative' | 'evaluate';
    data: string | number[];
  } | null>(null);
  const [error, setError] = useState('');

  const handleSolve = () => {
    setError('');
    try {
      const roots = solveEquation(equation, variable);
      setResults({ type: 'solve', data: roots });
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    }
  };

  const handleSimplify = () => {
    setError('');
    try {
      const parts = equation.split('=');
      const lhs = parts[0].trim();
      const rhs = parts.length > 1 ? parts[1].trim() : '0';
      const expr = `(${lhs}) - (${rhs})`;
      const simplified = simplifyExpression(expr);
      setResults({ type: 'simplify', data: simplified });
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    }
  };

  const handleDerivative = () => {
    setError('');
    try {
      const parts = equation.split('=');
      const lhs = parts[0].trim();
      const rhs = parts.length > 1 ? parts[1].trim() : '0';
      const expr = `(${lhs}) - (${rhs})`;
      const derivative = differentiate(expr, variable);
      setResults({ type: 'derivative', data: derivative });
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    }
  };

  const handleEvaluate = () => {
    setError('');
    if (!evalValue.trim()) {
      setError('Enter a number in the "Calculate when x =" box below first.');
      return;
    }
    try {
      const parts = equation.split('=');
      const lhs = parts[0].trim();
      const rhs = parts.length > 1 ? parts[1].trim() : '0';
      const expr = `(${lhs}) - (${rhs})`;
      const result = evaluateAt(expr, variable, Number(evalValue));
      setResults({ type: 'evaluate', data: String(result) });
    } catch (err) {
      setError((err as Error).message);
      setResults(null);
    }
  };

  const handleAction = (key: string) => {
    if (key === 'solve') handleSolve();
    else if (key === 'simplify') handleSimplify();
    else if (key === 'derivative') handleDerivative();
    else if (key === 'evaluate') handleEvaluate();
  };

  const resultLabels: Record<string, string> = {
    solve: 'Solution(s)',
    simplify: 'Simplified form',
    derivative: 'Slope formula (derivative)',
    evaluate: 'Result',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-5"
    >
      {/* How to use */}
      <div className="bg-card border border-card-border rounded-lg p-4 space-y-2">
        <h2 className="text-base font-semibold text-accent">How to use the Solver</h2>
        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
          <li>Type an equation in the box below — include an <span className="font-mono text-foreground">=</span> sign, like <span className="font-mono text-foreground">x^2 = 9</span>.</li>
          <li>Pick what you want to do from the four buttons.</li>
          <li>For <strong className="text-foreground">Calculate</strong>, also fill in the "when x =" box.</li>
        </ol>
      </div>

      {/* Quick examples */}
      <div className="bg-card border border-card-border rounded-lg p-4 space-y-3">
        <h2 className="text-base font-semibold text-accent">Try an example</h2>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.expr}
              onClick={() => { setEquation(ex.expr); setResults(null); setError(''); }}
              className="px-3 py-1.5 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground transition-colors border border-border font-mono"
              data-testid={`button-example-${ex.label.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {ex.expr}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-card border border-card-border rounded-lg p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-accent">Your equation</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Make sure to include an = sign. Use <span className="font-mono">^</span> for powers and <span className="font-mono">*</span> for multiply.</p>
        </div>
        <EquationInput
          value={equation}
          onChange={(v) => { setEquation(v); setResults(null); setError(''); }}
          placeholder="e.g. x^2 - 5*x + 6 = 0"
          color="hsl(15, 100%, 60%)"
          error={equation.trim() ? validateSolverEquation(equation) : null}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Solve for which letter?</label>
            <Input
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              placeholder="x"
              className="font-mono"
              data-testid="input-variable"
            />
            <p className="text-xs text-muted-foreground">Usually x — change if your equation uses a different letter.</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Calculate when x =</label>
            <Input
              type="number"
              value={evalValue}
              onChange={(e) => setEvalValue(e.target.value)}
              placeholder="e.g. 3"
              className="font-mono"
              data-testid="input-eval-value"
            />
            <p className="text-xs text-muted-foreground">Only needed for the Calculate button.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            onClick={() => handleAction(action.key)}
            className={`rounded-lg p-4 flex flex-col items-center gap-1.5 transition-opacity hover:opacity-90 active:scale-95 ${action.colorClass}`}
            data-testid={`button-${action.key}`}
          >
            <action.icon className="h-5 w-5" />
            <span className="font-semibold text-sm">{action.label}</span>
            <span className="text-xs opacity-75 text-center leading-tight">{action.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm" data-testid="text-error">
          {error}
        </div>
      )}

      {/* Results */}
      {results && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-lg p-6 space-y-3"
        >
          <h3 className="text-base font-semibold text-foreground">{resultLabels[results.type]}</h3>

          {results.type === 'solve' && Array.isArray(results.data) && (
            <div className="space-y-2">
              {results.data.length === 0 ? (
                <p className="text-muted-foreground">No solutions found.</p>
              ) : (
                results.data.map((root, i) => (
                  <div
                    key={i}
                    className="bg-background/50 rounded-lg p-4 border border-primary/20 flex items-baseline gap-2"
                    data-testid={`text-solution-${i}`}
                  >
                    <span className="text-sm text-muted-foreground">{variable} =</span>
                    <span className="text-3xl font-bold font-mono text-primary glow-text">
                      {root.toPrecision(6)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {(results.type === 'simplify' || results.type === 'derivative' || results.type === 'evaluate') && (
            <div className="bg-background/50 rounded-lg p-5 border border-primary/20">
              <p className="text-2xl font-bold font-mono text-primary glow-text break-all" data-testid="text-result">
                {results.data as string}
              </p>
              {results.type === 'derivative' && (
                <p className="text-xs text-muted-foreground mt-2">This tells you how steeply the curve rises or falls at any point.</p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Math Concepts */}
      <MathConcepts title="What do these words mean?" concepts={[
        {
          term: 'Equation',
          emoji: '⚖️',
          short: 'a math statement with an = sign',
          detail: 'An equation says that two things are equal. Your job is to find the value of x that makes both sides balance — like a scale.',
          example: 'x + 3 = 7 — what number plus 3 equals 7? Answer: x = 4.',
        },
        {
          term: 'Variable',
          emoji: '🔤',
          short: 'a letter standing for an unknown number',
          detail: 'A variable (usually x) is a placeholder for a number you don\'t know yet. Solving the equation means figuring out what number x must be.',
          example: 'In 2*x = 10, x is the variable. Dividing both sides by 2 gives x = 5.',
        },
        {
          term: 'Solution',
          emoji: '✅',
          short: 'the value(s) of x that make the equation true',
          detail: 'A solution is the number you can substitute for x to make both sides of the equation equal. Some equations have one solution, some have two, and some have none.',
          example: 'x^2 = 9 has two solutions: x = 3 and x = -3, because both 3² and (-3)² equal 9.',
        },
        {
          term: 'Simplify',
          emoji: '✂️',
          short: 'rewrite in a shorter, cleaner form',
          detail: 'Simplifying means rewriting a math expression so it says the same thing with fewer steps or terms. It doesn\'t change the answer — just the appearance.',
          example: '2*x + 3*x simplifies to 5*x. x^2 - 9 simplifies to (x-3)*(x+3).',
        },
        {
          term: 'Slope formula (Derivative)',
          emoji: '📐',
          short: 'how steeply the curve rises or falls',
          detail: 'The derivative (slope formula) tells you how fast y is changing at any point on the curve. A steep hill has a big derivative; a flat section has a derivative near zero. This is the core idea of calculus.',
          example: 'For x^2, the derivative is 2*x. At x = 3, the slope is 6 (steep). At x = 0, the slope is 0 (flat — that\'s the bottom of the parabola).',
        },
        {
          term: 'Calculate (Evaluate)',
          emoji: '🔢',
          short: 'plug a number in and get the answer',
          detail: 'Evaluating means replacing x with a specific number and computing the result. It\'s like pressing "play" at one particular moment.',
          example: 'If your expression is x^2 + 1 and you evaluate at x = 4, the answer is 4² + 1 = 17.',
        },
      ]} />

      {/* Cheat sheet */}
      <div className="bg-card border border-card-border rounded-lg p-4 space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Math cheat sheet</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm font-mono text-muted-foreground">
          <span>x² → <span className="text-foreground">x^2</span></span>
          <span>2×x → <span className="text-foreground">2*x</span></span>
          <span>√x → <span className="text-foreground">sqrt(x)</span></span>
          <span>|x| → <span className="text-foreground">abs(x)</span></span>
          <span>sin → <span className="text-foreground">sin(x)</span></span>
          <span>cos → <span className="text-foreground">cos(x)</span></span>
        </div>
      </div>
    </motion.div>
  );
}
