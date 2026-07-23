/**
 * Single source of truth for external URLs (CV, social profiles, contact).
 *
 * The CV lives on Google Drive with one PDF per language. To publish a new
 * CV, replace the Drive file ID here — every view/download link across the
 * app derives from it. NEVER hardcode these URLs anywhere else — import
 * from this file (same pattern as `experience.ts`).
 */

/** Google Drive file IDs for each CV (one PDF per language). */
const CV_DRIVE_ID = {
  es: '1DtRXncQ4WtS0DvOCl-IQ5VuxjkCEk4PJ',
  en: '1IdeE9vuVb06ljfZWY04tsIsalB5ukVnB',
} as const;

const driveViewUrl = (id: string) =>
  `https://drive.google.com/file/d/${id}/view?usp=sharing`;
const driveDownloadUrl = (id: string) =>
  `https://drive.usercontent.google.com/uc?id=${id}&export=download`;

/** View-in-browser links to the CV PDF. */
export const CV_VIEW_URL_ES = driveViewUrl(CV_DRIVE_ID.es);
export const CV_VIEW_URL_EN = driveViewUrl(CV_DRIVE_ID.en);

/** Direct-download links to the CV PDF. */
export const CV_DOWNLOAD_URL_ES = driveDownloadUrl(CV_DRIVE_ID.es);
export const CV_DOWNLOAD_URL_EN = driveDownloadUrl(CV_DRIVE_ID.en);

/** Social / contact links (language-independent). */
export const LINKEDIN_URL = 'https://www.linkedin.com/in/marcos-lopez-dev';
export const GITHUB_URL = 'https://github.com/MarcossIC';
export const STACKOVERFLOW_URL =
  'https://es.stackoverflow.com/users/301174/marcos-lopez';
export const CONTACT_EMAIL = 'marcoslopezdev18@gmail.com';
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=Hey%20Marcos%20how%20are%20you`;
