import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ProprieteMedicinaleSupprimerComponent } from './propriete-medicinale-supprimer.component';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';

describe('ProprieteMedicinaleSupprimerComponent', () => {
  let component: ProprieteMedicinaleSupprimerComponent;
  let fixture: ComponentFixture<ProprieteMedicinaleSupprimerComponent>;

  const proprieteMedicinaleServiceMock = {
    getProprietesMedicinales: vi.fn(),
    deleteProprieteMedicinale: vi.fn(),
    getMessageErreurSuppression: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProprieteMedicinaleSupprimerComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProprieteMedicinaleService,
          useValue: proprieteMedicinaleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprieteMedicinaleSupprimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});