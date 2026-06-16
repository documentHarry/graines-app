import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { RoleSupprimerComponent } from './role-supprimer.component';
import { RoleService } from '../../../services/role.service';

describe('RoleSupprimerComponent', () => {
  let component: RoleSupprimerComponent;
  let fixture: ComponentFixture<RoleSupprimerComponent>;

  const roleServiceMock = {
    getRoles: vi.fn(),
    deleteRole: vi.fn(),
    getMessageErreurSuppressionRole: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RoleSupprimerComponent],
      providers: [
        provideRouter([]),
        {
          provide: RoleService,
          useValue: roleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleSupprimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});