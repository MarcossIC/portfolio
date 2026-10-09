import type { Projects } from '@app/models/projects';
import { YEARS_OF_EXPERIENCE, YEARS_CODING } from '@constants/experience';
import { CONTACT_MAILTO, CV_VIEW_URL_ES, GITHUB_URL, LINKEDIN_URL } from '@constants/links';
import type { ServicesType } from '@app/models/servicesTypes';
import type { LinksHeaderArray } from '@app/models/types';
import { combineProjectsWithTranslations, type ProjectTranslation } from '../projectBase';

const PROJECTS_TRANSLATIONS: ProjectTranslation[] = [
  {
    ID: '7-project',
    DESC: 'Plataforma de cotización y crédito de Daimler Truck Financial Services México, con +600 usuarios y ~1.200 cotizaciones por mes. Participé en el onboarding digital de solicitudes de crédito que reemplazó el proceso manual en papel, desarrollé el motor de cálculo de amortizaciones como microservicio en NestJS e introduje testing automatizado con Vitest y Playwright.',
  },
  {
    ID: '1-project',
    DESC: 'SaaS híbrido (web y escritorio con Tauri/Rust) que conecta empresas con proveedores de ciberseguridad. Migré la app completa (~17 vistas) de SolidJS a React 18 en 3 meses sin interrumpir la operación, implementé junto al equipo el escáner automático de dominios y los reportes en PDF generados con IA, y reduje un 45% las dependencias del proyecto.',
  },
  {
    ID: '8-project',
    DESC: 'Sistema de gestión de importaciones y certificaciones para Importadora Portas, con ~40 usuarios activos y ~37 certificaciones por mes. Lo desarrollé de punta a punta (frontend en Nuxt con ~18 vistas y API en NestJS sobre MySQL) reemplazando al sistema legacy del cliente: catálogo de productos, revisión de legajos, certificaciones IRAM e INAL con un flujo guiado por pasos y un tablero de estados con reportes en Excel y envío automático de emails.',
  },
  {
    ID: '2-project',
    DESC: 'Game Galaxy es una plataforma para juegos clásicos. Este sitio web, que incluye juegos populares como Tetris, Snake y Tic-Tac-Toe, está construido con Angular, CSS, canvas y RxJS. Game Galaxy ofrece a los usuarios un toque moderno a los queridos juegos retro.',
  },
  {
    ID: '4-project',
    DESC: 'NotAble es una aplicación de toma de notas online que transcribe tu voz a texto en tiempo real. Además, utiliza IA para resumir tus notas, destacando los puntos más importantes. Desarrollado con Next.js, integra Vercel AI SDK y Google Speech-to-Text para brindar una experiencia de toma de notas fluida e inteligente.',
  },
  {
    ID: '5-project',
    DESC: 'Sistema educativo de generación y registro de documentos comerciales para la E.P.E.T. N°4, usado por más de 40 alumnos. Desarrollé la API REST con Java, Spring Boot y Spring Security aplicando arquitectura limpia, modelé la base de datos MySQL (~20 tablas) y corregí más de 10 incidencias en pruebas integrales con docentes y alumnos.',
  },
];

export const PROJECTS_V2: Projects = combineProjectsWithTranslations(PROJECTS_TRANSLATIONS);

export const PROJECTS_TITLE = {
  TITLE_COMPLETE: 'Algunos proyectos',
  TITLE: ['Algunos', 'Proyectos'],
  TOOLTIP: 'Ir al repositorio'
};

export const STUDIES_TITLE = {
  TITLE_COMPLETE: 'Mis estudios',
  TITLE: ['Mis', 'Estudios']
};

export const EXPERIENCE_TITLE = {
  TITLE_COMPLETE: 'Experiencia Profesional',
  TITLE: ['Experiencia', 'Profesional']
};

export const CONTACT_TITLE = {
  TITLE_COMPLETE: 'Hablemos de tu pr\u00F3ximo proyecto',
  TITLE: ['Hablemos de tu', 'pr\u00F3ximo proyecto'],
  SUB: 'Estoy abierto a nuevas oportunidades y colaboraciones. Cu\u00E9ntame tu idea y construyamos algo incre\u00EDble juntos.',
  BADGE: 'Contacto',
  EMAIL_LABEL: 'Email',
};

export const ABOUT_TITLE = {
  TITLE_COMPLETE: 'Sobre mí',
  TITLE: ['Sobre', 'mí'],
  SUB: 'Mejor arquitectura, todo más fácil',
  DESCRIPTION: [
    {
      ID: '1-description',
      MAIN: true,
      TEXT: `Soy un <span class='highlight-text-description'>Desarrollador Full Stack</span> con más de ${YEARS_OF_EXPERIENCE} años de experiencia profesional (y ${YEARS_CODING} años programando) construyendo productos en producción para servicios financieros, comercio exterior y ciberseguridad. Trabajo con TypeScript en el frontend con Angular, React, Next.js y Nuxt, y en el backend con NestJS y Java/Spring Boot, en microservicios y monolitos sobre SQL Server y MySQL. Actualmente formo parte del equipo de Boutique Software, donde desarrollo plataformas web para servicios financieros e importaciones.`,
    },
    {
      ID: '2-description',
      MAIN: false,
      TEXT: "A lo largo de mi carrera migré una aplicación completa de SolidJS a React 18 en solo 3 meses sin interrumpir la operación. En Boutique Software participé en el onboarding digital de solicitudes de crédito para Daimler Truck Financial Services, que reemplazó un proceso manual en papel, desarrollé un motor de amortizaciones basado en el sistema francés como microservicio en NestJS y construí de punta a punta un sistema de gestión de importaciones con Nuxt y NestJS. Me apasiona la mejora continua, el código limpio y sostenible, y el desarrollo de experiencias digitales robustas. Siempre estoy en búsqueda de nuevos desafíos donde pueda aportar valor real, tanto técnico como humano."
    }
  ],
  TAGS: [
    {
      ID: '1-tag',
      ICON: 'code2',
      COLOR: 'text-purple-400',
      TEXT: "Desarrollador Full Stack"
    },
    {
      ID: '2-tag',
      ICON: 'heart',
      COLOR: 'text-red-400',
      TEXT: "Desarrollador Apasionado"
    },
    {
      ID: '3-tag',
      ICON: 'zap',
      COLOR: 'text-green-400',
      TEXT: "Migración de Código Legacy"
    },
    {
      ID: '4-tag',
      ICON: 'zap',
      COLOR: 'text-blue-400',
      TEXT: "Testing Automatizado"
    }
  ],
  BUTTON: {
    TEXT: "Descargar CV"
  }
};


