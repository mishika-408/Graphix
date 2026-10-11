import * as math from 'mathjs';

// ─── Validation ───────────────────────────────────────────────────────────────

/** Returns an error message string if invalid, or null if valid. */
export function validate2D(expression: string): string | null {
  if (!expression.trim()) return null; // empty is fine (just skip plotting)

  // Detect use of y (or z) — those belong in the 3D grapher
  const usesY = /\by\b/.test(expression);
  const usesZ = /\bz\b/.test(expression);
  if (usesY || usesZ) {
    return 'This equation uses ' + (usesY ? 'y' : 'z') + ' — the 2D grapher only knows x. Switch to the 3D tab instead!';
  }

  try {
    const result = math.evaluate(expression, { x: 1 });
    if (typeof result !== 'number' || !isFinite(result)) {
      // try a few more points in case x=1 is a discontinuity
      math.evaluate(expression, { x: 0 });
      math.evaluate(expression, { x: -1 });
    }
    return null;
  } catch {
    return 'Invalid expression — check for typos (use * for multiply, ^ for powers)';
  }
}

export function validate3D(expression: string): string | null {
  if (!expression.trim()) return null;
  try {
    math.evaluate(expression, { x: 1, y: 1 });
    return null;
  } catch {
    return 'Invalid expression — use x and y as variables (e.g. sin(x)*cos(y))';
  }
}

export function validateSolverEquation(equation: string): string | null {
  if (!equation.trim()) return null;
  if (!equation.includes('=')) return 'Missing = sign — write it like: x^2 = 9';
  const parts = equation.split('=');
  if (parts.length !== 2) return 'Too many = signs — use exactly one';
  try {
    const lhs = parts[0].trim();
    const rhs = parts[1].trim();
    if (!lhs) return 'Nothing on the left side of =';
    if (!rhs) return 'Nothing on the right side of =';
    math.parse(lhs);
    math.parse(rhs);
    return null;
  } catch {
    return 'Invalid equation — check for typos (use * for multiply, ^ for powers)';
  }
}

export interface Point2D {
  x: number;
  y: number | null;
}

export interface Point3D {
  x: number[];
  y: number[];
  z: (number | null)[][];
}

/**
 * Evaluate a 2D expression (y = f(x)) over a range of x values
 */
export function evaluate2D(
  expression: string,
  xMin: number,
  xMax: number,
  numPoints = 200
): Point2D[] {
  const points: Point2D[] = [];
  const step = (xMax - xMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const x = xMin + i * step;
    try {
      const y = math.evaluate(expression, { x });
      points.push({ x, y: isFinite(y) ? y : null });
    } catch {
      points.push({ x, y: null });
    }
  }

  return points;
}

/**
 * Evaluate a 3D expression (z = f(x, y)) over a grid
 */
export function evaluate3D(
  expression: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  numPoints = 50
): Point3D {
  const xValues: number[] = [];
  const yValues: number[] = [];
  const zValues: (number | null)[][] = [];

  const xStep = (xMax - xMin) / (numPoints - 1);
  const yStep = (yMax - yMin) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    xValues.push(xMin + i * xStep);
    yValues.push(yMin + i * yStep);
  }

  for (let i = 0; i < numPoints; i++) {
    const row: (number | null)[] = [];
    for (let j = 0; j < numPoints; j++) {
      try {
        const z = math.evaluate(expression, { x: xValues[j], y: yValues[i] });
        row.push(isFinite(z) ? z : null);
      } catch {
        row.push(null);
      }
    }
    zValues.push(row);
  }

  return { x: xValues, y: yValues, z: zValues };
}

/**
 * Solve an equation numerically using interval scanning + bisection
 */
export function solveEquation(
  equation: string,
  variable: string = 'x'
): number[] {
  // Parse equation into LHS - RHS
  const parts = equation.split('=');
  if (parts.length !== 2) {
    throw new Error('Equation must contain exactly one "=" sign');
  }

  const lhs = parts[0].trim();
  const rhs = parts[1].trim();
  const expr = `(${lhs}) - (${rhs})`;

  const roots: number[] = [];
  const scanMin = -100;
  const scanMax = 100;
  const scanStep = 0.5;
  const tolerance = 1e-6;
  const maxIterations = 50;

  // Scan for sign changes
  let prevX = scanMin;
  let prevY: number;
  try {
    prevY = math.evaluate(expr, { [variable]: prevX });
  } catch {
    prevY = NaN;
  }

  for (let x = scanMin + scanStep; x <= scanMax; x += scanStep) {
    let y: number;
    try {
      y = math.evaluate(expr, { [variable]: x });
    } catch {
      prevX = x;
      prevY = NaN;
      continue;
    }

    if (isFinite(y)) {
      // Direct hit: value is essentially zero at this scan point
      if (Math.abs(y) < tolerance) {
        roots.push(x);
      } else if (isFinite(prevY) && prevY * y < 0) {
        // Sign change detected — bisect to find the exact root
        let a = prevX;
        let b = x;
        let mid = (a + b) / 2;

        for (let iter = 0; iter < maxIterations; iter++) {
          mid = (a + b) / 2;
          const fMid = math.evaluate(expr, { [variable]: mid });

          if (Math.abs(fMid) < tolerance || Math.abs(b - a) < tolerance) {
            break;
          }

          const fA = math.evaluate(expr, { [variable]: a });
          if (fA * fMid < 0) {
            b = mid;
          } else {
            a = mid;
          }
        }

        roots.push(mid);
      }
    }

    prevX = x;
    prevY = y;
  }

  // Deduplicate roots that are very close
  const uniqueRoots: number[] = [];
  for (const root of roots) {
    if (!uniqueRoots.some((r) => Math.abs(r - root) < 0.1)) {
      uniqueRoots.push(root);
    }
  }

  return uniqueRoots.sort((a, b) => a - b);
}

/**
 * Simplify an expression
 */
export function simplifyExpression(expression: string): string {
  try {
    return math.simplify(expression).toString();
  } catch (error) {
    throw new Error(`Failed to simplify: ${(error as Error).message}`);
  }
}

/**
 * Differentiate an expression with respect to a variable
 */
export function differentiate(expression: string, variable: string): string {
  try {
    return math.derivative(expression, variable).toString();
  } catch (error) {
    throw new Error(`Failed to differentiate: ${(error as Error).message}`);
  }
}

/**
 * Evaluate an expression at a specific point
 */
export function evaluateAt(
  expression: string,
  variable: string,
  value: number
): number {
  try {
    return math.evaluate(expression, { [variable]: value });
  } catch (error) {
    throw new Error(`Failed to evaluate: ${(error as Error).message}`);
  }
}
