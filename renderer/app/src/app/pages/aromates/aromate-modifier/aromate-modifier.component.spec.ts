import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AromateModifierComponent } from './aromate-modifier.component';
import { AromateService } from '../../../services/aromate.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';

describe('AromateModifierComponent', () => {
  let component: AromateModifierComponent;
  let fixture: ComponentFixture<AromateModifierComponent>;

  const aromateMock = {
    id_aromate: 1,
    variete_id: 2,
    partie_utilisee: 'Feuilles',
    propriete: 'Digestif',
    usage_culinaire: 'Sauces',
  };

  const varietesMock = [
    {
      id_variete: 2,
      nom: 'Basilic',
    },
  ];

  const proprietesMedicinalesMock = [
    {
      id_propriete_medicinale: 10,
      nom: 'Digestive',
    },
    {
      id_propriete_medicinale: 11,
      nom: 'Antioxydante',
    },
  ];

  const aromateUpdateInputMock = {
    id_aromate: 1,
    variete_id: 2,
    partie_utilisee: 'Feuilles',
    propriete: 'Digestif',
    usage_culinaire: 'Sauces',
    proprietes_medicinales_ids: [10],
  };

  const aromateServiceMock = {
    getAromateById: vi.fn(),
    getProprietesSelectionneesDepuisAromate: vi.fn(),
    construireAromateUpdateInput: vi.fn(),
    updateAromate: vi.fn(),
    getMessageErreurModification: vi.fn(),
  };

  const proprieteMedicinaleServiceMock = {
    getProprietesMedicinales: vi.fn(),
  };

  const varieteServiceMock = {
    getVarietes: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    aromateServiceMock.getAromateById.mockResolvedValue(aromateMock);
    aromateServiceMock.getProprietesSelectionneesDepuisAromate.mockReturnValue([10]);
    aromateServiceMock.construireAromateUpdateInput.mockReturnValue(aromateUpdateInputMock);
    aromateServiceMock.updateAromate.mockResolvedValue(aromateUpdateInputMock);
    aromateServiceMock.getMessageErreurModification.mockReturnValue(
      'Erreur pendant la modification de l’aromate.'
    );

    varieteServiceMock.getVarietes.mockResolvedValue(varietesMock);
    proprieteMedicinaleServiceMock.getProprietesMedicinales.mockResolvedValue(
      proprietesMedicinalesMock
    );
    routerMock.navigate.mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [AromateModifierComponent],
      providers: [
        { provide: AromateService, useValue: aromateServiceMock },
        { provide: ProprieteMedicinaleService, useValue: proprieteMedicinaleServiceMock },
        { provide: VarieteService, useValue: varieteServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AromateModifierComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data when id is valid', async () => {
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(aromateServiceMock.getAromateById).toHaveBeenCalledWith(1);
    expect(varieteServiceMock.getVarietes).toHaveBeenCalled();
    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalled();

    expect(component.aromate()).toEqual(aromateMock);
    expect(component.varietes()).toEqual(varietesMock);
    expect(component.proprietesMedicinales()).toEqual(proprietesMedicinalesMock);
    expect(component.proprietesSelectionnees()).toEqual([10]);

    expect(component.aromateForm.getRawValue()).toEqual({
      variete_id: 2,
      partie_utilisee: 'Feuilles',
      propriete: 'Digestif',
      usage_culinaire: 'Sauces',
    });

    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('should show error message when id is invalid', async () => {
    fixture.componentRef.setInput('id', 'abc');

    await component.chargerDonnees();

    expect(aromateServiceMock.getAromateById).not.toHaveBeenCalled();
    expect(component.message()).toBe('Identifiant de l’aromate invalide.');
    expect(component.isLoading()).toBe(false);
  });

  it('should show message when aromate is not found', async () => {
    aromateServiceMock.getAromateById.mockResolvedValue(null);
    fixture.componentRef.setInput('id', '999');

    await component.chargerDonnees();

    expect(component.message()).toBe('Aromate introuvable.');
    expect(component.aromate()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('should show error message when loading fails', async () => {
    aromateServiceMock.getAromateById.mockRejectedValue(new Error('Erreur'));
    fixture.componentRef.setInput('id', '1');

    await component.chargerDonnees();

    expect(component.message()).toBe('Erreur pendant le chargement de l’aromate.');
    expect(component.isLoading()).toBe(false);
  });

  it('should check if medicinal property is selected', () => {
    component.proprietesSelectionnees.set([10, 11]);

    expect(component.estProprieteSelectionnee(10)).toBe(true);
    expect(component.estProprieteSelectionnee(99)).toBe(false);
  });

  it('should add medicinal property when checkbox is checked', () => {
    component.proprietesSelectionnees.set([10]);

    const event = {
      target: {
        checked: true,
      },
    } as unknown as Event;

    component.changerPropriete(event, 11);

    expect(component.proprietesSelectionnees()).toEqual([10, 11]);
  });

  it('should remove medicinal property when checkbox is unchecked', () => {
    component.proprietesSelectionnees.set([10, 11]);

    const event = {
      target: {
        checked: false,
      },
    } as unknown as Event;

    component.changerPropriete(event, 10);

    expect(component.proprietesSelectionnees()).toEqual([11]);
  });

  it('should not save when form is invalid', async () => {
    component.aromate.set(aromateMock as any);
    component.aromateForm.patchValue({
      variete_id: 0,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(aromateServiceMock.construireAromateUpdateInput).not.toHaveBeenCalled();
    expect(aromateServiceMock.updateAromate).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should not save when no aromate is loaded', async () => {
    component.aromate.set(null);
    component.aromateForm.patchValue({
      variete_id: 2,
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez remplir les champs obligatoires.');
    expect(aromateServiceMock.construireAromateUpdateInput).not.toHaveBeenCalled();
    expect(aromateServiceMock.updateAromate).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should save aromate and navigate to detail page when form is valid', async () => {
    component.aromate.set(aromateMock as any);
    component.proprietesSelectionnees.set([10]);
    component.aromateForm.patchValue({
      variete_id: 2,
      partie_utilisee: 'Feuilles',
      propriete: 'Digestif',
      usage_culinaire: 'Sauces',
    });

    await component.enregistrer();

    expect(aromateServiceMock.construireAromateUpdateInput).toHaveBeenCalledWith(
      1,
      {
        variete_id: 2,
        partie_utilisee: 'Feuilles',
        propriete: 'Digestif',
        usage_culinaire: 'Sauces',
      },
      [10]
    );

    expect(aromateServiceMock.updateAromate).toHaveBeenCalledWith(aromateUpdateInputMock);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/aromates', 1]);
  });

  it('should show error message when save fails', async () => {
    component.aromate.set(aromateMock as any);
    component.proprietesSelectionnees.set([10]);
    component.aromateForm.patchValue({
      variete_id: 2,
      partie_utilisee: 'Feuilles',
      propriete: 'Digestif',
      usage_culinaire: 'Sauces',
    });

    aromateServiceMock.updateAromate.mockRejectedValue(new Error('Erreur'));

    await component.enregistrer();

    expect(component.message()).toBe('Erreur pendant la modification de l’aromate.');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});