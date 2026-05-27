import { TestBed } from '@angular/core/testing';

import { ProprieteMedicinaleService } from './propriete-medicinale.service';

describe('ProprieteMedicinaleService', () => {
  let service: ProprieteMedicinaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProprieteMedicinaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
