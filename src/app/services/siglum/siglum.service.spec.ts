import { TestBed } from '@angular/core/testing';

import { SiglumService } from './siglum.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SiglumService', () => {
  let service: SiglumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(SiglumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
