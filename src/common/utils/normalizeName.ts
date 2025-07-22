/**
 * Normalizes a name string for comparison.
 * - Trims whitespace
 * - Converts to lowercase
 * - Removes accents/diacritics
 * - Removes extra spaces
 * - Removes special characters (optional)
 */
export function normalizeName(name: string): string {
  // Quitar tildes
  const noAccents = name.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  // Quitar espacios extra y capitalizar cada palabra
  return noAccents
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
