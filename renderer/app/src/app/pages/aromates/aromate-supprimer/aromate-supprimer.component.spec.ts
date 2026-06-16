import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AromateSupprimerComponent } from './aromate-supprimer.component';
import { AromateService } from '../../../services/aromate.service';

describe('AromateSupprimerComponent', () => {
  let component: AromateSupprimerComponent;
  let fixture: ComponentFixture<AromateSupprimerComponent>;

  const aromateMock = {
    id_aromate: 1,
    nom: 'Basilic',
    proprietes_medicinales: 'Digestif. Antioxydant.',
  };

  const aromateServiceMock = {
    getAromateById: vi.fn(),
    deleteAromate: vi.fn(),
    getMessageErreurSuppression: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    aromateServiceMock.getAromateById.mockResolvedValue(aromateMock);
    aromateServiceMock.deleteAromate.mockResolvedValue(aromateMock);
    aromateServiceMock.getMessageErreurSuppression.mockReturnValue(
      'Erreur pendant la suppression de l’aromate.'
    );
    routerMock.navigate.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [AromateSupprimerComponent],
      providers: [
        { provide: AromateService, useValue: aromateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AromateSupprimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load aromate when id is valid', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerAromate();

    expect(aromateServiceMock.getAromateById).toHaveBeenCalledWith(1);
    expect(component.aromate()).toEqual(aromateMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('should show error message when id is invalid', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerAromate();

    expect(aromateServiceMock.getAromateById).not.toHaveBeenCalled();
    expect(component.message()).toBe('Identifiant de l’aromate invalide.');
    expect(component.isLoading()).toBe(false);
  });

  it('should show message when aromate is not found', async () => {
    aromateServiceMock.getAromateById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '999');

    await component.chargerAromate();

    expect(component.message()).toBe('Aromate introuvable.');
    expect(component.aromate()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('should show error message when loading fails', async () => {
    aromateServiceMock.getAromateById.mockRejectedValue(new Error('Erreur'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerAromate();

    expect(component.message()).toBe('Erreur pendant le chargement de l’aromate.');
    expect(component.isLoading()).toBe(false);
  });

  it('should not delete aromate when no aromate is loaded', async () => {
    component.aromate.set(null);

    await component.supprimerAromate();

    expect(aromateServiceMock.deleteAromate).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not delete aromate when confirmation is cancelled', async () => {
    component.aromate.set(aromateMock as any);
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    await component.supprimerAromate();

    expect(window.confirm).toHaveBeenCalledWith(
      'Voulez-vous vraiment supprimer cet aromate ?'
    );
    expect(aromateServiceMock.deleteAromate).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should delete aromate and navigate to aromates list when confirmed', async () => {
    component.aromate.set(aromateMock as any);
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await component.supprimerAromate();

    expect(aromateServiceMock.deleteAromate).toHaveBeenCalledWith(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/aromates']);
  });

  it('should show error message when deletion fails', async () => {
    component.aromate.set(aromateMock as any);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    aromateServiceMock.deleteAromate.mockRejectedValue(new Error('Erreur'));

    await component.supprimerAromate();

    expect(component.message()).toBe('Erreur pendant la suppression de l’aromate.');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back to aromate detail when cancelling', async () => {
    component.aromate.set(aromateMock as any);

    await component.annuler();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/aromates', 1]);
  });

  it('should navigate with null id when cancelling without loaded aromate', async () => {
    component.aromate.set(null);

    await component.annuler();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/aromates', undefined]);
  });
});