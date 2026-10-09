import type { BentoUser, User } from '@app/models/types';
import { YEARS_OF_EXPERIENCE, YEARS_OF_EXPERIENCE_PADDED } from '@constants/experience';
import {
  CONTACT_EMAIL,
  CV_DOWNLOAD_URL_ES,
  CV_VIEW_URL_ES,
  GITHUB_URL,
  LINKEDIN_URL,
  STACKOVERFLOW_URL,
} from '@constants/links';

//General user data
export const USER: User = {
  name: 'Marcos',
  lastname: 'Lopez',
  fullName: 'Marcos Lopez',
  email: CONTACT_EMAIL,
  motto:
    'Construyo productos en producción para servicios financieros, comercio exterior y ciberseguridad.',
  role: 'Desarrollador Full Stack',
  cv: CV_VIEW_URL_ES,
  linkedIn: LINKEDIN_URL,
  gitHub: GITHUB_URL,
  stackOverflow: STACKOVERFLOW_URL,
  downloadCv: CV_DOWNLOAD_URL_ES,
  viewResume: 'Ver currículum',
  shortResume: 'Currículum',
  photo: '../../../../assets/utils/FOTO_CV.webp',
  heroCTA: {
    talk: 'Hablemos',
    downloadCV: 'Descargar CV',
  },
  statusBadge: 'Disponible para proyectos',
  scrollHint: 'Explorar',
};

