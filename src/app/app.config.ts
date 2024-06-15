import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from './app.routing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(
      withHttpTransferCacheOptions({ includePostRequests: true })
    ),
    provideHttpClient(withFetch()),
  ],
};
