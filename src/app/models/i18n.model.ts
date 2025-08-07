export interface Language {
  code: string;
  name: string;
  flag?: string;
}

export interface LocalizedConstants {
  userConst: any;
  appConst: any;
  technologiesConst: any;
}

export type SupportedLanguage = 'es' | 'en';
export type ConstantType = 'userConst' | 'appConst' | 'technologiesConst';
