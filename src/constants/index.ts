// src/constants/index.ts

import * as userConstEs from './es/userConst';
import * as userConstEn from './en/userConst';

import * as appConstEs from './es/appConst';
import * as appConstEn from './en/appConst';

import * as technologiesConst from './technologiesConst';

export const constants = {
  es: {
    userConst: userConstEs,
    appConst: appConstEs,
    technologiesConst: technologiesConst
  },
  en: {
    userConst: userConstEn,
    appConst: appConstEn,
    technologiesConst: technologiesConst
  }
};
