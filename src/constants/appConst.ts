import type { Projects } from '@app/models/projects';
import { YEARS_OF_EXPERIENCE, YEARS_CODING } from '@constants/experience';
import { CONTACT_MAILTO, CV_VIEW_URL_EN, GITHUB_URL, LINKEDIN_URL } from '@constants/links';
import type { ServicesType } from '@app/models/servicesTypes';
import type { LinksHeaderArray } from '@app/models/types';
import { combineProjectsWithTranslations, type ProjectTranslation } from './projectBase';

const PROJECTS_TRANSLATIONS: ProjectTranslation[] = [
  {
    ID: '1-project',
    DESC: 'Codefend is a webapp where I was working on the frontend, it allows companies to upload their resources, applications and request a pentest, codefend will provide a provider that scans these. It also offers intelligence services',
  },
  {
    ID: '2-project',
    DESC: 'Game Galaxy is a platform for classic games. This website, featuring popular games like Tetris, Snake and Tic-Tac-Toe, is built with Angular, CSS, canvas and RxJS. Game Galaxy offers users a modern twist on beloved retro games.',
  },
  {
    ID: '3-project',
    DESC: 'Book leaks. Explore the online bookstore, discover literary treasures in this incredible E-commerce of books, with a shopping cart, search engine, filters and login function, with an intuitive and interactive design.',
  },
  {
    ID: '4-project',
    DESC: 'NotAble is an online note-taking app that transcribes your voice into text in real time. Additionally, it uses AI to summarize your notes, highlighting the most important points. Developed with Next.js, it integrates Vercel AI SDK and Google Speech-to-Text to deliver a seamless and intelligent note-taking experience.',
  },
  {
    ID: '5-project',
    DESC: 'Invoicer++ is an open source application to generate commercial documents. It is an educational web platform created for students who are learning to create and manage business documents.',
  },
  {
    ID: '6-project',
    DESC: 'At Cash Now I was working on the backend, this webapp was created to allow people to request a loan from a financial institution, be able to manage the installments and have an interest calculator on the loans.',
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
  TITLE_COMPLETE: 'Experience Professional',
  TITLE: ['Experience', 'Professional']
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
      TEXT: `I’m a <span class='highlight-text-description'>Full Stack Developer</span> with over ${YEARS_OF_EXPERIENCE} years of professional experience (and ${YEARS_CODING} years coding) building modern, scalable, and user-centered applications. I specialize in JavaScript and TypeScript with Angular, React, and Next.js on the frontend, and NestJS and Java/Spring Boot on the backend. I’m currently part of the Boutique Software team, developing end-to-end financial and enterprise platforms with Angular and Spring Boot.`,
    },
    {
      ID: '2-description',
      MAIN: false,
      TEXT: "Throughout my career I’ve migrated a full SolidJS application to React 18 in just 3 months with zero downtime, and at Boutique Software I built the digital client onboarding, with a credit request module that digitized a previously manual process, and developed an amortization engine based on the French system. I’m passionate about continuous improvement, clean and sustainable code, and building robust digital experiences. I’m always looking for new challenges where I can deliver real value—technically and humanly."
    }
  ],
  TAGS: [
    {
      ID: '1-tag',
      ICON: 'code2',
      COLOR: 'text-purple-400',
      TEXT: "Frontend Specialist"
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
      TEXT: "Fast Learner"
    },
    {
      ID: '4-tag',
      ICON: 'zap',
      COLOR: 'text-blue-400',
      TEXT: "Team Player"
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