export const CONTACT_FORM = {
  FORM: {
    ARIA_LABEL: 'Formulario de contacto'
  },
  FIELDS: {
    NAME: {
      LABEL: '01 \u2014 Nombre',
      PLACEHOLDER: 'Tu nombre completo',
      ARIA: 'Escribe tu nombre.',
      ERROR_MESSAGE: 'Por favor ingresa un nombre v\u00E1lido.'
    },
    EMAIL: {
      LABEL: '02 \u2014 Email',
      PLACEHOLDER: 'tu@email.com',
      ARIA: 'Escribe tu email.',
      ERROR_MESSAGE: 'Por favor ingresa un email v\u00E1lido.'
    },
    MESSAGE: {
      LABEL: '03 \u2014 Mensaje',
      PLACEHOLDER: 'Cu\u00E9ntame sobre tu proyecto o idea...',
      ARIA: 'Escribe tu mensaje.',
      ERROR_MESSAGE: 'Por favor ingresa un mensaje v\u00E1lido (hay un l\u00EDmite de 300 caracteres).'
    }
  },
  BUTTON: {
    TEXT: 'Enviar mensaje',
    SENDING: 'Enviando...',
    SENT: '\u00A1Mensaje enviado!'
  }
};

export const SERVICES: ServicesType = {
  TITLE_COMPLETE: 'Nuestro servicio',
  TITLE: ['Nuestro', 'Servicio'],
  SERVICES: [
    {
      ID: 'f0e8d8d83883',
      TITLE: 'Desarrollador Backend',
      ICON: '../../../../../assets/backend.webp',
    },
    {
      ID: 'd1cde22d3af',
      TITLE: 'Desarrollador Frontend',
      ICON: '../../../../../assets/web.webp',
    },
    {
      ID: 'dce9ba7f037',
      TITLE: 'Desarrollador de Base de Datos',
      ICON: '../../../../../assets/creator.webp',
    },
    {
      ID: 'df2103f1650c',
      TITLE: 'Arquitectura de Software',
      ICON: '../../../../../assets/architect.webp',
    },
  ],
};

export const HEADER: LinksHeaderArray = [
  { ID: '1-pp', LABEL: 'Experiencia', PATH: '', FRAGMENT: 'career' },
  { ID: '2-ap', LABEL: 'Personal', PATH: '', FRAGMENT: 'about-me' },
  { ID: '3-sp', LABEL: 'Proyectos', PATH: '', FRAGMENT: 'projects' },
  { ID: '4-cp', LABEL: 'Contacto', PATH: '', FRAGMENT: 'contact' },
];


export const FOOTER = {
  BRAND: {
    NAME: 'Marcos Lopez'
  },
  NAVIGATION: {
    TITLE: 'Navegación',
    LINKS: [
      { ID: 'nav-hero', LABEL: 'Inicio', FRAGMENT: 'hero', ARIA_LABEL: 'Ir al inicio' },
      { ID: 'nav-about', LABEL: 'Experiencia', FRAGMENT: 'career', ARIA_LABEL: 'Ir a experiencias' },
      { ID: 'nav-about', LABEL: 'Personal', FRAGMENT: 'about-me', ARIA_LABEL: 'Ir a acerca de' },
      { ID: 'nav-projects', LABEL: 'Proyectos', FRAGMENT: 'projects', ARIA_LABEL: 'Ir a Proyectos' },
      { ID: 'nav-contact', LABEL: 'Contacto', FRAGMENT: 'contact', ARIA_LABEL: 'Ir a Contacto' }
    ]
  },
  CONTACT: {
    LOCATION: {
      TEXT: 'Argentina, Misiones, Puerto Iguazú',
      ARIA_LABEL: 'Dirección'
    },
    EMAIL: {
      ALT: 'Email de Marcos Lopez',
      ARIA_LABEL: 'Email en formato de imagen, por seguridad'
    }
  },
  SOCIAL: {
    LINKEDIN: {
      URL: LINKEDIN_URL,
      TITLE: 'Botón al perfil de LinkedIn',
      CLASS: 'bg-[#0A66C2] fill-white p-[8px]'
    },
    GITHUB: {
      URL: GITHUB_URL,
      TITLE: 'Botón al perfil de Github',
      CLASS: 'bg-[#00000085] fill-white p-[4px]'
    },
    GMAIL: {
      URL: CONTACT_MAILTO,
      TITLE: 'Botón para enviar email',
      CLASS: 'bg-[#fff] p-[4px]'
    },
    CV: {
      URL: CV_VIEW_URL_ES,
      TITLE: 'Botón al CV',
      CLASS: 'cv p-[4px] font-bold bg-[var(--ml-red-100)]'
    }
  },
  COPYRIGHT: {
    TEXT: 'Desarrollado por Marcos Lopez - Última actualización 2026'
  }
};
