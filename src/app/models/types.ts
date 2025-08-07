export enum Directions {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Header {
  ID: string;
  LABEL: string;
  PATH: string;
  FRAGMENT: string;
}

export type LinksHeaderArray = Header[];

export interface User {
  name: string;
  lastname: string;
  fullName: string;
  email: string;
  motto: string;
  role: string;
  cv: string;
  linkedIn: string;
  gitHub: string;
  stackOverflow: string;
  downloadCv: string;
  viewResume: string;
  shortResume: string;
  photo: string;
}

export interface UserExperience {
  ID: string;
  COMPANY: string;
  ROLE: string;
  TIME: string;
  DESCRIPTION: string;
  STACK: string[];
}

export interface UserProfile {
  photo: string;
  isAvalaible: boolean;
  availableText: string;
  notAvailableText: string;
  doYouLikeCoffee: boolean;
  country: string;
  qualification: string;
  idioms: string;
  complement: string;
  resume: string;
  motto: string;
}
export interface UserStudies {
  ID: string;
  DEGREE: string;
  STRONG: string;
  STATE: string;
  DESCRIPTION: string;
}

export interface BentoCTA {
  TITLE: string;
  BUTTON: string;
}

export interface GithubBento extends BentoCTA {
  SUB: string;
}



export interface BentoUser {
  yearsExpertice: string;
  experticeTitle: string;
  experienceTitle: string;
  githubBento: GithubBento;
  experiences: UserExperience[];
  profile: UserProfile;
  whoIam: string;
  whoIamTitle: string;
  stackTitle: string;
  studies: UserStudies[];
  bentoCTA: BentoCTA;
}
