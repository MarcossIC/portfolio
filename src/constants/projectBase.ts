export interface ProjectBase {
  ID: string;
  NAME: string;
  IMG: string;
  REPOSITORY: string;
  ICONS: string[];
}

export interface ProjectTranslation {
  ID: string;
  DESC: string;
}

export const PROJECTS_BASE: ProjectBase[] = [
  {
    ID: '1-project',
    NAME: 'Codefend',
    IMG: '../../../../assets/projects/CODEFEND-PROJECT.webp',
    REPOSITORY: 'https://github.com/codefen/codefend-user',
    ICONS: ['react', 'sass'],
  },
  {
    ID: '2-project',
    NAME: 'Game Galaxy',
    IMG: '../../../../assets/projects/GAME-GALAXY-PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/Web-Games',
    ICONS: ['angular', 'css', 'tailwind'],
  },
  {
    ID: '3-project',
    NAME: 'Books Leaks',
    IMG: '../../../../assets/projects/BOOKS-LEAKS-PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/Books-Leaks',
    ICONS: ['angular', 'css', 'tailwind', 'spring'],
  },
  {
    ID: '4-project',
    NAME: 'Notable',
    IMG: '../../../../assets/projects/NOTABLE_PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/NotAble',
    ICONS: ['nextjs', 'tailwind', 'openai'],
  },
  {
    ID: '5-project',
    NAME: 'Invoicer++',
    IMG: '../../../../assets/projects/FACTURADOR-MASMAS-PROJECT.webp',
    REPOSITORY: 'https://github.com/conjunto-solucion/facturador',
    ICONS: ['react', 'sass', 'spring'],
  },
  {
    ID: '6-project',
    NAME: 'Cash now',
    IMG: '../../../../assets/projects/CASH_NOW_PROJECT.webp',
    REPOSITORY: 'https://github.com/MarcossIC/Cash-now.git',
    ICONS: ['angular', 'css', 'tailwind', 'spring'],
  },
];

// Función utilitaria para combinar base con traducciones
export function combineProjectsWithTranslations(translations: ProjectTranslation[]) {
  return PROJECTS_BASE.map(base => {
    const translation = translations.find(t => t.ID === base.ID);
    if (!translation) {
      throw new Error(`Translation not found for project ID: ${base.ID}`);
    }
    return {
      ...base,
      DESC: translation.DESC
    };
  });
}
