import { AngleMode } from '../types/calculator';

// Factorial helper
function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // overflow for JS standard float
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Clean floating point errors (e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3)
export function sanitizeNumber(num: number): string {
  if (Number.isNaN(num)) return 'Error';
  if (!Number.isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

  // Fix precision quirks
  const precisionFixed = parseFloat(num.toPrecision(12));
  
  // If extremely large or tiny, use scientific notation
  if (Math.abs(precisionFixed) >= 1e12 || (Math.abs(precisionFixed) > 0 && Math.abs(precisionFixed) < 1e-9)) {
    return precisionFixed.toExponential(6).replace(/\+/, '');
  }

  // Format with standard locale or clean decimal
  return precisionFixed.toString();
}

/**
 * Format expression for display (turns * into ×, / into ÷, etc.)
 */
export function formatExpressionDisplay(expr: string): string {
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/-/g, '−');
}

/**
 * Parses and evaluates mathematical expressions safely
 */
export function evaluateExpression(expr: string, angleMode: AngleMode = 'DEG'): { result: string; error?: string } {
  if (!expr || expr.trim() === '') {
    return { result: '0' };
  }

  try {
    // Step 1: Pre-process expression tokens
    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/π/g, `(${Math.PI})`)
      .replace(/\be\b/g, `(${Math.E})`);

    // Handle percentage: e.g. 50% -> (50/100), or 200 + 10% -> 200 + (200 * 0.1)
    // First simple substitution: number% -> (number * 0.01)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1 * 0.01)');

    // Handle factorial: 5! -> factorial(5)
    sanitized = sanitized.replace(/(\d+(\.\d+)?)!/g, (_, n) => `${factorial(Number(n))}`);

    // Handle square root: √(9) or √9 -> Math.sqrt(...)
    sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
    sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

    // Handle power: 2^3 -> Math.pow(2, 3)
    // Replace x^y with Math.pow(x, y)
    while (sanitized.includes('^')) {
      const match = sanitized.match(/([a-zA-Z0-9_.]+|\([^()]+\))\^([a-zA-Z0-9_.]+|\([^()]+\))/);
      if (!match) break;
      sanitized = sanitized.replace(match[0], `Math.pow(${match[1]},${match[2]})`);
    }

    // Handle trigonometric functions considering DEG / RAD mode
    // If DEG mode, convert input argument from degrees to radians for sin, cos, tan
    const trigWrapper = (funcName: string, arg: string) => {
      if (angleMode === 'DEG') {
        return `Math.${funcName}((${arg}) * (Math.PI / 180))`;
      }
      return `Math.${funcName}(${arg})`;
    };

    const invTrigWrapper = (funcName: string, arg: string) => {
      if (angleMode === 'DEG') {
        return `(Math.${funcName}(${arg}) * (180 / Math.PI))`;
      }
      return `Math.${funcName}(${arg})`;
    };

    // Replace sin, cos, tan
    sanitized = sanitized.replace(/sin\(([^)]+)\)/g, (_, a) => trigWrapper('sin', a));
    sanitized = sanitized.replace(/cos\(([^)]+)\)/g, (_, a) => trigWrapper('cos', a));
    sanitized = sanitized.replace(/tan\(([^)]+)\)/g, (_, a) => trigWrapper('tan', a));

    // Replace asin, acos, atan
    sanitized = sanitized.replace(/asin\(([^)]+)\)/g, (_, a) => invTrigWrapper('asin', a));
    sanitized = sanitized.replace(/acos\(([^)]+)\)/g, (_, a) => invTrigWrapper('acos', a));
    sanitized = sanitized.replace(/atan\(([^)]+)\)/g, (_, a) => invTrigWrapper('atan', a));

    // Replace logs
    sanitized = sanitized.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
    sanitized = sanitized.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
    sanitized = sanitized.replace(/abs\(([^)]+)\)/g, 'Math.abs($1)');

    // Close any unclosed parentheses gracefully for preview
    const openParens = (sanitized.match(/\(/g) || []).length;
    const closeParens = (sanitized.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      sanitized += ')'.repeat(openParens - closeParens);
    }

    // Validation: only allow safe mathematical characters
    const safeRegex = /^[0-9+\-*/()., Math.PIELOGsqrtpowtrigcosexpanbs]+$/;
    if (!safeRegex.test(sanitized)) {
      return { result: 'Error', error: 'Invalid characters in expression' };
    }

    // Safely execute math function
    const evalFunc = new Function('Math', `return (${sanitized});`);
    const rawVal = evalFunc(Math);

    if (rawVal === undefined || rawVal === null || Number.isNaN(rawVal)) {
      return { result: 'Error', error: 'Undefined calculation' };
    }

    if (!Number.isFinite(rawVal)) {
      return { result: rawVal > 0 ? 'Infinity' : '-Infinity' };
    }

    return { result: sanitizeNumber(rawVal) };
  } catch {
    return { result: 'Error', error: 'Syntax Error' };
  }
}

/**
 * Calculates a live preview while the user types.
 * Returns null if expression is not yet computable or incomplete.
 */
export function getLivePreview(expr: string, angleMode: AngleMode): string | null {
  if (!expr || expr.trim() === '') return null;
  // If the expression ends with an operator, preview without trailing operator
  let trimmed = expr.trim();
  if (/[+\-×*÷/^]$/.test(trimmed)) {
    trimmed = trimmed.slice(0, -1).trim();
  }
  if (!trimmed || /^[+\-×*÷/^]$/.test(trimmed)) return null;

  // Don't preview if it's just a single number
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return null;

  const evalResult = evaluateExpression(trimmed, angleMode);
  if (evalResult.error || evalResult.result === 'Error') {
    return null;
  }
  return evalResult.result;
}
