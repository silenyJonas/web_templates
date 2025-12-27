import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes'; // Import tvých rout
import { AuthTokenInterceptor } from './core/interceptors/auth-token.interceptor';

// Import pro registraci lokalizačních dat
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs'; // Čeština

// Registrace lokalizačních dat pro 'cs-CZ'
registerLocaleData(localeCs, 'cs-CZ');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  ]
};
