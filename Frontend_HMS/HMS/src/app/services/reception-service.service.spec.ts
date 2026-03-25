import { TestBed } from '@angular/core/testing';

import { ReceptionServiceService } from './reception-service.service';

describe('ReceptionServiceService', () => {
  let service: ReceptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
