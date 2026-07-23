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
    'Espero compartir mi trayectoria por el mundo de TI y que podamos trabajar juntos',
  role: 'Desarrollador de software',
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
      ROLE: 'Desarrollador de Software',
      TIME: 'Diciembre 2024 - Presente',
      DESCRIPTION:
        'En Boutique Software construyo plataformas web de extremo a extremo para servicios financieros e importación con Angular y Spring Boot. Desarrollé un onboarding digital de clientes, un motor de amortización basado en el sistema francés e introduje testing con Vitest y Playwright.',
      STACK: ['Angular', 'Spring Boot', 'Docker'],
    },
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Desarrollador de Software',
      TIME: 'Diciembre 2023 - Noviembre 2025',
      DESCRIPTION:
        'En Codefend lideré el frontend de un SaaS híbrido (web y escritorio con Tauri/Rust) que conecta empresas con proveedores de ciberseguridad. Migré la app completa de SolidJS a React 18 en 3 meses sin cortar la operación, reduje un 45% las dependencias y automaticé el CI/CD.',
      STACK: ['React', 'Tauri', 'Rust'],
    },
    {
      ID: '2-exp',
      COMPANY: 'No country',
      ROLE: 'Desarrollador Full stack',
      TIME: 'Junio 2023 - Marzo 2024',
      DESCRIPTION:
        'En No Country construí 5 aplicaciones web con clientes reales en equipos multidisciplinarios de 5 a 10 personas, usando React, Next.js, Angular, NestJS y Spring Boot. Diseñé la seguridad de video HLS de KlowHub, desarrollé un espacio 2D en tiempo real con Phaser y sumé testing.',
      STACK: ['Angular', 'React', 'Spring Boot', 'GCP'],
    },
    {
      ID: '3-exp',
      COMPANY: 'Facturador++',
      ROLE: 'Desarrollador Back-end',
      TIME: 'Enero 2022 - Noviembre 2022',
      DESCRIPTION:
        'Desarrollé Facturador++, una aplicación para la escuela EPET para mejorar la experiencia de aprendizaje de los estudiantes de economía, trabajando en la API, seguridad, diseño de base de datos MySQL, testing funcional y despliegue con Docker en Google Cloud.',
      STACK: ['Spring Boot'],
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
    idioms: 'Español e Inglés',
    complement: 'Un buen chico',
    resume: 'Currículum',
    motto: 'Me encanta un café',
  },
  whoIamTitle: '¿Quién soy?',
  whoIam:
    `Desarrollador con más de ${YEARS_OF_EXPERIENCE} años de experiencia. Habilidades en desarrollo backend con Spring Boot y NestJS, y frontend con React, Angular y Next.js. Capacidad para optimizar procesos de desarrollo y crear soluciones escalables. Experiencia trabajando con metodologías ágiles, con un enfoque constante en la mejora continua.`,
  studies: [
    {
      ID: 'b00fb15c9503',
      DEGREE: 'Técnico en informática',
      STRONG: 'Informática',
      STATE: "EPET N4 'O.E.A' - Finalizado",
      DESCRIPTION:
        'Aprendí los fundamentos de programación, robótica, conceptos de emprendimiento, diseño y software',
    },
    {
      ID: 'bf39334cc71f',
      DEGREE: 'Oracle One Next',
      STRONG: 'Oracle',
      STATE: 'Alura Latam - Finalizado',
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