//User data to complete the about bento
export const ABOUT_USER: BentoUser = {
  yearsExpertice: YEARS_OF_EXPERIENCE_PADDED,
  experticeTitle: 'Años de experiencia',
  githubBento: {
    TITLE: 'Más proyectos',
    SUB: 'Puedes encontrar más de mis proyectos en github',
    BUTTON: 'Ir a github',
  },
  experiences: [
    {
      ID: '0-exp',
      COMPANY: 'Boutique Software',
      ROLE: 'Desarrollador Full Stack',
      TIME: 'Diciembre 2024 - Presente',
      DESCRIPTION:
        'Consultora de software, en remoto. Para Daimler Truck Financial Services México participé en el onboarding digital de solicitudes de crédito, desarrollé el motor de amortizaciones como microservicio en NestJS e introduje testing con Vitest y Playwright. Para IMPortas construí el sistema de punta a punta con Nuxt y NestJS, y en una plataforma tipo red social migré funcionalidades de Ruby on Rails a NestJS.',
      STACK: ['Angular', 'NestJS', 'Spring Boot', 'Nuxt'],
    },
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Desarrollador Frontend & Desktop (Freelance)',
      TIME: 'Enero 2025 - Noviembre 2025',
      DESCRIPTION:
        'Proyectos puntuales en paralelo a mi rol principal: construí el scaffolding de la subaplicación del módulo de inteligencia, resolví fallas de una aplicación de chat con IA y creé los pipelines de GitHub Actions que generan los instalables firmados, actualizando la firma de certificado OV a EV.',
      STACK: ['React', 'Tauri', 'GitHub Actions'],
    },
    {
      ID: '2-exp',
      COMPANY: 'Codefend',
      ROLE: 'Desarrollador Frontend & Desktop',
      TIME: 'Diciembre 2023 - Diciembre 2024',
      DESCRIPTION:
        'SaaS híbrido (web y escritorio con Tauri/Rust) que conecta empresas con proveedores de ciberseguridad. Migré la app completa (~17 vistas) de SolidJS a React 18 en 3 meses sin interrumpir la operación, desarrollé funcionalidades de escritorio con Tauri y Rust, reduje un 45% las dependencias y automaticé los despliegues con GitHub Actions.',
      STACK: ['React', 'Tauri', 'Rust'],
    },
    {
      ID: '3-exp',
      COMPANY: 'No country',
      ROLE: 'Desarrollador Full Stack (Simulación laboral)',
      TIME: 'Junio 2023 - Diciembre 2023',
      DESCRIPTION:
        'Desarrollé 3 aplicaciones web (KlowHub, CollabZone y una librería online) en equipos de 5 a 10 personas, usando React, Next.js, Angular, NestJS y Spring Boot. Diseñé la protección de video HLS de KlowHub, construí un espacio 2D en tiempo real con Phaser y WebSockets, y alcancé 60% de cobertura de tests en módulos críticos.',
      STACK: ['Angular', 'React', 'NestJS', 'Spring Boot'],
    },
    {
      ID: '4-exp',
      COMPANY: 'Facturador++ (E.P.E.T. N°4)',
      ROLE: 'Desarrollador Backend (Pasantía)',
      TIME: 'Enero 2022 - Noviembre 2022',
      DESCRIPTION:
        'Desarrollé la API REST de Facturador++, un sistema educativo de documentos comerciales de la EPET N°4 usado por más de 40 alumnos, con Java, Spring Boot, Spring Security y arquitectura limpia. Diseñé la base de datos MySQL (~20 tablas) y desplegué con Docker en el servidor de la institución.',
      STACK: ['Spring Boot', 'MySQL', 'Docker'],
    },
  ],
  profile: {
    //URL o RUTA de la imagen
    photo: '../../../../assets/utils/FOTO_CV.webp',
    //false aún no funciona
    isAvalaible: true,
    availableText: 'Disponible para trabajo',
    notAvailableText: 'No disponible',
    doYouLikeCoffee: true,
    country: 'Argentina',
    qualification: 'Técnico en informática',
    idioms: 'Español (nativo) e Inglés (técnico)',
    complement: 'Un buen chico',
    resume: 'Currículum',
    motto: 'Me encanta un café',
  },
  whoIamTitle: '¿Quién soy?',
  whoIam:
    `Desarrollador Full Stack con más de ${YEARS_OF_EXPERIENCE} años de experiencia construyendo productos en producción para servicios financieros, comercio exterior y ciberseguridad. Trabajo con TypeScript en el frontend (Angular, React, Next.js, Nuxt) y en el backend con NestJS y Java/Spring Boot, en microservicios y monolitos sobre SQL Server y MySQL. Experiencia en migración de código legacy, CI/CD con GitHub Actions y testing automatizado.`,
  studies: [
    {
      ID: 'c4a7e2d91b3f',
      DEGREE: 'Ingeniería en Informática',
      STRONG: 'Ingeniería',
      STATE: 'Universidad Gastón Dachary - 1 año cursado (2023)',
      DESCRIPTION:
        'Cursé el primer año de la carrera de Ingeniería en Informática',
    },
    {
      ID: 'b00fb15c9503',
      DEGREE: 'Técnico en Informática Profesional y Personal',
      STRONG: 'Informática',
      STATE: "EPET N°4 'O.E.A' - Finalizado (2017 - 2022)",
      DESCRIPTION:
        'Aprendí los fundamentos de programación, robótica, conceptos de emprendimiento, diseño y software',
    },
    {
      ID: 'bf39334cc71f',
      DEGREE: 'Oracle One Next',
      STRONG: 'Oracle',
      STATE: 'Alura Latam - Finalizado (2023)',
      DESCRIPTION:
        'En este programa aprendí conceptos esenciales de arquitectura frontend, mobile first y React',
    },
    {
      ID: 'fdeb87d4af5',
      DEGREE: 'Más Cursos',
      STRONG: 'Cursos',
      STATE: 'Udemy - Finalizado',
      DESCRIPTION:
        'Cursos de Global Mentoring para Java, Spring, Angular, Html, Css, TypeScript. Curso de Java Funcional de MitoCode, Curso de Spring Security de Amigos Code',
    },
  ],
  stackTitle: 'Stack',
  bentoCTA: {
    TITLE: 'Trabajemos juntos',
    BUTTON: 'Contáctame',
  },
};
