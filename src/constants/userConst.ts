import type { BentoUser, User } from '@app/models/types';
import { YEARS_OF_EXPERIENCE, YEARS_OF_EXPERIENCE_PADDED } from '@constants/experience';
import {
  CONTACT_EMAIL,
  CV_DOWNLOAD_URL_EN,
  CV_VIEW_URL_EN,
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
    'I build production-ready products for financial services, foreign trade, and cybersecurity.',
  role: 'Full Stack Developer',
  cv: CV_VIEW_URL_EN,
  linkedIn: LINKEDIN_URL,
  gitHub: GITHUB_URL,
  stackOverflow: STACKOVERFLOW_URL,
  downloadCv: CV_DOWNLOAD_URL_EN,
  viewResume: 'View resume',
  shortResume: 'Resume',
  photo: 'assets/utils/FOTO_CV.webp',
  heroCTA: {
    talk: "Let's Talk",
    downloadCV: 'Download CV',
  },
  statusBadge: 'Available for projects',
  scrollHint: 'Explore',
};

//User data to complete the about bento
export const ABOUT_USER: BentoUser = {
  yearsExpertice: YEARS_OF_EXPERIENCE_PADDED,
  experticeTitle: 'Years of experience',
  githubBento: {
    TITLE: 'More projects',
    SUB: "You can find more of my projects on github",
    BUTTON: 'Go to github',
  },
  experiences: [
    {
      ID: '0-exp',
      COMPANY: 'Boutique Software',
      ROLE: 'Full Stack Developer',
      TIME: 'December 2024 - Present',
      DESCRIPTION:
        'Remote software consultancy. For Daimler Truck Financial Services Mexico I took part in the digital credit application onboarding, developed the amortization engine as a NestJS microservice, and introduced testing with Vitest and Playwright. For IMPortas I built the system end to end with Nuxt and NestJS, and on a social network platform I migrated features from Ruby on Rails to NestJS.',
      STACK: ['Angular', 'NestJS', 'Spring Boot', 'Nuxt'],
    },
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Frontend & Desktop Developer (Freelance)',
      TIME: 'January 2025 - November 2025',
      DESCRIPTION:
        'Specific projects alongside my main role: I built the scaffolding of the intelligence module sub-app, fixed issues in an AI chat app, and created the GitHub Actions pipelines that produce the signed installers, upgrading certificate signing from OV to EV.',
      STACK: ['React', 'Tauri', 'GitHub Actions'],
    },
    {
      ID: '2-exp',
      COMPANY: 'Codefend',
      ROLE: 'Frontend & Desktop Developer',
      TIME: 'December 2023 - December 2024',
      DESCRIPTION:
        'Hybrid SaaS (web and Tauri/Rust desktop) connecting companies with cybersecurity providers. I migrated the full app (~17 views) from SolidJS to React 18 in 3 months with zero downtime, built desktop features with Tauri and Rust, cut dependencies by 45%, and automated deployments with GitHub Actions.',
      STACK: ['React', 'Tauri', 'Rust'],
    },
    {
      ID: '3-exp',
      COMPANY: 'No country',
      ROLE: 'Full Stack Developer (Job simulation)',
      TIME: 'June 2023 - December 2023',
      DESCRIPTION:
        "I built 3 web apps (KlowHub, CollabZone and an online bookstore) in teams of 5 to 10, using React, Next.js, Angular, NestJS and Spring Boot. I designed KlowHub's HLS video protection, built a realtime 2D space with Phaser and WebSockets, and reached 60% test coverage on critical modules.",
      STACK: ['Angular', 'React', 'NestJS', 'Spring Boot'],
    },
    {
      ID: '4-exp',
      COMPANY: 'Facturador++ (E.P.E.T. N°4)',
      ROLE: 'Backend Developer (Internship)',
      TIME: 'January 2022 - November 2022',
      DESCRIPTION:
        'I developed the REST API of Facturador++, an educational business-documents system for EPET N°4 used by over 40 students, with Java, Spring Boot, Spring Security and clean architecture. I designed the MySQL database (~20 tables) and deployed it with Docker on the institution’s own server.',
      STACK: ['Spring Boot', 'MySQL', 'Docker'],
    },
  ],
  profile: {
    //URL or PATH to the img
    photo: '../../../../assets/utils/FOTO_CV.webp',
    //false still doesn't work
    isAvalaible: true,
    availableText: 'Available for work',
    notAvailableText: 'Not available',
    doYouLikeCoffee: true,
    country: 'Argentina',
    qualification: 'IT technician',
    idioms: 'Spanish (native) & English (technical)',
    complement: 'A good boy',
    resume: 'Resume',
    motto: "I love a coffee"
  },
  whoIamTitle: 'Who I am?',
  whoIam:
    `Full Stack Developer with over ${YEARS_OF_EXPERIENCE} years of experience building production products for financial services, foreign trade and cybersecurity. I work with TypeScript on the frontend (Angular, React, Next.js, Nuxt) and on the backend with NestJS and Java/Spring Boot, in microservices and monoliths on SQL Server and MySQL. Experienced in legacy code migration, CI/CD with GitHub Actions and automated testing.`,
  studies: [
    {
      ID: 'c4a7e2d91b3f',
      DEGREE: 'Computer Engineering',
      STRONG: 'Engineering',
      STATE: 'Gastón Dachary University - 1 year completed (2023)',
      DESCRIPTION:
        'I completed the first year of the Computer Engineering degree',
    },
    {
      ID: 'b00fb15c9503',
      DEGREE: 'IT technician',
      STRONG: 'IT',
      STATE: "E.P.E.T N°4 'O.E.A' - Finalized (2017 - 2022)",
      DESCRIPTION:
        'I learned the basics of programming, robotics, entrepreneurship concepts, design and software',
    },
    {
      ID: 'bf39334cc71f',
      DEGREE: 'Oracle One Next',
      STRONG: 'Oracle',
      STATE: 'Alura Latam - Finalized (2023)',
      DESCRIPTION:
        'In this program I learned essential concepts of front end architecture, mobile first and react',
    },
    {
      ID: 'fdeb87d4af5',
      DEGREE: 'More Courses',
      STRONG: 'Courses',
      STATE: 'Udemy - Finalized',
      DESCRIPTION:
        'Global Mentoring Courses for Java, Spring, Angular, Html, Css, TypeScript. MitoCode Functional Java Course, Amigos Code Spring Security Course',
    },
  ],
  stackTitle: 'Stack',
  bentoCTA: {
    TITLE: 'Let’s Work Together',
    BUTTON: 'Contact me',
  }
};
