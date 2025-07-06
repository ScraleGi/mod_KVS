export function sanitize<T, R = T>(input: T): R {
  // Convert Prisma Decimal.js objects to string
  if (
    input &&
    typeof input === 'object' &&
    input !== null &&
    typeof (input as any).toJSON === 'function'
  ) {
    return (input as any).toString() as unknown as R
  }
  if (Array.isArray(input)) {
    return input.map(sanitize) as unknown as R
  }
  if (input && typeof input === 'object') {
    const result: any = {}
    for (const key in input) {
      result[key] = sanitize((input as any)[key])
    }
    return result as R
  }
  return input as unknown as R
}