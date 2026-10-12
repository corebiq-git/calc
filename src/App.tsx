/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AngleMode,
  CalculatorMode,
  HistoryItem,
  SoundHapticSettings,
} from './types/calculator';
import {
  evaluateExpression,
  getLivePreview,
} from './utils/mathEngine';
import { playTactileSound, triggerHaptic, SoundType } from './utils/audioFeedback';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { ScientificKeypad } from './components/ScientificKeypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { UnitConverterModal } from './components/UnitConverterModal';
import { SettingsModal } from './components/SettingsModal';
import { SplashScreen } from './components/SplashScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ChevronDown, ChevronUp, ArrowRightLeft } from 'lucide-react';

export default function App() {
  // Calculator States
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [isScientificExpanded, setIsScientificExpanded] = useState<boolean>(false);
  const [memory, setMemory] = useState<number>(0);

  // History & Settings Persisted State (Light mode by default)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('corbiq_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundHaptics, setSoundHaptics] = useState<SoundHapticSettings>(() => {
    try {
      const saved = localStorage.getItem('corbiq_calc_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          soundEnabled: parsed.soundEnabled ?? true,
          hapticEnabled: parsed.hapticEnabled ?? true,
          // Light mode by default if not set or set to light
          theme: parsed.theme === 'dark' ? 'dark' : 'light',
        };
      }
      // Light mode by default!
      return { soundEnabled: true, hapticEnabled: true, theme: 'light' };
    } catch {
      return { soundEnabled: true, hapticEnabled: true, theme: 'light' };
    }
  });

  // Modal Dialogs
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [forceSplash, setForceSplash] = useState(false);

  const isDark = soundHaptics.theme === 'dark';

  // Sync PWA theme-color meta tag and HTML element class
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#0F172A' : '#F8FAFC');
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('corbiq_calc_history', JSON.stringify(history));
    } catch {
      // localStorage limit handling
    }
  }, [history]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('corbiq_calc_settings', JSON.stringify(soundHaptics));
    } catch {
      // Ignore
    }
  }, [soundHaptics]);

  // Tactile feedback helper
  const handleFeedback = useCallback(
    (type: SoundType) => {
      playTactileSound(type, soundHaptics.soundEnabled);
      triggerHaptic(type, soundHaptics.hapticEnabled);
    },
    [soundHaptics]
  );

  // Toggle theme between Light and Dark
  const handleToggleTheme = useCallback(() => {
    handleFeedback('toggle');
    setSoundHaptics((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, [handleFeedback]);

  // Live calculation preview while typing
  const livePreview = getLivePreview(expression, angleMode);

  // Input Digit
  const handleInputDigit = useCallback(
    (digit: string) => {
      if (hasCalculated) {
        setExpression(digit === '.' ? '0.' : digit);
        setHasCalculated(false);
        return;
      }

      setExpression((prev) => {
        // Prevent double decimal points in current number segment
        if (digit === '.') {
          const parts = prev.split(/[+\-×*÷/^()]/);
          const currentPart = parts[parts.length - 1];
          if (currentPart.includes('.')) return prev;
          if (!currentPart) return prev + '0.';
        }
        return prev + digit;
      });
    },
    [hasCalculated]
  );

  // Input Operator
  const handleInputOperator = useCallback(
    (op: string) => {
      setHasCalculated(false);

      if (hasCalculated) {
        // Chain calculation starting from previous result
        if (result !== 'Error' && result !== 'Infinity') {
          setExpression(result + op);
          return;
        }
      }

      setExpression((prev) => {
        if (!prev) {
          if (op === '−' || op === '-') return '−';
          if (op === '(') return '(';
          return '';
        }

        // If last character is an operator and user clicks another operator, replace it
        if (/[+\-×*÷/^]$/.test(prev) && !/[()]/.test(op)) {
          return prev.slice(0, -1) + op;
        }

        return prev + op;
      });
    },
    [hasCalculated, result]
  );

  // Insert Scientific Token (e.g. sin(, ln(, π, etc.)
  const handleInsertToken = useCallback(
    (token: string) => {
      handleFeedback('operator');
      if (hasCalculated) {
        setExpression(token);
        setHasCalculated(false);
        return;
      }
      setExpression((prev) => prev + token);
    },
    [hasCalculated, handleFeedback]
  );

  // Clear Expression
  const handleClear = useCallback(() => {
    handleFeedback('clear');
    setExpression('');
    setResult('0');
    setHasCalculated(false);
  }, [handleFeedback]);

  // Backspace single character
  const handleBackspace = useCallback(() => {
    handleFeedback('clear');
    if (hasCalculated) {
      setExpression('');
      setHasCalculated(false);
      return;
    }

    setExpression((prev) => {
      if (!prev) return '';
      // Check if deleting a scientific function token like sin(, cos(, ln(
      const funcTokens = ['asin(', 'acos(', 'atan(', 'sin(', 'cos(', 'tan(', 'log(', 'abs(', 'ln(', '√( ', '(1/'];
      for (const tok of funcTokens) {
        if (prev.endsWith(tok)) {
          return prev.slice(0, -tok.length);
        }
      }
      return prev.slice(0, -1);
    });
  }, [hasCalculated, handleFeedback]);

  // Perform Calculation (=)
  const handleCalculate = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    handleFeedback('equals');
    const evalOutput = evaluateExpression(expression, angleMode);

    if (evalOutput.error || evalOutput.result === 'Error') {
      setResult('Error');
    } else {
      setResult(evalOutput.result);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        expression: expression,
        result: evalOutput.result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]); // keep last 50
    }

    setHasCalculated(true);
  }, [expression, angleMode, handleFeedback]);

  // Restore history calculation
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setHasCalculated(true);
  };

  // Keyboard navigation & Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input element or modal is focused
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleFeedback('digit');
        handleInputDigit(e.key);
      } else if (e.key === '.') {
        handleFeedback('digit');
        handleInputDigit('.');
      } else if (e.key === '+') {
        handleFeedback('operator');
        handleInputOperator('+');
      } else if (e.key === '-') {
        handleFeedback('operator');
        handleInputOperator('−');
      } else if (e.key === '*') {
        handleFeedback('operator');
        handleInputOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleFeedback('operator');
        handleInputOperator('÷');
      } else if (e.key === '%') {
        handleFeedback('operator');
        handleInputOperator('%');
      } else if (e.key === '(' || e.key === ')') {
        handleFeedback('operator');
        handleInputOperator(e.key);
      } else if (e.key === '^') {
        handleFeedback('operator');
        handleInputOperator('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleInputDigit,
    handleInputOperator,
    handleCalculate,
    handleBackspace,
    handleClear,
    handleFeedback,
  ]);

  // Mobile mode selector
  const handleModeChange = (newMode: CalculatorMode) => {
    handleFeedback('toggle');
    if (newMode === 'converter') {
      setIsConverterOpen(true);
      return;
    }
    setMode(newMode);
    if (newMode === 'scientific') {
      setIsScientificExpanded(true);
    } else {
      setIsScientificExpanded(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans relative overflow-x-hidden transition-colors duration-200 select-none ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-600/30'
          : 'bg-slate-100/80 text-slate-900 selection:bg-blue-500/20'
      }`}
    >
      {/* Google-Style Splash Screen */}
      <SplashScreen
        forceShow={forceSplash}
        onDismiss={() => setForceSplash(false)}
        theme={soundHaptics.theme}
      />

      {/* Connectivity Status Toast for PWA */}
      <OfflineIndicator />

      {/* Top Application Header */}
      <Header
        mode={mode}
        onSelectMode={handleModeChange}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        historyCount={history.length}
        soundHaptics={soundHaptics}
        onToggleSound={() =>
          setSoundHaptics((prev) => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
          }))
        }
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={soundHaptics.theme}
      />

      {/* Main Responsive Calculator Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 w-full max-w-4xl mx-auto">
        <div
          className={`w-full max-w-md lg:max-w-xl rounded-3xl sm:rounded-[32px] p-3 sm:p-5 flex flex-col gap-3 sm:gap-4 transition-all duration-200 ${
            isDark
              ? 'bg-slate-900/40 border border-slate-800/80 shadow-2xl backdrop-blur-md'
              : 'bg-white/95 border border-slate-200/90 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)]'
          }`}
        >
          {/* Output Display */}
          <Display
            expression={expression}
            result={result}
            livePreview={livePreview}
            hasCalculated={hasCalculated}
            angleMode={angleMode}
            onToggleAngleMode={() => {
              handleFeedback('toggle');
              setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
            }}
            showAngleToggle={mode === 'scientific' || isScientificExpanded}
            hasMemory={memory !== 0}
            onBackspace={handleBackspace}
            theme={soundHaptics.theme}
          />

          {/* Mobile Quick Scientific Drawer Toggle Pill */}
          <div className="flex items-center justify-between px-1 sm:hidden">
            <button
              onClick={() => {
                handleFeedback('toggle');
                setIsScientificExpanded(!isScientificExpanded);
                if (!isScientificExpanded) setMode('scientific');
                else setMode('standard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border active:scale-95 transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800/90 text-blue-400 border-slate-700/60'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              <span>{isScientificExpanded ? 'Hide Scientific' : 'Scientific Mode'}</span>
              {isScientificExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => {
                handleFeedback('toggle');
                setIsConverterOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border active:scale-95 transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800/90 text-slate-300 hover:text-white border-slate-700/60'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />
              <span>Unit Converter</span>
            </button>
          </div>

          {/* Scientific Keypad Section */}
          {(mode === 'scientific' || isScientificExpanded) && (
            <div className="transition-all animate-fade-in">
              <ScientificKeypad
                onInsert={handleInsertToken}
                angleMode={angleMode}
                onToggleAngleMode={() => {
                  handleFeedback('toggle');
                  setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
                }}
                theme={soundHaptics.theme}
              />
            </div>
          )}

          {/* Standard Keypad Section */}
          <Keypad
            onInputDigit={handleInputDigit}
            onInputOperator={handleInputOperator}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onCalculate={handleCalculate}
            onPlaySound={handleFeedback}
            hasCalculated={hasCalculated}
            theme={soundHaptics.theme}
          />
        </div>
      </main>

      {/* History Slide Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={() => setHistory([])}
        theme={soundHaptics.theme}
      />

      {/* Google-Style Unit Converter Modal */}
      <UnitConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
        theme={soundHaptics.theme}
      />

      {/* Settings & Info Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={soundHaptics}
        onUpdateSettings={(newSettings) =>
          setSoundHaptics((prev) => ({ ...prev, ...newSettings }))
        }
        onPreviewSplash={() => setForceSplash(true)}
        theme={soundHaptics.theme}
      />
    </div>
  );
}
