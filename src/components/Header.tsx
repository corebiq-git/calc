import React from 'react';
import { History, Settings, Volume2, VolumeX, ArrowRightLeft, Sun, Moon } from 'lucide-react';
import { CalculatorMode, SoundHapticSettings } from '../types/calculator';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  mode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  onToggleHistory: () => void;
  historyCount: number;
  soundHaptics: SoundHapticSettings;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
}

export const Header: React.FC<Props> = ({
  mode,
  onSelectMode,
  onToggleHistory,
  historyCount,
  soundHaptics,
  onToggleSound,
  onToggleTheme,
  onOpenSettings,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`w-full px-3 py-2.5 flex items-center justify-between border-b backdrop-blur-md select-none shrink-0 transition-colors duration-200 ${
        isDark
          ? 'border-slate-800/80 bg-slate-900/40 text-slate-100'
          : 'border-slate-200/90 bg-white/85 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      }`}
    >
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-xl p-0.5 bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-sm shrink-0">
          <img
            src="/assets/logo.png"
            alt="corbiQ"
            className="w-full h-full object-contain rounded-[10px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold text-base tracking-tight flex items-center ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              corbi<span className="text-blue-500">Q</span>
            </span>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-blue-50 text-blue-600 border-blue-200'
              }`}
            >
              Calc
            </span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs (Material 3 Segmented Button) */}
      <div
        className={`hidden sm:flex items-center p-1 rounded-full border transition-colors ${
          isDark
            ? 'bg-slate-950/70 border-slate-800'
            : 'bg-slate-100/90 border-slate-200'
        }`}
      >
        <button
          onClick={() => onSelectMode('standard')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'standard'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Standard
        </button>
        <button
          onClick={() => onSelectMode('scientific')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            mode === 'scientific'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Scientific
        </button>
        <button
          onClick={() => onSelectMode('converter')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
            mode === 'converter'
              ? 'bg-blue-600 text-white shadow-sm'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-3 h-3" />
          <span>Convert</span>
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* PWA Install Button */}
        <PWAInstallButton variant="compact" />

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
          className={`p-2 rounded-full active:scale-95 transition cursor-pointer ${
            isDark
              ? 'text-amber-400 hover:bg-slate-800/80 hover:text-amber-300'
              : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* History Toggle */}
        <button
          onClick={onToggleHistory}
          title="Calculation History"
          className={`relative p-2 rounded-full active:scale-95 transition cursor-pointer ${
            isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
          )}
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleSound}
          title={soundHaptics.soundEnabled ? 'Mute Key Sounds' : 'Enable Key Sounds'}
          className={`p-2 rounded-full active:scale-95 transition cursor-pointer ${
            isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {soundHaptics.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-500" />
          ) : (
            <VolumeX
              className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
            />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & App Info"
          className={`p-2 rounded-full active:scale-95 transition cursor-pointer ${
            isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
