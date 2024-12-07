import type { Projects } from '@app/models/projects';
import type { ServicesType } from '@app/models/servicesTypes';
import type { LinksHeaderArray } from '@app/models/types';

export const PROJECTS_V2: Projects = [
  {
    ID: '1-project',
    NAME: 'Codefend',
    IMG: '../../../../assets/projects/CODEFEND-PROJECT.webp',
    REPOSITORY: 'https://github.com/codefen/codefend-user',
    DESC: 'Codefend is a webapp where I was working on the frontend, it allows companies to upload their resources, applications and request a pentest, codefend will provide a provider that scans these. It also offers intelligence services',
    ICONS: ['react', 'sass'],
  },
  {
    ID: '2-project',
    NAME: 'Game Galaxy',
    IMG: '../../../../assets/projects/GAME-GALAXY-PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/Web-Games',
    DESC: 'Game Galaxy is a platform for classic games. This website, featuring popular games like Tetris, Snake and Tic-Tac-Toe, is built with Angular, CSS, canvas and RxJS. Game Galaxy offers users a modern twist on beloved retro games.',
    ICONS: ['angular', 'css', 'tailwind'],
  },
  {
    ID: '3-project',
    NAME: 'Books Leaks',
    IMG: '../../../../assets/projects/BOOKS-LEAKS-PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/Books-Leaks',
    DESC: 'Book leaks. Explore the online bookstore, discover literary treasures in this incredible E-commerce of books, with a shopping cart, search engine, filters and login function, with an intuitive and interactive design.',
    ICONS: ['angular', 'css', 'tailwind', 'spring'],
  },
  {
    ID: '4-project',
    NAME: 'Notable',
    IMG: '../../../../assets/projects/NOTABLE_PROJECT.png',
    REPOSITORY: 'https://github.com/MarcossIC/NotAble',
    DESC: 'NotAble is an online note-taking app that transcribes your voice into text in real time. Additionally, it uses AI to summarize your notes, highlighting the most important points. Developed with Next.js, it integrates Vercel AI SDK and Google Speech-to-Text to deliver a seamless and intelligent note-taking experience.',
    ICONS: ['nextjs', 'tailwind', 'openai'],
  },
  {
    ID: '5-project',
    NAME: 'Invoicer++',
    IMG: '../../../../assets/projects/FACTURADOR-MASMAS-PROJECT.webp',
    REPOSITORY: 'https://github.com/conjunto-solucion/facturador',
    DESC: 'Invoicer++ is an open source application to generate commercial documents. It is an educational web platform created for students who are learning to create and manage business documents.',
    ICONS: ['react', 'sass', 'spring'],
  },
  {
    ID: '6-project',
    NAME: 'Cash now',
    IMG: '../../../../assets/projects/CASH_NOW_PROJECT.webp',
    REPOSITORY: 'https://github.com/MarcossIC/Cash-now.git',
    DESC: 'At Cash Now I was working on the backend, this webapp was created to allow people to request a loan from a financial institution, be able to manage the installments and have an interest calculator on the loans.',
    ICONS: ['angular', 'css', 'tailwind', 'spring'],
  },
];

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
