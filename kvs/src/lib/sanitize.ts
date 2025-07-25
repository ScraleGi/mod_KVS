/**
 * Recursively sanitizes input data for safe serialization and transport.
 * - Converts Prisma Decimal.js objects (and other objects with toJSON) to strings.
 * - Handles arrays and nested objects recursively.
 * - Leaves primitives and null/undefined as is.
 * Useful for preparing database results for API responses or client-side use.
 */
export function sanitize<T, R = T>(input: T): R {
  // Handle null or undefined input
  if (input === null || input === undefined) {
    return input as unknown as R;
  }

  // Convert Prisma Decimal.js objects (or any object with toJSON) to string
  if (
    typeof input === 'object' &&
    // Check if the object has a toJSON method
    'toJSON' in (input as object) &&
    typeof (input as Record<string, unknown>).toJSON === 'function'
  ) {
    // Use toString to avoid returning a Decimal instance
    return (input as { toString(): string }).toString() as unknown as R;
  }

  // Recursively sanitize arrays
  if (Array.isArray(input)) {
    return input.map(sanitize) as unknown as R;
  }

  // Recursively sanitize objects
  if (typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        result[key] = sanitize((input as Record<string, unknown>)[key]);
      }
    }
    return result as R;
  }

  // Return primitives (string, number, boolean, etc.) as is
  return input as unknown as R;
}