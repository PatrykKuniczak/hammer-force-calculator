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
 * Checks that all values in the provided object are finite numbers and > 0.
 * Throws ValidationError on the first violation.
 *
 * Example:
 *   validatePositiveInputs({ travelTime, roadLength })
 */
export const validatePositiveInputs = (inputs: Record<string, number>) => {
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
