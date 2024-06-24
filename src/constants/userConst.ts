//General user data
export const USER = {
  name: 'Marcos',
  lastname: 'Lopez',
  fullName: 'Marcos Lopez',
  email: 'marcoslopezdev18@gmail.com',
  motto:
    'I hope to share my journey through the world of IT and that we can work together',
  role: 'Software developer',
  cv: 'https://drive.google.com/file/d/1yINoSs5ZrUYssA4Y2IXLjh5Z9Bz2qCl1/view?usp=sharing',
  linkedIn: 'https://www.linkedin.com/in/marcos-lopez-dev',
  gitHub: 'https://github.com/MarcossIC',
  stackOverflow: 'https://es.stackoverflow.com/users/301174/marcos-lopez',
  downloadCv:
    'https://drive.usercontent.google.com/u/2/uc?id=1yINoSs5ZrUYssA4Y2IXLjh5Z9Bz2qCl1&export=download',
};

//User data to complete the about bento
export const ABOUT_USER = {
  yearsExpertice: '02',
  experiences: [
    {
      ID: '1-exp',
      COMPANY: 'Codefend',
      ROLE: 'Front-end developer',
      TIME: 'January 2024 - currently',
      DESCRIPTION:
        'Led the migration of a project from Solid JS to React. I continued the development of the project, ensuring the timely delivery of new functionalities. Mockup Photoshop designs and implement UX improvements.',
    },
    {
      ID: '2-exp',
      COMPANY: 'No country',
      ROLE: 'Full-stack developer',
      TIME: 'June 2023 - December 2023',
      DESCRIPTION:
        'In the no country job simulations, I worked with spring boot, creating a rest API, with microservices, security, and also worked on the front-end with Angular in a book e-commerce.',
    },
    {
      ID: '3-exp',
      COMPANY: 'Internship Facturador++',
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
    'I am a computer technician, passionate about programming and technology. Experience in back-end development with Spring boot and front-end development with React or Angular. Proficient in agile methodologies and team collaboration. Always eager to learn and explore new technologies.',
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
