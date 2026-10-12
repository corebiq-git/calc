import React from 'react';
import { SoundType } from '../utils/audioFeedback';

interface Props {
  onInputDigit: (digit: string) => void;
  onInputOperator: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onCalculate: () => void;
  onPlaySound: (type: SoundType) => void;
  hasCalculated: boolean;
  theme?: 'light' | 'dark';
}

export const Keypad: React.FC<Props> = ({
  onInputDigit,
  onInputOperator,
  onClear,
  onBackspace,
  onCalculate,
  onPlaySound,
  hasCalculated,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  const handleDigit = (digit: string) => {
    onPlaySound('digit');
    onInputDigit(digit);
  };

  const handleOp = (op: string) => {
    onPlaySound('operator');
    onInputOperator(op);
  };

  const handleClear = () => {
    onPlaySound('clear');
    onClear();
  };

  const handleCalc = () => {
    onPlaySound('equals');
    onCalculate();
  };

  // Base button style: Material 3 rounded squircle / pill
  const btnBase =
    'relative flex items-center justify-center font-medium transition-all duration-100 active:scale-95 cursor-pointer shadow-sm select-none h-14 sm:h-16 rounded-2xl sm:rounded-3xl text-xl sm:text-2xl';

  // Number key style
  const numStyle = isDark
    ? `${btnBase} bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-normal border border-slate-700/40`
    : `${btnBase} bg-white hover:bg-slate-50 text-slate-800 font-normal border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.06)]`;

  // Secondary operator / parenthesis style
  const funcStyle = isDark
    ? `${btnBase} bg-slate-800/60 hover:bg-slate-700/60 text-blue-400 font-semibold border border-slate-700/40 text-lg sm:text-xl`
    : `${btnBase} bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 font-semibold border border-slate-200/90 text-lg sm:text-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]`;

  // Main operator keys (Google vibrant Blue)
  const opStyle = isDark
    ? `${btnBase} bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 font-semibold border border-blue-500/30 text-2xl`
    : `${btnBase} bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-semibold border border-blue-200/80 text-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]`;

  // Clear key (Google Coral Red)
  const clearStyle = isDark
    ? `${btnBase} bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 font-bold border border-red-500/30 text-lg sm:text-xl`
    : `${btnBase} bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold border border-red-200/80 text-lg sm:text-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)]`;

  // Equals key (Google Emerald Green with elevation)
  const equalsStyle = `${btnBase} bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-3xl shadow-lg shadow-emerald-600/25`;

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
      {/* Row 1: AC, ( ), %, ÷ */}
      <button
        onClick={handleClear}
        className={clearStyle}
        title="All Clear (AC)"
        aria-label="All Clear"
      >
        {hasCalculated ? 'AC' : 'C'}
      </button>

      <button
        onClick={() => handleOp('(')}
        className={funcStyle}
        aria-label="Open parenthesis"
      >
        (
      </button>

      <button
        onClick={() => handleOp(')')}
        className={funcStyle}
        aria-label="Close parenthesis"
      >
        )
      </button>

      <button
        onClick={() => handleOp('÷')}
        className={opStyle}
        aria-label="Divide"
      >
        ÷
      </button>

      {/* Row 2: 7, 8, 9, × */}
      <button onClick={() => handleDigit('7')} className={numStyle}>
        7
      </button>
      <button onClick={() => handleDigit('8')} className={numStyle}>
        8
      </button>
      <button onClick={() => handleDigit('9')} className={numStyle}>
        9
      </button>
      <button
        onClick={() => handleOp('×')}
        className={opStyle}
        aria-label="Multiply"
      >
        ×
      </button>

      {/* Row 3: 4, 5, 6, − */}
      <button onClick={() => handleDigit('4')} className={numStyle}>
        4
      </button>
      <button onClick={() => handleDigit('5')} className={numStyle}>
        5
      </button>
      <button onClick={() => handleDigit('6')} className={numStyle}>
        6
      </button>
      <button
        onClick={() => handleOp('−')}
        className={opStyle}
        aria-label="Subtract"
      >
        −
      </button>

      {/* Row 4: 1, 2, 3, + */}
      <button onClick={() => handleDigit('1')} className={numStyle}>
        1
      </button>
      <button onClick={() => handleDigit('2')} className={numStyle}>
        2
      </button>
      <button onClick={() => handleDigit('3')} className={numStyle}>
        3
      </button>
      <button
        onClick={() => handleOp('+')}
        className={opStyle}
        aria-label="Add"
      >
        +
      </button>

      {/* Row 5: 0, ., %, = */}
      <button onClick={() => handleDigit('0')} className={numStyle}>
        0
      </button>
      <button onClick={() => handleDigit('.')} className={numStyle}>
        .
      </button>
      <button
        onClick={() => handleOp('%')}
        className={funcStyle}
        aria-label="Percent"
      >
        %
      </button>
      <button
        onClick={handleCalc}
        className={equalsStyle}
        aria-label="Equals"
      >
        =
      </button>
    </div>
  );
};
