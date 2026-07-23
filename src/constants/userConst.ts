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
    'I hope to share my journey through the world of IT and that we can work together',
  role: 'Software developer',
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
      ROLE: 'Software Develpment',
      TIME: 'December 2024 - Present',
      DESCRIPTION: '',
      STACK: ['Angular', 'Spring Boot', 'Docker'],
    },
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Software Develpment',
      TIME: 'December 2023 - April 2025',
      DESCRIPTION:
        'At Codefend, I led the frontend development of a SaaS platform connecting companies with cybersecurity providers, migrating from SolidJS to React, optimizing the architecture, reducing dependencies, and collaborating on the implementation of security intelligence APIs.',
      STACK: ['React', 'Tauri', 'Rust'],
    },
    {
      ID: '2-exp',
      COMPANY: 'No country',
      ROLE: 'Full stack developer',
      TIME: 'June 2023 - December 2023',
      DESCRIPTION:
        'I worked as a frontend developer in multidisciplinary teams during hackathons, collaborating on design, requirement definition, architecture, testing, and advanced implementations such as animations with Framer Motion and 2D environments with Phaser.',
      STACK: ['Angular', 'React', 'Spring Boot', 'GCP'],
    },
    {
      ID: '3-exp',
      COMPANY: 'Practices',
      ROLE: 'Back-end developer',
      TIME: 'January 2022 - November 2022',
      DESCRIPTION:
        'I developed Facturador++, an application for the EPET school to enhance the learning experience of economics students, working on the API, security, MySQL database design, functional testing, and deployment with Docker on Google Cloud.',
      STACK: ['Spring Boot'],
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
    idioms: 'Spanish & English',
    complement: 'A good boy',
    resume: 'Resume',
    motto: "I love a coffee"
  },
  whoIamTitle: 'Who I am?',
  whoIam:
    `Developer with over ${YEARS_OF_EXPERIENCE} years of experience. Skill in backend development with Spring Boot and NestJS, and frontend development with React, Angular and Next.js. Ability to optimize development processes and create scalable solutions. Experience working with agile methodologies, with a constant focus on continuous improvement.`,
  studies: [
    {
      ID: 'b00fb15c9503',
      DEGREE: 'IT technician',
      STRONG: 'IT',
      STATE: "EPET N4 'O.E.A' - Finalized",
      DESCRIPTION:
        'I learned the basics of programming, robotics, entrepreneurship concepts, design and software',
    },
    {
      ID: 'bf39334cc71f',
      DEGREE: 'Oracle One Next',
      STRONG: 'Oracle',
      STATE: 'Alura Latam - Finalized',
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
