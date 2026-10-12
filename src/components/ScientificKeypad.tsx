import React from 'react';
import { AngleMode } from '../types/calculator';

interface Props {
  onInsert: (token: string) => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  theme?: 'light' | 'dark';
}

export const ScientificKeypad: React.FC<Props> = ({
  onInsert,
  angleMode,
  onToggleAngleMode,
  theme = 'light',
}) => {
  const [invMode, setInvMode] = React.useState(false);
  const isDark = theme === 'dark';

  const keyBase =
    'relative flex items-center justify-center rounded-2xl sm:rounded-3xl font-medium text-xs sm:text-sm transition-all duration-100 active:scale-95 cursor-pointer shadow-sm select-none h-11 sm:h-12';
  
  const sciKeyStyle = isDark
    ? `${keyBase} bg-slate-800/80 hover:bg-slate-700/80 text-blue-300 hover:text-white border border-slate-700/40`
    : `${keyBase} bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.03)]`;

  return (
    <div
      className={`grid grid-cols-5 gap-1.5 sm:gap-2 w-full p-1.5 rounded-2xl sm:rounded-3xl border transition-colors ${
        isDark
          ? 'bg-slate-900/60 border-slate-800/60'
          : 'bg-slate-100/80 border-slate-200/90'
      }`}
    >
      {/* Row 1 */}
      <button
        onClick={onToggleAngleMode}
        className={`${keyBase} ${
          isDark
            ? 'bg-slate-800 text-blue-400 border-blue-500/30'
            : 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
        } border text-xs`}
        title="Toggle Angle Unit"
      >
        {angleMode}
      </button>

      <button
        onClick={() => setInvMode(!invMode)}
        className={`${keyBase} ${
          invMode
            ? 'bg-blue-600 text-white font-semibold'
            : isDark
            ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border-slate-700/40'
            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/90'
        } border text-xs`}
        title="Inverse Functions"
      >
        INV
      </button>

      <button
        onClick={() => onInsert(invMode ? 'asin(' : 'sin(')}
        className={sciKeyStyle}
      >
        {invMode ? 'sin⁻¹' : 'sin'}
      </button>

      <button
        onClick={() => onInsert(invMode ? 'acos(' : 'cos(')}
        className={sciKeyStyle}
      >
        {invMode ? 'cos⁻¹' : 'cos'}
      </button>

      <button
        onClick={() => onInsert(invMode ? 'atan(' : 'tan(')}
        className={sciKeyStyle}
      >
        {invMode ? 'tan⁻¹' : 'tan'}
      </button>

      {/* Row 2 */}
      <button onClick={() => onInsert('ln(')} className={sciKeyStyle}>
        ln
      </button>

      <button onClick={() => onInsert('log(')} className={sciKeyStyle}>
        log
      </button>

      <button onClick={() => onInsert('! ')} className={sciKeyStyle} title="Factorial">
        x!
      </button>

      <button onClick={() => onInsert('^')} className={sciKeyStyle} title="Power">
        xʸ
      </button>

      <button onClick={() => onInsert('√(')} className={sciKeyStyle} title="Square Root">
        √
      </button>

      {/* Row 3 */}
      <button onClick={() => onInsert('π')} className={sciKeyStyle} title="Pi (3.14159...)">
        π
      </button>

      <button onClick={() => onInsert('e')} className={sciKeyStyle} title="Euler's e (2.71828...)">
        e
      </button>

      <button onClick={() => onInsert('^2')} className={sciKeyStyle} title="Square">
        x²
      </button>

      <button onClick={() => onInsert('abs(')} className={sciKeyStyle} title="Absolute Value">
        |x|
      </button>

      <button onClick={() => onInsert('(1/')} className={sciKeyStyle} title="Reciprocal">
        1/x
      </button>
    </div>
  );
};
