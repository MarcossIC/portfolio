export const PATHS: any = {
    start: "/",
    home: "/home",
    about: "/about",
    contact: "/contact",
};

export const ROUTES: any = {
    start: "",
    home: "home",
    about: "about",
    contact: "contact",
};


export const API: any = { };



export const HERO: any = {
  TITLE: "Full Stack",
  SUBTITLE: "Marcos Lopez",
  STRONG: {
      TITLE: "Developer"
  },
  PARAGRAPH: "Full-stack web developer with 2 years of experience, specialized in Java, Spring Boot, Angular and TypeScript. Knowledgeable in scalable software architectures, microservices and relational databases. You can read more in the About Me section. Feel free to contact me so we can work together.",
  RESUME: "View Resume",
  CONTACT: "Contact Me"
}

export const SKILLS: any = {
  TITLE: {
    TEXT: "Better architecture, easier everything",
    HIGHLIGHT: ["architecture", "everything"]
  },
  CLARIFICATION: "Some technologies with i have experience",
};

export const PROJECTS: any = {
  TITLE: "Some Projects",
  STRONG: {
    TITLE: "Projects",
  },
  VIEW: "View Repository",
  DATA: [
    {
      ID: crypto.randomUUID(),
      NAME: "Facturador++",
      DESCRIPTION:
          "Develop the backend and database for Facturador++. It's an educational web platform that enables users to create and manage business documents. This application is designed for students who are just starting and want to practice.",
      TAGS: [
          {
            NAME: "type script",
            COLOR: ['#1976D2', '#fff'],
          },
          {
            NAME: "react",
            COLOR: ['#61DAFB', '#6A6A6A'],
          },
          {
            NAME: "css",
            COLOR: ['#1D7CEC', '#ff'],
          },
          {
            NAME: "spring",
            COLOR: ['#6DB33F', '#fff'],
          },
          {
            NAME: "mysql",
            COLOR: ['#1F8CB4', '#fff'],
          },
          {
            NAME: "docker",
            COLOR: ['#186E98', '#E2F6FF'],
          },
        ],
        IMG: "../../../../assets/projects/facturador.webp",
        SOURCE: "https://github.com/conjunto-solucion/facturador",
        DEPLOY: "https://github.com/conjunto-solucion/facturador",
    },
    {
      ID: crypto.randomUUID(),
      NAME: "Paint Ease",
      DESCRIPTION:
          "I created PaintEase, an intuitive web platform that allows users to effortlessly unleash their creativity through simple and accessible online drawing tools. Conceived with the vision of providing a seamless digital canvas for artistic expression, PaintEase empowers individuals to bring their ideas to life anytime, anywhere.",
      TAGS: [
          {
            NAME: "java script",
            COLOR: ['#FBF459', '#545252'],
          },
          {
            NAME: "html",
            COLOR: ['#EC4E1D', '#fff'],
          },
          {
            NAME: "css",
            COLOR: ['#1D7CEC', '#ff'],
          },
          {
            NAME: "canvas",
            COLOR: ['#31218c', '#fff'],
          },
      ],
      IMG: "../../../../assets/projects/paintease.webp",
      SOURCE: "https://github.com/MarcossIC/paint-in-js-html-css",
      DEPLOY: "https://github.com/MarcossIC/paint-in-js-html-css",
    },
    {
      ID: crypto.randomUUID(),
      NAME: "A. Calculator",
      DESCRIPTION: "Develop this project to experiment and learn all Angular concepts, including property binding, data binding, and two-way binding. It encompasses enough functionality to perform simple and complex calculations.",
      TAGS: [
        {
          NAME: "html",
          COLOR: ['#EC4E1D', '#fff'],
        },
        {
          NAME: "type script",
          COLOR: ['#1976D2', '#fff'],
        },
        {
          NAME: "Angular",
          COLOR: ['#B52E31', '#fff'],
        },
        {
          NAME: "Tailwind",
          COLOR: ['#00B6D5', '#f5f5f5'],
        },
        {
          NAME: "canvas",
          COLOR: ['#31218c', '#fff'],
        },
      ],
      IMG: "../../../../assets/projects/angularCalculator.webp",
      SOURCE: "https://github.com/MarcossIC/angular-calculator/tree/main",
      DEPLOY: "https://github.com/MarcossIC/angular-calculator/tree/main",
    },
    {
      ID: crypto.randomUUID(),
      NAME: "Game Galaxy",
      DESCRIPTION: "Game Galaxy is a dynamic platform for classic games. Currently featuring popular titles such as Tetris, Snake and Tic-Tac-Toe, this website is built with Angular, using canvas, CSS and RxJS. With a sleek design and interactive gameplay, Game Galaxy offers users a modern twist on beloved retro games.",
      TAGS: [
        {
          NAME: "html",
          COLOR: ['#EC4E1D', '#fff'],
        },
        {
          NAME: "type script",
          COLOR: ['#1976D2', '#fff'],
        },
        {
          NAME: "Angular",
          COLOR: ['#B52E31', '#fff'],
        },
        {
          NAME: "rx js",
          COLOR: ["#BE2386", "#6C2E88"]
        },
        {
          NAME: "css",
          COLOR: ['#1D7CEC', '#ff'],
        },
        {
          NAME: "Tailwind",
          COLOR: ['#00B6D5', '#f5f5f5'],
        },
      ],
      IMG: "../../../../assets/projects/gamegalaxy.webp",
      SOURCE: "https://github.com/MarcossIC/Web-Games",
      DEPLOY: "https://github.com/MarcossIC/Web-Games"
    },
    {
      ID: crypto.randomUUID(),
      NAME: "Clean Arch",
      DESCRIPTION: "Repository that shows an example of how to make a clean architecture in Java following the SOLID principles. In addition, not only a simple hexagonal architecture is applied, but it is also applied together with a Vertical Slizing, in addition to applying it in two ways, one conventionally and another applying CQRS",
      TAGS: [
        {
          NAME: "spring",
          COLOR: ['#6DB33F', '#fff'],
        },
        {
          NAME: "Java",
          COLOR: ["#D7771E", "#fff"]
        },
        {
          NAME: "CQRS",
          COLOR: ["#333333", "#fff"],
        },
        {
          NAME: "Clean Architecture",
          COLOR: ["#D47570", "#fff"]
        }
  
      ],
      IMG: "../../../../assets/projects/clean-architecture.webp",
      SOURCE: "https://github.com/MarcossIC/architecture-example",
      DEPLOY: "https://github.com/MarcossIC/architecture-example"
    }
  ],
};

