import { TestBed } from '@angular/core/testing';

import { EspeceService } from './espece.service';

describe('EspeceService', () => {
  let service: EspeceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspeceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});