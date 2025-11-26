export interface NumericStatistics {
  n: number;
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

export interface CategoricalStatistics {
  n: number;
  numCategories: number;
  mode: string;
  modeCount: number;
}

/**
 * Calculate statistical measures for numeric data
 * @param values Array of numeric values
 * @returns Statistics object with n, mean, standard deviation, min, and max
 */
export function calculateNumericStatistics(values: number[]): NumericStatistics {
  // Filter out null/undefined values
  const validValues = values.filter((val) => val != null && !isNaN(val));

  if (validValues.length === 0) {
    return {
      n: 0,
      mean: 0,
      stdDev: 0,
      min: 0,
      max: 0,
    };
  }

  const n = validValues.length;

  // Calculate mean
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  const mean = sum / n;

  // Calculate min and max
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);

  // Calculate standard deviation (sample standard deviation)
  if (n === 1) {
    return {
      n,
      mean,
      stdDev: 0,
      min,
      max,
    };
  }

  const squaredDifferences = validValues.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / (n - 1);
  const stdDev = Math.sqrt(variance);

  return {
    n,
    mean,
    stdDev,
    min,
    max,
  };
}

/**
 * Calculate statistical measures for categorical data
 * @param values Array of string values
 * @returns Statistics object with n, number of categories, mode, and mode count
 */
export function calculateCategoricalStatistics(values: string[]): CategoricalStatistics {
  // Filter out null/undefined/empty values
  const validValues = values.filter((val) => val != null && val !== '');

  if (validValues.length === 0) {
    return {
      n: 0,
      numCategories: 0,
      mode: '',
      modeCount: 0,
    };
  }

  const n = validValues.length;

  // Count occurrences of each category
  const frequencyMap = new Map<string, number>();
  validValues.forEach((value) => {
    const count = frequencyMap.get(value) || 0;
    frequencyMap.set(value, count + 1);
  });

  const numCategories = frequencyMap.size;

  // Find mode (most frequent category)
  let mode = '';
  let modeCount = 0;

  frequencyMap.forEach((count, category) => {
    if (count > modeCount) {
      mode = category;
      modeCount = count;
    }
  });

  return {
    n,
    numCategories,
    mode,
    modeCount,
  };
}