export const ABOUT_INTRO: any = {
  TITLE: "About me",
  PARAGRAPH: "I am Marcos López, a full stack developer with experience in Java, Spring Boot. Focused on creating high-performance backend architectures, microservices and clean architectures. On the front-end I have experience creating websites using Angular, HTML/CSS, TypeScript, Tailwind, among others. \n\nI have experience working with complete development teams, participating in the entire development process, using agile methodologies. Ability to analyze requirements, design robust and quality systems.",
  STRONG: {
    TITLE: "me"
  },
};

export const SERVICES: any = {
  TITLE: "Our service",
  STRONG: {
    TITLE: "Our",
  },
  SERVICES: [
    {
      ID: crypto.randomUUID(),
      TITLE: "Backend Developer",
      ICON: "../../../../../assets/backend.webp",
    },
    {
      ID: crypto.randomUUID(),
      TITLE: "Frontend Developer",
      ICON: "../../../../../assets/web.webp",
    },
    {
      ID: crypto.randomUUID(),
      TITLE: "Database Developer",
      ICON: "../../../../../assets/creator.webp",
    },
    {
      ID: crypto.randomUUID(),
      TITLE: "Software Architecture",
      ICON: "../../../../../assets/architect.webp",
    },
  ],
};

export const DIRECTION: any = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
}

export const STUDIES: any = {
  TITLE: "My Studies",
  STRONG: {
    TITLE: "My"
  },
  DATA: [
    {
      DEGREE: "IT technician",
      STRONG: "IT",
      STATE: "EPET N4 'O.E.A' - Finalized",
      DESCRIPTION: "I learned the basics of programming, robotics, entrepreneurship concepts, design and software",
    },
    {
      DEGREE: "Oracle One",
      STRONG: "Oracle",
      STATE: "Alura Latam - Finalized",
      DESCRIPTION: "In this program I learned essential concepts of front end architecture, mobile first and react",
    },
    {
      DEGREE: "More Courses",
      STRONG: "Courses",
      STATE: "Udemy - Finalized",
      DESCRIPTION: "Global Mentoring Courses for Java, Spring, Angular, Html, Css, TypeScript. Myth Code Functional Java Course, Amigos Code Spring Security Course",
    },
    {
      DEGREE: "Informatics Engineering",
      STRONG: "Engineering",
      STATE: "Gaston Dachary University - In progress",
      DESCRIPTION: "Learning fundamental concepts of Engineering, Business and increasing my knowledge in computer science",
    },
  ]
}

export const HEADER: any = {
    HOME: "Home",
    ABOUT: "About",
    CONTACT: "Contact",
    MORE: {
      TITLE: "More",
      STAR: {
        TEXT: "Stars colours :",
        OPTIONS: [
          {
            SELECTED: false,
            COLOR: "#0369A1"
          },
          {
            SELECTED: false,
            COLOR: "#4d7c0f"
          },
          {
            SELECTED: false,
            COLOR: "#c2410c"
          },
          {
            SELECTED: false,
            COLOR: "#7e22ce"
          },
          {
            SELECTED: false,
            COLOR: "#a16207"
          },
          {
            SELECTED: false,
            COLOR: "#0f766e"
          },
          {
            SELECTED: false,
            COLOR: "#be123c"
          },
          {
            SELECTED: true,
            COLOR: "#c48cd8"
          },
        ],
        
      }
    }
};