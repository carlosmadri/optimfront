import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { tokenValidationInterceptor } from './token-validation.interceptor';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('tokenValidationInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => tokenValidationInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
