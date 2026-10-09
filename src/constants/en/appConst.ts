import type { Projects } from '@app/models/projects';
import { YEARS_OF_EXPERIENCE, YEARS_CODING } from '@constants/experience';
import { CONTACT_MAILTO, CV_VIEW_URL_EN, GITHUB_URL, LINKEDIN_URL } from '@constants/links';
import type { ServicesType } from '@app/models/servicesTypes';
import type { LinksHeaderArray } from '@app/models/types';
import { combineProjectsWithTranslations, type ProjectTranslation } from '../projectBase';

const PROJECTS_TRANSLATIONS: ProjectTranslation[] = [
  {
    ID: '7-project',
    DESC: 'Quoting and credit platform for Daimler Truck Financial Services Mexico, with 600+ users and ~1,200 quotes per month. I took part in the digital credit application onboarding that replaced the paper-based process, developed the amortization engine as a NestJS microservice, and introduced automated testing with Vitest and Playwright.',
  },
  {
    ID: '1-project',
    DESC: 'Hybrid SaaS (web and Tauri/Rust desktop) connecting companies with cybersecurity providers. I migrated the full app (~17 views) from SolidJS to React 18 in 3 months with zero downtime, built the automated domain scanner and AI-generated PDF reports with the team, and cut project dependencies by 45%.',
  },
  {
    ID: '8-project',
    DESC: 'Import and certification management system for Importadora Portas, with ~40 active users and ~37 certifications per month. I built it end to end (Nuxt frontend with ~18 views and a NestJS API on MySQL), replacing the legacy system the client was using: product catalog, import file review, step-by-step IRAM and INAL certifications, and a status dashboard with Excel reports and automated emails.',
  },
  {
    ID: '2-project',
    DESC: 'Game Galaxy is a platform for classic games. This website, featuring popular games like Tetris, Snake and Tic-Tac-Toe, is built with Angular, CSS, canvas and RxJS. Game Galaxy offers users a modern twist on beloved retro games.',
  },
  {
    ID: '4-project',
    DESC: 'NotAble is an online note-taking app that transcribes your voice into text in real time. Additionally, it uses AI to summarize your notes, highlighting the most important points. Developed with Next.js, it integrates Vercel AI SDK and Google Speech-to-Text to deliver a seamless and intelligent note-taking experience.',
  },
  {
    ID: '5-project',
    DESC: 'Educational system for generating and recording business documents at E.P.E.T. N°4, used by over 40 students. I built the REST API with Java, Spring Boot and Spring Security following clean architecture, modeled the MySQL database (~20 tables), and fixed more than 10 issues during end-to-end testing with teachers and students.',
  },
];

export const PROJECTS_V2: Projects = combineProjectsWithTranslations(PROJECTS_TRANSLATIONS);

export const PROJECTS_TITLE = {
  TITLE_COMPLETE: 'Some projects',
  TITLE: ['Some', 'Projects'],
  TOOLTIP: 'Go to repository'
};

export const STUDIES_TITLE = {
  TITLE_COMPLETE: 'My studies',
  TITLE: ['My', 'Studies']
};

export const EXPERIENCE_TITLE = {
  TITLE_COMPLETE: 'My Career',
  TITLE: ['My', 'Career']
};

export const CONTACT_TITLE = {
  TITLE_COMPLETE: "Let's talk about your next project",
  TITLE: ["Let's talk about your", 'next project'],
  SUB: "I'm open to new opportunities and collaborations. Tell me your idea and let's build something amazing together.",
  BADGE: 'Contact',
  EMAIL_LABEL: 'Email',
};

export const ABOUT_TITLE = {
  TITLE_COMPLETE: 'About me',
  TITLE: ['About', 'me'],
  SUB: 'Better architecture, easier everything',
  DESCRIPTION: [
    {
      ID: '1-description',
      MAIN: true,
      TEXT: `I’m a <span class='highlight-text-description'>Full Stack Developer</span> with over ${YEARS_OF_EXPERIENCE} years of professional experience (and ${YEARS_CODING} years coding) building production products for financial services, foreign trade, and cybersecurity. I work with TypeScript on the frontend with Angular, React, Next.js, and Nuxt, and on the backend with NestJS and Java/Spring Boot, in microservices and monoliths on SQL Server and MySQL. I’m currently part of the Boutique Software team, building web platforms for financial services and imports.`,
    },
    {
      ID: '2-description',
      MAIN: false,
      TEXT: "Throughout my career I’ve migrated a full SolidJS application to React 18 in just 3 months with zero downtime. At Boutique Software I took part in the digital credit application onboarding for Daimler Truck Financial Services, which replaced a paper-based process, developed an amortization engine based on the French system as a NestJS microservice, and built an import management system end to end with Nuxt and NestJS. I’m passionate about continuous improvement, clean and sustainable code, and building robust digital experiences. I’m always looking for new challenges where I can deliver real value—technically and humanly."
    }
  ],
  TAGS: [
    {
      ID: '1-tag',
      ICON: 'code2',
      COLOR: 'text-purple-400',
      TEXT: "Full Stack Developer"
    },
    {
      ID: '2-tag',
      ICON: 'heart',
      COLOR: 'text-red-400',
      TEXT: "Passionate Developer"
    },
    {
      ID: '3-tag',
      ICON: 'zap',
      COLOR: 'text-green-400',
      TEXT: "Legacy Code Migration"
    },
    {
      ID: '4-tag',
      ICON: 'zap',
      COLOR: 'text-blue-400',
      TEXT: "Automated Testing"
    }
  ],
  BUTTON: {
    TEXT: "Download CV"
  }
};

