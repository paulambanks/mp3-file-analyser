import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 *
 * @param inputs Array of class strings
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
