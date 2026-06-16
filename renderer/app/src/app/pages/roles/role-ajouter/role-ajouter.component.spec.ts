import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { RoleAjouterComponent } from './role-ajouter.component';
import { RoleService } from '../../../services/role.service';

describe('RoleAjouterComponent', () => {
  let component: RoleAjouterComponent;
  let fixture: ComponentFixture<RoleAjouterComponent>;

  const roleServiceMock = {
    construireRoleCreateInput: vi.fn(),
    createRole: vi.fn(),
    getMessageErreurCreationRole: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RoleAjouterComponent],
      providers: [
        provideRouter([]),
        {
          provide: RoleService,
          useValue: roleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleAjouterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});