import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ProprieteMedicinaleAjouterComponent } from './propriete-medicinale-ajouter.component';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';

describe('ProprieteMedicinaleAjouterComponent', () => {
  let component: ProprieteMedicinaleAjouterComponent;
  let fixture: ComponentFixture<ProprieteMedicinaleAjouterComponent>;

  const proprieteMedicinaleServiceMock = {
    construireProprieteMedicinaleCreateInput: vi.fn(),
    createProprieteMedicinale: vi.fn(),
    getMessageErreurEnregistrement: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProprieteMedicinaleAjouterComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProprieteMedicinaleService,
          useValue: proprieteMedicinaleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprieteMedicinaleAjouterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});