# Portfolio Web

## :rocket: Demo

You can visit the site at: [view website](marcosic.com)

## :sparkles: Introduction

This is a web portfolio made in Angular, it is made to show my work and my skills as a front-end developer, it currently has 4 sections.

- Projects
- About
- Studies
- Contact

## 🛠 Stack

The project is developed in Angular 21 and uses these technologies:

<p user-select="none" align="left">
   <a href="#" rel="noreferrer"> <img src="https://skillicons.dev/icons?i=angular,ts,css,html,tailwind"/> </a>
</p>

## 🚀 Project Structure

Architecture used in the project

```text
/
├── src/
│   ├── app/
│   │   ├──  components/
│   |   |     ├── atoms/
|   |   |     ├──  molecules/
|   |   |     ├──  organism/
|   |   |     ├──  icons/
|   |   |     └──  legacy/
|   |   |
│   │   ├──  lib/
│   │   ├──  models/
│   │   └── pages/
│   |        └── home/
|   |
│   ├── assets/
│   |    └── asset.{png,jpg,webp,svg,ttf}
│   ├── constanst/
│   |    └── anyConst.ts
│   ├── environments/
│   |    └── environment.*.ts
│   └── styles/
│        └── styles.css
|   
├── angular.json
├── tailwind.config.mjs
└── package.json
```

## ℹ️ Development server

In order to deploy a local version of the project you must:

- Download the project from github
- Run `bun install` at the root of the project
- Run `bun start` for a dev server. Navigate to `http://localhost:4200/`.
  The application will automatically reload if you change any of the source files.

## ℹ️ Build

Run `bun run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## 💪 Project status

The project is currently in its fifth version (v5.0.0). This version features a complete redesign built on Angular 21 with SSR, zoneless change detection, and i18n support (Spanish/English). The architecture follows Atomic Design principles with standalone components, signal-based state management, and lazy-loaded content. The site is deployed on Netlify with server-side rendering for optimal performance.
