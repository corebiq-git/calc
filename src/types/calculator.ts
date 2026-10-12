export type AngleMode = 'DEG' | 'RAD';

export type CalculatorMode = 'standard' | 'scientific' | 'converter';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface SoundHapticSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: 'light' | 'dark';
}

export type UnitCategory = 
  | 'length'
  | 'mass'
  | 'temperature'
  | 'volume'
  | 'area'
  | 'speed'
  | 'data'
  | 'time';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  // ratio to base unit or custom converter
  ratio?: number;
  toBase?: (val: number) => number;
  fromBase?: (baseVal: number) => number;
}
