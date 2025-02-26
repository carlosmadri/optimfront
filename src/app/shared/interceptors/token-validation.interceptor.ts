import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

export const tokenValidationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  req.headers.append('crossDomain', 'true');
  req.headers.append('token', authService.user()?.JWT as string); //Temp until connection to the backend is established
  const clonedRequest = req.clone({ headers: req.headers.append('Access-Control-Allow-Origin', '*') });
  return next(clonedRequest).pipe(
    catchError((err) => {
      console.error(err);
      if (err?.status === 401) {
        authService.clearToken();
        router.navigateByUrl('404'); // Temp redirect until we know the real Url
      }
      return throwError(() => err);
    }),
  );
};
