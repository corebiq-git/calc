import { UnitCategory, UnitDefinition } from '../types/calculator';

export const UNIT_CATEGORIES: { id: UnitCategory; label: string; icon: string }[] = [
  { id: 'length', label: 'Length', icon: 'ruler' },
  { id: 'mass', label: 'Mass', icon: 'scale' },
  { id: 'temperature', label: 'Temperature', icon: 'thermometer' },
  { id: 'volume', label: 'Volume', icon: 'beaker' },
  { id: 'area', label: 'Area', icon: 'maximize' },
  { id: 'speed', label: 'Speed', icon: 'gauge' },
  { id: 'data', label: 'Digital Storage', icon: 'hard-drive' },
  { id: 'time', label: 'Time', icon: 'clock' },
];

export const UNITS_DATA: Record<UnitCategory, UnitDefinition[]> = {
  length: [
    { id: 'm', name: 'Meter', symbol: 'm', ratio: 1 },
    { id: 'km', name: 'Kilometer', symbol: 'km', ratio: 1000 },
    { id: 'cm', name: 'Centimeter', symbol: 'cm', ratio: 0.01 },
    { id: 'mm', name: 'Millimeter', symbol: 'mm', ratio: 0.001 },
    { id: 'mi', name: 'Mile', symbol: 'mi', ratio: 1609.344 },
    { id: 'yd', name: 'Yard', symbol: 'yd', ratio: 0.9144 },
    { id: 'ft', name: 'Foot', symbol: 'ft', ratio: 0.3048 },
    { id: 'in', name: 'Inch', symbol: 'in', ratio: 0.0254 },
    { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', ratio: 1852 },
  ],
  mass: [
    { id: 'kg', name: 'Kilogram', symbol: 'kg', ratio: 1 },
    { id: 'g', name: 'Gram', symbol: 'g', ratio: 0.001 },
    { id: 'mg', name: 'Milligram', symbol: 'mg', ratio: 0.000001 },
    { id: 'lb', name: 'Pound', symbol: 'lb', ratio: 0.45359237 },
    { id: 'oz', name: 'Ounce', symbol: 'oz', ratio: 0.028349523125 },
    { id: 't', name: 'Metric Ton', symbol: 't', ratio: 1000 },
  ],
  temperature: [
    {
      id: 'c',
      name: 'Celsius',
      symbol: '°C',
      toBase: (c) => c,
      fromBase: (c) => c,
    },
    {
      id: 'f',
      name: 'Fahrenheit',
      symbol: '°F',
      toBase: (f) => ((f - 32) * 5) / 9,
      fromBase: (c) => (c * 9) / 5 + 32,
    },
    {
      id: 'k',
      name: 'Kelvin',
      symbol: 'K',
      toBase: (k) => k - 273.15,
      fromBase: (c) => c + 273.15,
    },
  ],
  volume: [
    { id: 'l', name: 'Liter', symbol: 'L', ratio: 1 },
    { id: 'ml', name: 'Milliliter', symbol: 'mL', ratio: 0.001 },
    { id: 'gal', name: 'US Gallon', symbol: 'gal', ratio: 3.78541 },
    { id: 'qt', name: 'US Quart', symbol: 'qt', ratio: 0.946353 },
    { id: 'pt', name: 'US Pint', symbol: 'pt', ratio: 0.473176 },
    { id: 'cup', name: 'US Cup', symbol: 'cup', ratio: 0.236588 },
    { id: 'floz', name: 'Fluid Ounce', symbol: 'fl oz', ratio: 0.0295735 },
    { id: 'm3', name: 'Cubic Meter', symbol: 'm³', ratio: 1000 },
  ],
  area: [
    { id: 'm2', name: 'Square Meter', symbol: 'm²', ratio: 1 },
    { id: 'km2', name: 'Square Kilometer', symbol: 'km²', ratio: 1e6 },
    { id: 'ft2', name: 'Square Foot', symbol: 'ft²', ratio: 0.092903 },
    { id: 'acre', name: 'Acre', symbol: 'ac', ratio: 4046.86 },
    { id: 'ha', name: 'Hectare', symbol: 'ha', ratio: 10000 },
  ],
  speed: [
    { id: 'mps', name: 'Meter per second', symbol: 'm/s', ratio: 1 },
    { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', ratio: 0.277778 },
    { id: 'mph', name: 'Mile per hour', symbol: 'mph', ratio: 0.44704 },
    { id: 'knot', name: 'Knot', symbol: 'kn', ratio: 0.514444 },
  ],
  data: [
    { id: 'b', name: 'Byte', symbol: 'B', ratio: 1 },
    { id: 'kb', name: 'Kilobyte', symbol: 'KB', ratio: 1024 },
    { id: 'mb', name: 'Megabyte', symbol: 'MB', ratio: 1024 ** 2 },
    { id: 'gb', name: 'Gigabyte', symbol: 'GB', ratio: 1024 ** 3 },
    { id: 'tb', name: 'Terabyte', symbol: 'TB', ratio: 1024 ** 4 },
  ],
  time: [
    { id: 's', name: 'Second', symbol: 's', ratio: 1 },
    { id: 'ms', name: 'Millisecond', symbol: 'ms', ratio: 0.001 },
    { id: 'min', name: 'Minute', symbol: 'min', ratio: 60 },
    { id: 'hr', name: 'Hour', symbol: 'hr', ratio: 3600 },
    { id: 'day', name: 'Day', symbol: 'd', ratio: 86400 },
    { id: 'wk', name: 'Week', symbol: 'wk', ratio: 604800 },
    { id: 'yr', name: 'Year (365d)', symbol: 'yr', ratio: 31536000 },
  ],
};

export function convertUnit(
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string,
  value: number
): number {
  if (Number.isNaN(value)) return 0;
  if (fromUnitId === toUnitId) return value;

  const units = UNITS_DATA[category];
  const fromUnit = units.find((u) => u.id === fromUnitId);
  const toUnit = units.find((u) => u.id === toUnitId);

  if (!fromUnit || !toUnit) return value;

  // Temperature uses custom functions
  if (category === 'temperature') {
    const baseVal = fromUnit.toBase ? fromUnit.toBase(value) : value;
    const finalVal = toUnit.fromBase ? toUnit.fromBase(baseVal) : baseVal;
    return parseFloat(finalVal.toFixed(6));
  }

  // Linear units use ratio
  const fromRatio = fromUnit.ratio ?? 1;
  const toRatio = toUnit.ratio ?? 1;

  const baseVal = value * fromRatio;
  const converted = baseVal / toRatio;
  return parseFloat(converted.toPrecision(8));
}
