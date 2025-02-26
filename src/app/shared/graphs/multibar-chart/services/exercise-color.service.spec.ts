import { TestBed } from '@angular/core/testing';

import { ExerciseColorService } from './exercise-color.service';

describe('ExerciseColorService', () => {
  let service: ExerciseColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExerciseColorService],
    });
    service = TestBed.inject(ExerciseColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
