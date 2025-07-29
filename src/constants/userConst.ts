import type { BentoUser, User } from '@app/models/types';

//General user data
export const USER: User = {
  name: 'Marcos',
  lastname: 'Lopez',
  fullName: 'Marcos Lopez',
  email: 'marcoslopezdev18@gmail.com',
  motto:
    'I hope to share my journey through the world of IT and that we can work together',
  role: 'Software developer',
  cv: 'https://drive.google.com/file/d/1fxazKwrFJ91R2-3bIAKGsu4gkfaXB-iJ/view?usp=sharing',
  linkedIn: 'https://www.linkedin.com/in/marcos-lopez-dev',
  gitHub: 'https://github.com/MarcossIC',
  stackOverflow: 'https://es.stackoverflow.com/users/301174/marcos-lopez',
  downloadCv:
    'https://drive.usercontent.google.com/u/2/uc?id=1fxazKwrFJ91R2-3bIAKGsu4gkfaXB-iJ&export=download',
};

//User data to complete the about bento
export const ABOUT_USER: BentoUser = {
  yearsExpertice: '02',
  experticeTitle: 'Years of experience',
  experienceTitle: 'Experience',
  experiences: [
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Front end developer',
      TIME: 'January 2024 - October 2024',
      DESCRIPTION:
        'At Codefend, I led the frontend development of a SaaS platform connecting companies with cybersecurity providers, migrating from SolidJS to React, optimizing the architecture, reducing dependencies, and collaborating on the implementation of security intelligence APIs.',
    },
    {
      ID: '2-exp',
      COMPANY: 'No country',
      ROLE: 'Full stack developer',
      TIME: 'June 2023 - March 2024',
      DESCRIPTION:
        'I worked as a frontend developer in multidisciplinary teams during hackathons, collaborating on design, requirement definition, architecture, testing, and advanced implementations such as animations with Framer Motion and 2D environments with Phaser.',
    },
    {
      ID: '3-exp',
      COMPANY: 'Facturador++',
      ROLE: 'Back-end developer',
      TIME: 'January 2022 - November 2022',
      DESCRIPTION:
        'I developed Facturador++, an application for the EPET school to enhance the learning experience of economics students, working on the API, security, MySQL database design, functional testing, and deployment with Docker on Google Cloud.',
    },
  ],
  profile: {
    //URL or PATH to the img
    photo: '../../../../assets/utils/FOTO_CV.webp',
    //false still doesn't work
    isAvalaible: true,
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
    'Developer with over 2 years of experience. Skill in backend development with Spring Boot and frontend development with React and Angular. Ability to optimize development processes, create scalable solutions. Experience working with agile methodologies, with a constant focus on continuous improvement.',
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
    title: 'Let’s Work Together',
    button: 'Contact me',
  }
};
