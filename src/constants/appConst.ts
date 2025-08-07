import type { Projects } from '@app/models/projects';
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

export const CONTACT_TITLE = {
  TITLE_COMPLETE: 'Get in touch',
  TITLE: ['Get', 'in touch'],
  SUB: 'Don\'t hesitate to send me a message for any inquiry or project'
};

export const ABOUT_TITLE = {
  TITLE_COMPLETE: 'About me',
  TITLE: ['About', 'me'],
  SUB: 'Better architecture, easier everything',
  DESCRIPTION: [
    {
      ID: '1-description',
      MAIN: true,
      TEXT: "I’m a <span class='highlight-text-description'>Full Stack Developer</span> with over 3 years of professional experience building modern, scalable, and user-centered applications. I’ve worked across both frontend and backend, using technologies like Angular, React, Next.js, Spring Boot, and NestJS. I’m currently part of the Boutique Software team, where I develop end-to-end solutions using Angular and Spring Boot.",
    },
    {
      ID: '2-description',
      MAIN: false,
      TEXT: "Throughout my career, I’ve led tech migrations, optimized frontend architectures, collaborated with multidisciplinary teams, and actively participated in hackathons and collaborative projects. I’m passionate about continuous improvement, clean and sustainable code, and creating robust digital experiences. I’m always looking for new challenges where I can deliver real value—technically and humanly."
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
      LABEL: 'Name',
      ARIA: 'Write your name.',
      ERROR_MESSAGE: 'Please enter a valid name.'
    },
    EMAIL: {
      LABEL: 'Email',
      ARIA: 'Write your email.',
      ERROR_MESSAGE: 'Please enter a valid email.'
    },
    MESSAGE: {
      LABEL: 'Write your message...',
      ARIA: 'Write your message.',
      ERROR_MESSAGE: 'Please enter a valid message (there is a 300 character limit).'
    }
  },
  BUTTON: {
    TEXT: 'Send'
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
  { ID: '1-pp', LABEL: 'Projects', PATH: '', FRAGMENT: 'projects' },
  { ID: '2-ap', LABEL: 'About', PATH: '', FRAGMENT: 'about' },
  { ID: '3-sp', LABEL: 'Studies', PATH: '', FRAGMENT: 'studies' },
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
      { ID: 'nav-projects', LABEL: 'Projects', FRAGMENT: 'projects', ARIA_LABEL: 'Go to Projects' },
      { ID: 'nav-about', LABEL: 'About', FRAGMENT: 'about', ARIA_LABEL: 'Go to About' },
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
      URL: 'https://www.linkedin.com/in/marcos-lopez-dev',
      TITLE: 'Button to linkedIn profile',
      CLASS: 'bg-[#0A66C2] fill-white p-[8px]'
    },
    GITHUB: {
      URL: 'https://github.com/MarcossIC',
      TITLE: 'Button to github profile',
      CLASS: 'bg-[#00000085] fill-white p-[4px]'
    },
    GMAIL: {
      URL: 'mailto:marcoslopezdev18@gmail.com?subject=Hey%20Marcos%20how%20are%20you',
      TITLE: 'Button for send email',
      CLASS: 'bg-[#fff] p-[4px]'
    },
    CV: {
      URL: 'https://drive.google.com/file/d/1znfQJffUhuawHnsKnSUGa6aGtnA9q1OY/view?usp=sharing',
      TITLE: 'Button to CV',
      CLASS: 'cv p-[4px] font-bold bg-[var(--ml-red-100)]'
    }
  },
  COPYRIGHT: {
    TEXT: 'Developed by Marcos Lopez - Last update 2025'
  }
};
