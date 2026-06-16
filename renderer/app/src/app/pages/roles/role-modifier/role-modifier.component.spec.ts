import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { RoleModifierComponent } from './role-modifier.component';
import { RoleService } from '../../../services/role.service';

describe('RoleModifierComponent', () => {
  let component: RoleModifierComponent;
  let fixture: ComponentFixture<RoleModifierComponent>;

  const roleServiceMock = {
    getRoles: vi.fn(),
    construireRoleUpdateInput: vi.fn(),
    updateRole: vi.fn(),
    getMessageErreurModificationRole: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [RoleModifierComponent],
      providers: [
        provideRouter([]),
        {
          provide: RoleService,
          useValue: roleServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleModifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});