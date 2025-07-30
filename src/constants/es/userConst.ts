import type { BentoUser, User } from '@app/models/types';

//General user data
export const USER: User = {
  name: 'Marcos',
  lastname: 'Lopez',
  fullName: 'Marcos Lopez',
  email: 'marcoslopezdev18@gmail.com',
  motto:
    'Espero compartir mi trayectoria por el mundo de TI y que podamos trabajar juntos',
  role: 'Desarrollador de software',
  cv: 'https://drive.google.com/file/d/1fxazKwrFJ91R2-3bIAKGsu4gkfaXB-iJ/view?usp=sharing',
  linkedIn: 'https://www.linkedin.com/in/marcos-lopez-dev',
  gitHub: 'https://github.com/MarcossIC',
  stackOverflow: 'https://es.stackoverflow.com/users/301174/marcos-lopez',
  downloadCv:
    'https://drive.usercontent.google.com/u/2/uc?id=1fxazKwrFJ91R2-3bIAKGsu4gkfaXB-iJ&export=download',
  viewResume: 'Ver currículum',
  shortResume: 'Currículum',
};

//User data to complete the about bento
export const ABOUT_USER: BentoUser = {
  yearsExpertice: '02',
  experticeTitle: 'Años de experiencia',
  experienceTitle: 'Experiencia',
  githubBento: {
    TITLE: 'Más proyectos',
    SUB: "Puedes encontrar más de mis proyectos en github",
    BUTTON: 'Ir a github',
  },
  experiences: [
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Desarrollador Front end',
      TIME: 'Enero 2024 - Octubre 2024',
      DESCRIPTION:
        'En Codefend, lideré el desarrollo frontend de una plataforma SaaS que conecta empresas con proveedores de ciberseguridad, migrando de SolidJS a React, optimizando la arquitectura, reduciendo dependencias y colaborando en la implementación de APIs de inteligencia de seguridad.',
    },
    {
      ID: '2-exp',
      COMPANY: 'No country',
      ROLE: 'Desarrollador Full stack',
      TIME: 'Junio 2023 - Marzo 2024',
      DESCRIPTION:
        'Trabajé como desarrollador frontend en equipos multidisciplinarios durante hackathons, colaborando en diseño, definición de requerimientos, arquitectura, testing e implementaciones avanzadas como animaciones con Framer Motion y entornos 2D con Phaser.',
    },
    {
      ID: '3-exp',
      COMPANY: 'Facturador++',
      ROLE: 'Desarrollador Back-end',
      TIME: 'Enero 2022 - Noviembre 2022',
      DESCRIPTION:
        'Desarrollé Facturador++, una aplicación para la escuela EPET para mejorar la experiencia de aprendizaje de los estudiantes de economía, trabajando en la API, seguridad, diseño de base de datos MySQL, testing funcional y despliegue con Docker en Google Cloud.',
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
    motto: "Me encanta un café"
  },
  whoIamTitle: '¿Quién soy?',
  whoIam:
    'Desarrollador con más de 2 años de experiencia. Habilidades en desarrollo backend con Spring Boot y desarrollo frontend con React y Angular. Capacidad para optimizar procesos de desarrollo, crear soluciones escalables. Experiencia trabajando con metodologías ágiles, con un enfoque constante en la mejora continua.',
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
  }
};
