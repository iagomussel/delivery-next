// Minimal validation helpers (no external deps)

export type Validator<T> = (value: unknown) => value is T

export const isString: Validator<string> = (v): v is string => typeof v === 'string'
export const isBoolean: Validator<boolean> = (v): v is boolean => typeof v === 'boolean'
export const isNumber: Validator<number> = (v): v is number => typeof v === 'number' && !Number.isNaN(v)

export function required<T>(v: T | null | undefined, message = 'Field is required') {
  if (v === null || v === undefined || (typeof v === 'string' && v.trim() === '')) {
    throw new Error(message)
  }
  return v
}

export function sanitizeString(input: string): string {
  return input.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

export function clampNumber(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

