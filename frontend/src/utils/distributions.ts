export interface HistogramBin {
  range: string;
  rangeStart: number;
  rangeEnd: number;
  count: number;
  percentage: number;
}

export interface CategoryFrequency {
  category: string;
  count: number;
  percentage: number;
}

/**
 * Calculate histogram bins for numeric data
 * @param values Array of numeric values
 * @param numBins Number of bins to create (5-50)
 * @returns Array of histogram bins with ranges, counts, and percentages
 */
export function calculateHistogram(values: number[], numBins: number): HistogramBin[] {
  // Filter out null/undefined values
  const validValues = values.filter((val) => val != null && !isNaN(val));

  if (validValues.length === 0) {
    return [];
  }

  // Handle edge case: all values are the same
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);

  if (min === max) {
    return [
      {
        range: `${min.toFixed(1)}`,
        rangeStart: min,
        rangeEnd: min,
        count: validValues.length,
        percentage: 100,
      },
    ];
  }

  // Calculate bin width
  const binWidth = (max - min) / numBins;

  // Initialize bins
  const bins: HistogramBin[] = [];
  for (let i = 0; i < numBins; i++) {
    const rangeStart = min + i * binWidth;
    const rangeEnd = min + (i + 1) * binWidth;

    bins.push({
      range: `${rangeStart.toFixed(1)} - ${rangeEnd.toFixed(1)}`,
      rangeStart,
      rangeEnd,
      count: 0,
      percentage: 0,
    });
  }

  // Count values in each bin
  validValues.forEach((value) => {
    // Find which bin this value belongs to
    let binIndex = Math.floor((value - min) / binWidth);

    // Handle edge case: value equals max (should go in last bin)
    if (binIndex >= numBins) {
      binIndex = numBins - 1;
    }

    bins[binIndex].count++;
  });

  // Calculate percentages
  const total = validValues.length;
  bins.forEach((bin) => {
    bin.percentage = total > 0 ? (bin.count / total) * 100 : 0;
  });

  return bins;
}

/**
 * Calculate frequency distribution for categorical data
 * @param values Array of string values
 * @returns Array of categories with counts and percentages, sorted by frequency (descending)
 */
export function calculateCategoricalFrequencies(values: string[]): CategoryFrequency[] {
  // Filter out null/undefined/empty values
  const validValues = values.filter((val) => val != null && val !== '');

  if (validValues.length === 0) {
    return [];
  }

  // Count occurrences
  const frequencyMap = new Map<string, number>();
  validValues.forEach((value) => {
    const count = frequencyMap.get(value) || 0;
    frequencyMap.set(value, count + 1);
  });

  // Convert to array and calculate percentages
  const total = validValues.length;
  const frequencies: CategoryFrequency[] = Array.from(frequencyMap.entries()).map(
    ([category, count]) => ({
      category,
      count,
      percentage: (count / total) * 100,
    })
  );

  // Sort by count descending (most frequent first)
  frequencies.sort((a, b) => b.count - a.count);

  return frequencies;
}
