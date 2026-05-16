import { TestBed } from '@angular/core/testing';

import { VarieteService } from './variete.service';

describe('VarieteService', () => {
  let service: VarieteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VarieteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
