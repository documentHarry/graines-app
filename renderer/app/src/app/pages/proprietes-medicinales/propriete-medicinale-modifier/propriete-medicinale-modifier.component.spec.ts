import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ProprieteMedicinaleModifierComponent } from './propriete-medicinale-modifier.component';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';

describe('ProprieteMedicinaleModifierComponent', () => {
  let component: ProprieteMedicinaleModifierComponent;
  let fixture: ComponentFixture<ProprieteMedicinaleModifierComponent>;

  const proprieteMedicinaleServiceMock = {
    getProprietesMedicinales: vi.fn(),
    construireProprieteMedicinaleUpdateInput: vi.fn(),
    updateProprieteMedicinale: vi.fn(),
    getMessageErreurEnregistrement: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProprieteMedicinaleModifierComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProprieteMedicinaleService,
          useValue: proprieteMedicinaleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprieteMedicinaleModifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});