/**
 * Helper function to safely convert any date value to ISO string
 * Handles various date formats and provides fallback for invalid dates
 */
export function formatDateToISO(dateValue: Date | string | number | null | undefined): string {
  // Handle null or undefined
  if (dateValue === null || dateValue === undefined) {
    return new Date().toISOString();
  }
  
  // Handle Date objects
  if (dateValue instanceof Date) {
    return dateValue.toISOString();
  }
  
  // Handle ISO string dates
  if (typeof dateValue === 'string') {
    // If it's already a valid ISO string, return it
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
      return dateValue;
    }
    // Otherwise try to create a Date from the string
    const date = new Date(dateValue);
    return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
  }
  
  // Last resort: try to convert whatever we have to a Date
  try {
    const date = new Date(dateValue);
    return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
  } catch {
    console.error('Invalid date value:', dateValue);
    return new Date().toISOString();
  }
}