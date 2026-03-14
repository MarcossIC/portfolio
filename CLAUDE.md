# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 21 portfolio website (v3.0.0) for Marcos Lopez with SSR, i18n (Spanish/English), and deployed on Netlify. Single-page app — all content lives on the home page with section-based navigation.

## Commands

- **Install deps:** `bun install`
- **Dev server:** `bun start` (port 4200)
- **Build:** `bun run build` (output: `dist/portfolio/`)
- **Unit tests:** `bun test` (Vitest via `ng test`)
- **Single test:** `bunx ng test --include=src/app/components/atoms/title/title.component.spec.ts`
- **E2E tests:** `bun run e2e` (Playwright, starts dev server on port 4201)
- **Storybook:** `bun run storybook` (port 6006)
- **SSR serve:** `bun run serve:ssr:testing` (port 4000)
- **Package manager:** bun

## Architecture

### Rendering & Routing
- SSR with `@angular/ssr` + Express server (`src/server.ts`). Home page is prerendered; all other paths use server mode.
- Single route: lazy-loads `HomeComponent`. All paths fall back to home (SPA pattern).
- Zoneless change detection (`provideZonelessChangeDetection()`). All components use `OnPush`.

### Component Organization (Atomic Design)
- `src/app/components/atoms/` — small UI primitives (title, error-message, input-field, etc.)
- `src/app/components/molecules/` — composed elements (navigate, particles)
- `src/app/components/organism/` — complex sections (header, footer, contact-form, timeline, toast)
- `src/app/components/icons/` — 30+ SVG icon components
- `src/app/components/core/` — shared components (portfolio-button, social-button)
- `src/app/components/legacy/` — older components being phased out
- All components are **standalone** (no NgModules).

### Pages & Layouts
`HomeComponent` (`src/app/pages/home/`) composes 5 layout sections in order: Hero, Projects, Contact, Experiency (timeline), AboutMe.

### i18n System
- `I18nService` (`src/app/services/i18n.service.ts`) uses Angular signals for reactive language state.
- Supports `'es'` and `'en'`. Language constants are lazy-loaded from `src/constants/{en,es}/`.
- Auto-detects language via IP geolocation (ipinfo.io), falls back to Spanish. Stores preference in localStorage.
- Constants types: `userConst` (personal data), `appConst` (UI strings), `technologiesConst` (shared).

### Key Services
- **NavigationService** — smooth scroll to sections by ID with accessibility focus management
- **ScrollProgressService** — spring-physics-based scroll tracking with observables
- **ToastService** (`src/app/lib/toast/`) — signal-based notifications using custom `SignalsStoreService`

### Custom Libraries (`src/app/lib/`)
- **Directives:** `AtroposDirective` (3D tilt), `MoveBackground` (parallax), `VanillaTiltDirective`
- **Store:** Abstract store pattern with both RxJS and Signals implementations

## Path Aliases

| Alias | Path |
|-------|------|
| `@app/*` | `src/app/*` |
| `@assets/*` | `src/assets/*` |
| `@constants/*` | `src/constants/*` |
| `@lib/*` | `src/app/lib/*` |
| `@atoms/*` | `src/app/components/atoms/*` |
| `@molecules/*` | `src/app/components/molecules/*` |
| `@organism/*` | `src/app/components/organism/*` |
| `@icons/*` | `src/app/components/icons/*` |

## Styling

- Tailwind CSS v4 with PostCSS. Global styles in `src/styles/` (vars, normalize, styles).
- Design tokens use CSS custom properties with `oklch` colors in `_vars.css`. Primary background: `#0f0227`.
- Component styles are scoped CSS files colocated with components.

## Testing

- **Unit tests:** Vitest with jsdom, MSW for HTTP mocking. Test files colocated as `*.spec.ts`.
- **E2E:** Playwright across 5 browser profiles (Chromium, Firefox, WebKit, mobile Chrome, mobile Safari). Tests in `e2e/`.
- **TypeScript:** Strict mode enabled with strict templates and injection parameters.
