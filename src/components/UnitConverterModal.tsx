import React, { useState } from 'react';
import { ArrowUpDown, Copy, Check, X, RotateCcw } from 'lucide-react';
import { UnitCategory } from '../types/calculator';
import { UNIT_CATEGORIES, UNITS_DATA, convertUnit } from '../utils/unitConverter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const UnitConverterModal: React.FC<Props> = ({ isOpen, onClose, theme = 'light' }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<string>('1');
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const currentUnits = UNITS_DATA[category] || [];

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const units = UNITS_DATA[newCat];
    if (units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    } else if (units.length === 1) {
      setFromUnit(units[0].id);
      setToUnit(units[0].id);
    }
  };

  const numVal = parseFloat(inputValue) || 0;
  const convertedVal = convertUnit(category, fromUnit, toUnit, numVal);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${convertedVal}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 animate-fade-in">
      <div
        className={`relative w-full max-w-lg rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[92vh] border transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 shrink-0 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h2 className="text-lg font-bold">Google Unit Converter</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills (Horizontal scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none shrink-0">
          {UNIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                category === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Converter Cards Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* FROM Unit Box */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2 ${
              isDark
                ? 'bg-slate-950/70 border-slate-800'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                From
              </span>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className={`text-xs font-medium rounded-lg px-2.5 py-1 border focus:outline-none focus:border-blue-500 cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight focus:outline-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
              placeholder="0"
            />
          </div>

          {/* Swap Button Divider */}
          <div className="flex justify-center -my-1 relative z-10">
            <button
              onClick={handleSwap}
              title="Swap units"
              className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition cursor-pointer border border-blue-400/30"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* TO Unit Box */}
          <div
            className={`p-4 rounded-2xl border flex flex-col gap-2 ${
              isDark
                ? 'bg-slate-950/70 border-slate-800'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                To
              </span>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className={`text-xs font-medium rounded-lg px-2.5 py-1 border focus:outline-none focus:border-blue-500 cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-white text-slate-800 border-slate-300'
                }`}
              >
                {currentUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div
                className={`text-2xl sm:text-3xl font-bold tracking-tight truncate ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}
              >
                {convertedVal}
              </div>
              <button
                onClick={handleCopy}
                title="Copy result"
                className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Value Presets */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className={`text-[11px] font-medium ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Quick:
            </span>
            {['1', '5', '10', '50', '100'].map((val) => (
              <button
                key={val}
                onClick={() => setInputValue(val)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {val}
              </button>
            ))}
            <button
              onClick={() => setInputValue('1')}
              title="Reset to 1"
              className={`p-1 rounded-lg ml-auto cursor-pointer ${
                isDark
                  ? 'text-slate-500 hover:text-slate-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-4 pt-3 border-t flex justify-end shrink-0 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
