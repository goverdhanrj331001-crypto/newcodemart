import slugify from 'slugify';

/**
 * Slugify a string, falling back to a random suffix if the input is empty.
 * Output: lower-case, hyphen-separated, alphanumeric.
 */
export function makeSlug(input: string, fallback = 'item'): string {
  const s = slugify(input, { lower: true, strict: true, trim: true });
  if (!s) return `${fallback}-${Date.now().toString(36)}`;
  return s;
}

/**
 * Generate a short pseudo-random id (for things like order numbers).
 */
export function shortId(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

/**
 * Build an order number like ORD-2026-AB12CD.
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  return `ORD-${year}-${shortId(6)}`;
}
