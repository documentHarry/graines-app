import { TestBed } from '@angular/core/testing';

import { AromateService } from './aromate.service';

describe('AromateService', () => {
  let service: AromateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AromateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
