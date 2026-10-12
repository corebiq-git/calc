import React, { useState } from 'react';
import { Copy, Check, Delete } from 'lucide-react';
import { AngleMode } from '../types/calculator';
import { formatExpressionDisplay } from '../utils/mathEngine';

interface Props {
  expression: string;
  result: string;
  livePreview: string | null;
  hasCalculated: boolean;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  showAngleToggle?: boolean;
  hasMemory: boolean;
  onBackspace: () => void;
  theme?: 'light' | 'dark';
}

export const Display: React.FC<Props> = ({
  expression,
  result,
  livePreview,
  hasCalculated,
  angleMode,
  onToggleAngleMode,
  showAngleToggle = true,
  hasMemory,
  onBackspace,
  theme = 'light',
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const handleCopy = (text: string) => {
    if (!text || text === '0') return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  // Determine dynamic font size based on length
  const displayLength = hasCalculated ? result.length : (expression.length || 1);
  let fontSizeClass = 'text-4xl sm:text-5xl';
  if (displayLength > 16) {
    fontSizeClass = 'text-2xl sm:text-3xl';
  } else if (displayLength > 10) {
    fontSizeClass = 'text-3xl sm:text-4xl';
  }

  return (
    <div
      className={`relative w-full px-5 py-4 flex flex-col justify-end rounded-2xl sm:rounded-3xl border shadow-inner select-text min-h-[140px] sm:min-h-[160px] overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-gradient-to-b from-slate-900/60 to-slate-950/90 border-slate-800/80 shadow-slate-950/50'
          : 'bg-gradient-to-b from-slate-50/90 to-white border-slate-200/90 shadow-slate-200/40'
      }`}
    >
      {/* Top Meta Bar (DEG/RAD pill, Memory flag, Copy button) */}
      <div className="flex items-center justify-between text-xs mb-2 select-none">
        <div className="flex items-center gap-2">
          {showAngleToggle && (
            <button
              onClick={onToggleAngleMode}
              className={`px-2.5 py-1 rounded-full font-medium text-[11px] tracking-wide transition active:scale-95 cursor-pointer border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-200/70 hover:bg-slate-300/70 text-slate-700 border-slate-300/60'
              }`}
              title="Toggle DEG / RAD"
            >
              {angleMode}
            </button>
          )}

          {hasMemory && (
            <span
              className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${
                isDark
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              M
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {expression.length > 0 && (
            <button
              onClick={onBackspace}
              title="Backspace"
              className={`p-1 rounded-lg active:scale-90 transition cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Delete className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleCopy(hasCalculated ? result : expression)}
            title="Copy value"
            className={`flex items-center gap-1 px-2 py-1 rounded-lg active:scale-95 transition cursor-pointer text-[11px] ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-medium">Copied</span>
              </>
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Secondary Line: Previous Expression or Live Preview */}
      <div
        className={`min-h-[24px] text-right text-sm sm:text-base font-normal tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}
      >
        {hasCalculated ? (
          <span>{formatExpressionDisplay(expression)} =</span>
        ) : livePreview ? (
          <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            = {livePreview}
          </span>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>

      {/* Primary Line: Main Expression or Final Result */}
      <div
        className={`w-full text-right font-semibold tracking-tight ${fontSizeClass} overflow-x-auto whitespace-nowrap scrollbar-none transition-all duration-150 pt-1 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}
      >
        {hasCalculated ? (
          <span>{result}</span>
        ) : expression ? (
          <span>{formatExpressionDisplay(expression)}</span>
        ) : (
          <span className={isDark ? 'text-slate-500 font-light' : 'text-slate-400 font-light'}>
            0
          </span>
        )}
      </div>
    </div>
  );
};
