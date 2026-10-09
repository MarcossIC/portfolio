export interface ProjectBase {
  ID: string;
  NAME: string;
  IMG: string;
  /** Omit for private/client projects without a public repo. */
  REPOSITORY?: string;
  ICONS: string[];
}

export interface ProjectTranslation {
  ID: string;
  DESC: string;
}

export const PROJECTS_BASE: ProjectBase[] = [
  {
    // Private client project (Boutique Software): no public repository
    ID: '7-project',
    NAME: 'Daimler Truck Financial Services',
    IMG: '../../../../assets/projects/DTFS.png',
    ICONS: ['angular', 'nestjs', 'spring', 'sqlserver', 'playwright', 'docker'],
  },
  {
    ID: '1-project',
    NAME: 'Codefend',
    IMG: '../../../../assets/projects/CODEFEND-PROJECT.webp',
    REPOSITORY: 'https://github.com/codefen/codefend-user',
    ICONS: ['react', 'sass', 'tauri', 'rust'],
  },
  {
    // Private client project (Boutique Software): no public repository
    ID: '8-project',
    NAME: 'IMPortas',
    IMG: '../../../../assets/projects/importas.png',
    ICONS: ['nuxt', 'nestjs'],
  },
  {
    ID: '2-project',
    NAME: 'Game Galaxy',
    IMG: '../../../../assets/projects/GAME-GALAXY-PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/Web-Games',
    ICONS: ['angular', 'css3', 'tailwind'],
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
    NAME: 'Facturador++',
    IMG: '../../../../assets/projects/FACTURADOR-MASMAS-PROJECT.webp',
    REPOSITORY: 'https://github.com/conjunto-solucion/facturador',
    ICONS: ['react', 'sass', 'spring', 'docker'],
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
