import React from 'react';
import { X, Volume2, Smartphone, Moon, Sun, Sparkles } from 'lucide-react';
import { SoundHapticSettings } from '../types/calculator';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: SoundHapticSettings;
  onUpdateSettings: (newSettings: Partial<SoundHapticSettings>) => void;
  onPreviewSplash: () => void;
  theme?: 'light' | 'dark';
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onPreviewSplash,
  theme = 'light',
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className={`relative w-full max-w-sm rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col border transition-colors duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-4 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold">Settings & Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings options */}
        <div className="space-y-3.5">
          {/* Appearance / Theme Toggle */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border ${
              isDark
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold">Theme Mode</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isDark ? 'Dark Theme' : 'Light Theme (Default)'}
                </div>
              </div>
            </div>
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-full p-0.5 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  !isDark
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Light</span>
              </button>
              <button
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  isDark
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Sound click feedback */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border ${
              isDark
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Tactile Key Sounds</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pleasant mechanical audio click
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className={`w-10 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${
                  isDark ? 'bg-slate-800' : 'bg-slate-300'
                }`}
              />
            </label>
          </div>

          {/* Haptic vibration feedback */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border ${
              isDark
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Haptic Vibration</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Mobile tactile tap impulses
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.hapticEnabled}
                onChange={(e) => onUpdateSettings({ hapticEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div
                className={`w-10 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 ${
                  isDark ? 'bg-slate-800' : 'bg-slate-300'
                }`}
              />
            </label>
          </div>

          {/* Splash Preview */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border ${
              isDark
                ? 'bg-slate-950/60 border-slate-800'
                : 'bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold">Splash Screen</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Preview opening animation
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onPreviewSplash();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs'
              }`}
            >
              Preview
            </button>
          </div>

          {/* Install Option */}
          <div className="pt-1">
            <PWAInstallButton variant="full" />
          </div>

          {/* About corbiQ */}
          <div
            className={`p-3.5 rounded-2xl border text-center ${
              isDark
                ? 'bg-slate-950/40 border-slate-800/80'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <img
                src="/assets/logo.png"
                alt="corbiQ Logo"
                className="w-5 h-5 rounded-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
              <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                corbiQ Calculator PWA
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Google Material You design with light/dark themes, offline caching, and tactile feedback.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-4 pt-3 border-t flex justify-end ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
