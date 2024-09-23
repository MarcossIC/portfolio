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
  cv: 'https://drive.google.com/file/d/1iYooKMNynD_4jlyP9tbMc8xbR1Ot4YpH/view?usp=sharing',
  linkedIn: 'https://www.linkedin.com/in/marcos-lopez-dev',
  gitHub: 'https://github.com/MarcossIC',
  stackOverflow: 'https://es.stackoverflow.com/users/301174/marcos-lopez',
  downloadCv:
    'https://drive.usercontent.google.com/u/0/uc?id=1iYooKMNynD_4jlyP9tbMc8xbR1Ot4YpH&export=download',
};

//User data to complete the about bento
export const ABOUT_USER: BentoUser = {
  yearsExpertice: '02',
  experiences: [
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Front end developer',
      TIME: 'January 2024 - July 2024',
      DESCRIPTION:
        'I led the client development for a SAAS system connecting companies with cybersecurity providers. Successfully migrated from SolidJS to React, improving codebase maintainability, and redesigned the project architecture, reducing development time by 30%. Eliminated 40% of legacy code, boosting team productivity by 25%, and reduced project dependencies by 45%, minimizing security vulnerabilities.',
    },
    {
      ID: '2-exp',
      COMPANY: 'No country',
      ROLE: 'Full stack developer',
      TIME: 'June 2023 - December 2023',
      DESCRIPTION:
        'Worked on software development projects in agile, multidisciplinary teams with Angular and Spring Boot. Developed responsive interfaces with UX/UI designers, enhancing user satisfaction. Managed an efficient Git workflow, reducing code conflicts by 60% and improving software quality. Implemented key front-end and back-end features, speeding up feature delivery by 45%. Improved requirement estimations by 25% through active participation.',
    },
    {
      ID: '3-exp',
      COMPANY: 'Facturador++',
      ROLE: 'Back-end developer',
      TIME: 'January 2022 - November 2022',
      DESCRIPTION:
        'Invoicer++ is a project that I did in an internship to deliver to the students of the economics course, to generate commercial documents online quickly, I was doing the back-end with Spring boot.',
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
  },
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
      DEGREE: 'Oracle One',
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
};
