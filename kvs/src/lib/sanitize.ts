export function sanitize<T, R = T>(input: T): R {
  // Handle null or undefined input
  if (input === null || input === undefined) {
    return input as unknown as R;
  }

  // Convert Prisma Decimal.js objects to string
  if (
    typeof input === 'object' &&
    // Check if the object has a toJSON method using safer approach
    'toJSON' in (input as object) &&
    typeof (input as Record<string, unknown>).toJSON === 'function'
  ) {
    return (input as { toString(): string }).toString() as unknown as R;
  }

  // Handle arrays
  if (Array.isArray(input)) {
    return input.map(sanitize) as unknown as R;
  }

  // Handle objects
  if (typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        result[key] = sanitize((input as Record<string, unknown>)[key]);
      }
    }
    return result as R;
  }

  // Return primitives and other types as is
  return input as unknown as R;
}