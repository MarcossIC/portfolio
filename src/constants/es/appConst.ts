import type { Projects } from '@app/models/projects';
import type { ServicesType } from '@app/models/servicesTypes';
import type { LinksHeaderArray } from '@app/models/types';
import { combineProjectsWithTranslations, type ProjectTranslation } from '../projectBase';

const PROJECTS_TRANSLATIONS: ProjectTranslation[] = [
  {
    ID: '1-project',
    DESC: 'Codefend es una webapp donde trabajé en el frontend, permite a las empresas subir sus recursos, aplicaciones y solicitar un pentest, codefend proporcionará un proveedor que los escanee. También ofrece servicios de inteligencia',
  },
  {
    ID: '2-project',
    DESC: 'Game Galaxy es una plataforma para juegos clásicos. Este sitio web, que incluye juegos populares como Tetris, Snake y Tic-Tac-Toe, está construido con Angular, CSS, canvas y RxJS. Game Galaxy ofrece a los usuarios un toque moderno a los queridos juegos retro.',
  },
  {
    ID: '3-project',
    DESC: 'Book leaks. Explora la librería online, descubre tesoros literarios en este increíble E-commerce de libros, con carrito de compras, motor de búsqueda, filtros y función de login, con un diseño intuitivo e interactivo.',
  },
  {
    ID: '4-project',
    DESC: 'NotAble es una aplicación de toma de notas online que transcribe tu voz a texto en tiempo real. Además, utiliza IA para resumir tus notas, destacando los puntos más importantes. Desarrollado con Next.js, integra Vercel AI SDK y Google Speech-to-Text para brindar una experiencia de toma de notas fluida e inteligente.',
  },
  {
    ID: '5-project',
    DESC: 'Invoicer++ es una aplicación de código abierto para generar documentos comerciales. Es una plataforma web educativa creada para estudiantes que están aprendiendo a crear y gestionar documentos empresariales.',
  },
  {
    ID: '6-project',
    DESC: 'En Cash Now trabajé en el backend, esta webapp fue creada para permitir a las personas solicitar un préstamo de una institución financiera, poder gestionar las cuotas y tener una calculadora de intereses sobre los préstamos.',
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

export const CONTACT_TITLE = {
  TITLE_COMPLETE: 'Ponte en contacto',
  TITLE: ['Ponte en', 'contacto'],
  SUB: 'No dudes en enviarme un mensaje para cualquier consulta o proyecto'
};

export const ABOUT_TITLE = {
  TITLE_COMPLETE: 'Acerca de',
  TITLE: ['Acerca de', 'mí'],
  SUB: 'Mejor arquitectura, todo más fácil'
};

export const CONTACT_FORM = {
  FORM: {
    ARIA_LABEL: 'Formulario de contacto'
  },
  FIELDS: {
    NAME: {
      LABEL: 'Nombre',
      ARIA: 'Escribe tu nombre.',
      ERROR_MESSAGE: 'Por favor ingresa un nombre válido.'
    },
    EMAIL: {
      LABEL: 'Email',
      ARIA: 'Escribe tu email.',
      ERROR_MESSAGE: 'Por favor ingresa un email válido.'
    },
    MESSAGE: {
      LABEL: 'Escribe tu mensaje...',
      ARIA: 'Escribe tu mensaje.',
      ERROR_MESSAGE: 'Por favor ingresa un mensaje válido (hay un límite de 300 caracteres).'
    }
  },
  BUTTON: {
    TEXT: 'Enviar'
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
  { ID: '1-pp', LABEL: 'Proyectos', PATH: '', FRAGMENT: 'projects' },
  { ID: '2-ap', LABEL: 'Acerca de', PATH: '', FRAGMENT: 'about' },
  { ID: '3-sp', LABEL: 'Estudios', PATH: '', FRAGMENT: 'studies' },
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
      { ID: 'nav-projects', LABEL: 'Proyectos', FRAGMENT: 'projects', ARIA_LABEL: 'Ir a Proyectos' },
      { ID: 'nav-about', LABEL: 'Acerca de', FRAGMENT: 'about', ARIA_LABEL: 'Ir a Acerca de' },
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
      URL: 'https://www.linkedin.com/in/marcos-lopez-dev',
      TITLE: 'Botón al perfil de LinkedIn',
      CLASS: 'bg-[#0A66C2] fill-white p-[8px]'
    },
    GITHUB: {
      URL: 'https://github.com/MarcossIC',
      TITLE: 'Botón al perfil de Github',
      CLASS: 'bg-[#00000085] fill-white p-[4px]'
    },
    GMAIL: {
      URL: 'mailto:marcoslopezdev18@gmail.com?subject=Hey%20Marcos%20how%20are%20you',
      TITLE: 'Botón para enviar email',
      CLASS: 'bg-[#fff] p-[4px]'
    },
    CV: {
      URL: 'https://drive.google.com/file/d/1znfQJffUhuawHnsKnSUGa6aGtnA9q1OY/view?usp=sharing',
      TITLE: 'Botón al CV',
      CLASS: 'cv p-[4px] font-bold bg-[var(--ml-red-100)]'
    }
  },
  COPYRIGHT: {
    TEXT: 'Desarrollado por Marcos Lopez - Última actualización 2025'
  }
};
