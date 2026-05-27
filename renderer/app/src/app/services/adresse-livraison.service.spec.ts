import { TestBed } from '@angular/core/testing';

import { AdresseLivraisonService } from './adresse-livraison.service';

describe('AdresseLivraisonService', () => {
  let service: AdresseLivraisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdresseLivraisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