export const CONTACT_FORM = {
  FORM: {
    ARIA_LABEL: 'Contact Form'
  },
  FIELDS: {
    NAME: {
      LABEL: '01 — Name',
      PLACEHOLDER: 'Your full name',
      ARIA: 'Write your name.',
      ERROR_MESSAGE: 'Please enter a valid name.'
    },
    EMAIL: {
      LABEL: '02 — Email',
      PLACEHOLDER: 'your@email.com',
      ARIA: 'Write your email.',
      ERROR_MESSAGE: 'Please enter a valid email.'
    },
    MESSAGE: {
      LABEL: '03 — Message',
      PLACEHOLDER: 'Tell me about your project or idea...',
      ARIA: 'Write your message.',
      ERROR_MESSAGE: 'Please enter a valid message (there is a 300 character limit).'
    }
  },
  BUTTON: {
    TEXT: 'Send message',
    SENDING: 'Sending...',
    SENT: 'Message sent!'
  }
};

export const SERVICES: ServicesType = {
  TITLE_COMPLETE: 'Our service',
  TITLE: ['Our', 'Service'],
  SERVICES: [
    {
      ID: 'f0e8d8d83883',
      TITLE: 'Backend Developer',
      ICON: '../../../../../assets/backend.webp',
    },
    {
      ID: 'd1cde22d3af',
      TITLE: 'Frontend Developer',
      ICON: '../../../../../assets/web.webp',
    },
    {
      ID: 'dce9ba7f037',
      TITLE: 'Database Developer',
      ICON: '../../../../../assets/creator.webp',
    },
    {
      ID: 'df2103f1650c',
      TITLE: 'Software Architecture',
      ICON: '../../../../../assets/architect.webp',
    },
  ],
};

export const HEADER: LinksHeaderArray = [
  { ID: '3-sp', LABEL: 'Career', PATH: '', FRAGMENT: 'career' },
  { ID: '2-ap', LABEL: 'About', PATH: '', FRAGMENT: 'about-me' },
  { ID: '1-pp', LABEL: 'Projects', PATH: '', FRAGMENT: 'projects' },
  { ID: '4-cp', LABEL: 'Contact', PATH: '', FRAGMENT: 'contact' },
];

export const FOOTER = {
  BRAND: {
    NAME: 'Marcos Lopez'
  },
  NAVIGATION: {
    TITLE: 'Navigation',
    LINKS: [
      { ID: 'nav-hero', LABEL: 'Hero', FRAGMENT: 'hero', ARIA_LABEL: 'Go to hero' },
      { ID: 'nav-about', LABEL: 'Career', FRAGMENT: 'career', ARIA_LABEL: 'Go to career' },
      { ID: 'nav-about', LABEL: 'About', FRAGMENT: 'about-me', ARIA_LABEL: 'Go to About' },
      { ID: 'nav-projects', LABEL: 'Projects', FRAGMENT: 'projects', ARIA_LABEL: 'Go to Projects' },
      { ID: 'nav-contact', LABEL: 'Contact', FRAGMENT: 'contact', ARIA_LABEL: 'Go to Contact' }
    ]
  },
  CONTACT: {
    LOCATION: {
      TEXT: 'Argentina, Misiones, Puerto Iguazú',
      ARIA_LABEL: 'Address'
    },
    EMAIL: {
      ALT: 'Marcos Lopez Email',
      ARIA_LABEL: 'Email in image format, for security'
    }
  },
  SOCIAL: {
    LINKEDIN: {
      URL: LINKEDIN_URL,
      TITLE: 'Button to linkedIn profile',
      CLASS: 'bg-[#0A66C2] fill-white p-[8px]'
    },
    GITHUB: {
      URL: GITHUB_URL,
      TITLE: 'Button to github profile',
      CLASS: 'bg-[#00000085] fill-white p-[4px]'
    },
    GMAIL: {
      URL: CONTACT_MAILTO,
      TITLE: 'Button for send email',
      CLASS: 'bg-[#fff] p-[4px]'
    },
    CV: {
      URL: CV_VIEW_URL_EN,
      TITLE: 'Button to CV',
      CLASS: 'cv p-[4px] font-bold bg-[var(--ml-red-100)]'
    }
  },
  COPYRIGHT: {
    TEXT: 'Developed by Marcos Lopez - Last update 2026'
  }
};
