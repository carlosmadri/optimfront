import { TestBed } from '@angular/core/testing';

import { ManageJobRequestService } from './manage-job-request.service';

describe('ManageJobRequestService', () => {
  let service: ManageJobRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageJobRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
