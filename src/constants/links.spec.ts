import { describe, expect, it } from 'vitest';
import {
  CV_DOWNLOAD_URL_EN,
  CV_DOWNLOAD_URL_ES,
  CV_VIEW_URL_EN,
  CV_VIEW_URL_ES,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  GITHUB_URL,
  LINKEDIN_URL,
  STACKOVERFLOW_URL,
} from './links';
import { USER as USER_DEFAULT } from './userConst';
import { USER as USER_ES } from './es/userConst';
import { USER as USER_EN } from './en/userConst';
import { FOOTER as FOOTER_DEFAULT } from './appConst';
import { FOOTER as FOOTER_ES } from './es/appConst';
import { FOOTER as FOOTER_EN } from './en/appConst';

const driveIdOf = (url: string): string =>
  url.match(/(?:\/d\/|[?&]id=)([\w-]+)/)?.[1] ?? '';

describe('links (single source of truth)', () => {
  it('derives view and download URLs from the same Drive ID per language', () => {
    expect(driveIdOf(CV_VIEW_URL_ES)).toBe(driveIdOf(CV_DOWNLOAD_URL_ES));
    expect(driveIdOf(CV_VIEW_URL_EN)).toBe(driveIdOf(CV_DOWNLOAD_URL_EN));
    expect(driveIdOf(CV_VIEW_URL_ES)).not.toBe('');
    expect(driveIdOf(CV_VIEW_URL_EN)).not.toBe('');
  });

  it('uses a different CV per language', () => {
    expect(driveIdOf(CV_VIEW_URL_ES)).not.toBe(driveIdOf(CV_VIEW_URL_EN));
  });

  it('builds the mailto from the contact email', () => {
    expect(CONTACT_MAILTO).toContain(`mailto:${CONTACT_EMAIL}`);
  });
});

describe('userConst consumes central links', () => {
  it.each([
    ['es', USER_ES, CV_VIEW_URL_ES, CV_DOWNLOAD_URL_ES],
    ['en', USER_EN, CV_VIEW_URL_EN, CV_DOWNLOAD_URL_EN],
    ['default', USER_DEFAULT, CV_VIEW_URL_EN, CV_DOWNLOAD_URL_EN],
  ])('%s USER points to the central CV and social URLs', (_lang, user, view, download) => {
    expect(user.cv).toBe(view);
    expect(user.downloadCv).toBe(download);
    expect(user.linkedIn).toBe(LINKEDIN_URL);
    expect(user.gitHub).toBe(GITHUB_URL);
    expect(user.stackOverflow).toBe(STACKOVERFLOW_URL);
    expect(user.email).toBe(CONTACT_EMAIL);
  });
});

describe('appConst FOOTER consumes central links', () => {
  it.each([
    ['es', FOOTER_ES, CV_VIEW_URL_ES],
    ['en', FOOTER_EN, CV_VIEW_URL_EN],
    ['default', FOOTER_DEFAULT, CV_VIEW_URL_EN],
  ])('%s FOOTER.SOCIAL points to the central URLs', (_lang, footer, view) => {
    expect(footer.SOCIAL.CV.URL).toBe(view);
    expect(footer.SOCIAL.LINKEDIN.URL).toBe(LINKEDIN_URL);
    expect(footer.SOCIAL.GITHUB.URL).toBe(GITHUB_URL);
    expect(footer.SOCIAL.GMAIL.URL).toBe(CONTACT_MAILTO);
  });
});
