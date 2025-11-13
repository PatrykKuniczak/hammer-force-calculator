export class ValidationError extends Error {
  constructor(
    public field: string,
    public value: unknown,
    message?: string,
  ) {
    super(message ?? `Invalid value for "${field}": ${String(value)}. Expected a number > 0.`);
    this.name = 'ValidationError';
  }
}

/**
 * Truncates a number to a fixed precision of 3 decimal places.
 * The precision is explicitly set via a constant and is not using default rounding.
 * Ensures very small results return 0 and avoids returning -0.
 */
export const roundTo3 = (value: number) => {
  const PRECISION_DECIMALS = 3;
  const PRECISION_FACTOR = 10 ** PRECISION_DECIMALS;
  const truncated = Math.trunc(value * PRECISION_FACTOR) / PRECISION_FACTOR;
  // Avoid "-0"
  return Object.is(truncated, -0) ? 0 : truncated;
};

/**
 * Checks that all values in the provided object are finite numbers and > 0.
 * Throws ValidationError on the first violation.
 *
 * Example:
 *   validateInputsPositivity({ travelTime, roadLength })
 */
export const validateInputsPositivity = (inputs: Record<string, number>) => {
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new ValidationError(
        key,
        value,
        `Invalid number for "${key}": ${String(value)}. Expected a finite number > 0.`,
      );
    }
    if (value <= 0) {
      throw new ValidationError(key, value);
    }
  }
};
