import { TestBed } from '@angular/core/testing';

import { MedicalRecordServiceService } from './medical-record-service.service';

describe('MedicalRecordServiceService', () => {
  let service: MedicalRecordServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalRecordServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
