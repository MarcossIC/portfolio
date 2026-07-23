/**
 * Single source of truth for time-based experience values.
 *
 * These auto-calculate from a start date, so they stay correct as time passes.
 * NEVER hardcode a "years of experience" number anywhere else — import from here.
 */

/** When Marcos started working professionally. */
export const PROFESSIONAL_START = new Date(2022, 0, 1); // January 2022

/** When Marcos started coding. Adjust if the real year is different. */
export const CODING_START = new Date(2018, 0, 1); // January 2018

/**
 * Full calendar years elapsed since `start` (not a day-count approximation),
 * so the value only increases on the actual anniversary.
 */
function fullYearsSince(start: Date): number {
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  const monthDiff = now.getMonth() - start.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years--;
  }
  return years;
}

/** Whole years of professional experience (e.g. 4). */
export const YEARS_OF_EXPERIENCE = fullYearsSince(PROFESSIONAL_START);

/** Whole years since he started coding (e.g. 8). */
export const YEARS_CODING = fullYearsSince(CODING_START);

/** Zero-padded 2-digit string of the professional years, e.g. '04'. */
export const YEARS_OF_EXPERIENCE_PADDED = String(YEARS_OF_EXPERIENCE).padStart(2, '0');
