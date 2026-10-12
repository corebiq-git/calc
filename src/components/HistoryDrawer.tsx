import React, { useState } from 'react';
import { X, Trash2, Search, ArrowUpRight, Copy, Check, Clock } from 'lucide-react';
import { HistoryItem } from '../types/calculator';
import { formatExpressionDisplay } from '../utils/mathEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  theme?: 'light' | 'dark';
}

export const HistoryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  theme = 'light',
}) => {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const filtered = history.filter(
    (item) =>
      item.expression.toLowerCase().includes(search.toLowerCase()) ||
      item.result.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in">
      <div
        className={`relative w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-left transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-l border-slate-800 text-slate-100'
            : 'bg-white border-l border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">History</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear all history"
                className={`p-2 rounded-xl transition cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Close history"
              className={`p-2 rounded-xl transition cursor-pointer ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search */}
        {history.length > 0 && (
          <div
            className={`px-4 py-2 border-b ${
              isDark ? 'border-slate-800/80' : 'border-slate-200/80'
            }`}
          >
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search past equations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 border ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Clock
                className={`w-12 h-12 mb-3 stroke-[1.5] ${
                  isDark ? 'text-slate-700' : 'text-slate-300'
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                No calculations yet
              </p>
              <p
                className={`text-xs mt-1 max-w-[200px] ${
                  isDark ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Equations and answers will automatically be saved here.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className={`group relative p-3 rounded-2xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-800 hover:border-slate-700/80'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200/90 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    {formatTime(item.timestamp)}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopy(item.id, item.result, e)}
                      title="Copy result"
                      className={`p-1 rounded ${
                        isDark
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>

                <div
                  className={`text-xs text-right truncate ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {formatExpressionDisplay(item.expression)} =
                </div>
                <div
                  className={`text-lg font-bold text-right tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {item.result}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
