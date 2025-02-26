import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenValidationInterceptor } from './shared/interceptors/token-validation.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([tokenValidationInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    provideMomentDateAdapter(MY_DATE_FORMATS, { useUtc: true }),
  ],
};
