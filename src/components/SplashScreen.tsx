import React, { useEffect, useState } from 'react';

interface Props {
  onDismiss?: () => void;
  forceShow?: boolean;
  theme?: 'light' | 'dark';
}

export const SplashScreen: React.FC<Props> = ({
  onDismiss,
  forceShow = false,
  theme = 'light',
}) => {
  const [visible, setVisible] = useState(() => {
    if (forceShow) return true;
    // Show on first initial session load
    return !sessionStorage.getItem('corbiq_splash_shown');
  });

  const [fading, setFading] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!visible) return;

    sessionStorage.setItem('corbiq_splash_shown', 'true');

    const timer = setTimeout(() => {
      setFading(true);
      const dismissTimer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, 500); // 500ms fade transition
      return () => clearTimeout(dismissTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      } ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {/* Background radial glow */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_center,rgba(66,133,244,0.15)_0,transparent_65%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(66,133,244,0.12)_0,transparent_60%)]'
        }`}
      />

      <div className="relative flex flex-col items-center gap-6 animate-scale-up">
        {/* App Logo */}
        <div className="relative w-28 h-28 rounded-3xl p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-amber-500 shadow-2xl shadow-blue-500/20">
          <div
            className={`w-full h-full rounded-[22px] flex items-center justify-center overflow-hidden ${
              isDark ? 'bg-slate-900' : 'bg-white'
            }`}
          >
            <img
              src="/assets/logo.png"
              alt="corbiQ Calculator"
              className="w-24 h-24 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
        </div>

        {/* Title & Google Branding */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4285F4] animate-bounce [animation-delay:0ms]" />
            <span className="w-2 h-2 rounded-full bg-[#EA4335] animate-bounce [animation-delay:150ms]" />
            <span className="w-2 h-2 rounded-full bg-[#FBBC04] animate-bounce [animation-delay:300ms]" />
            <span className="w-2 h-2 rounded-full bg-[#34A853] animate-bounce [animation-delay:450ms]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center">
            corbi<span className="text-blue-500">Q</span>
            <span
              className={`ml-1.5 text-xs uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${
                isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
              }`}
            >
              Calc
            </span>
          </h1>
          <p
            className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Google-Inspired Progressive Web App
          </p>
        </div>

        {/* Loading bar */}
        <div
          className={`w-36 h-1 rounded-full overflow-hidden mt-2 ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        >
          <div className="h-full bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 animate-[shimmer_1.2s_infinite]" />
        </div>
      </div>
    </div>
  );
};
