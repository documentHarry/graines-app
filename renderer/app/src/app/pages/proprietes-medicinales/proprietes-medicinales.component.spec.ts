import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProprietesMedicinalesComponent } from './proprietes-medicinales.component';
import { ProprieteMedicinaleService } from '../../services/propriete-medicinale.service';
import { ProprieteMedicinale } from '../../types/electron';

describe('ProprietesMedicinalesComponent', () => {
  let component: ProprietesMedicinalesComponent;
  let fixture: ComponentFixture<ProprietesMedicinalesComponent>;

  let proprieteMedicinaleServiceMock: {
    getProprietesMedicinales: ReturnType<typeof vi.fn>;
    createProprieteMedicinale: ReturnType<typeof vi.fn>;
    updateProprieteMedicinale: ReturnType<typeof vi.fn>;
    deleteProprieteMedicinale: ReturnType<typeof vi.fn>;
  };

  const proprietesMock: ProprieteMedicinale[] = [
    {
      id_propriete: 1,
      nom_propriete: 'Digestive',
    },
    {
      id_propriete: 2,
      nom_propriete: 'Antioxydante',
    },
  ];

  beforeEach(async () => {
    proprieteMedicinaleServiceMock = {
      getProprietesMedicinales: vi.fn().mockResolvedValue(proprietesMock),
      createProprieteMedicinale: vi.fn().mockResolvedValue(undefined),
      updateProprieteMedicinale: vi.fn().mockResolvedValue(undefined),
      deleteProprieteMedicinale: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [ProprietesMedicinalesComponent],
      providers: [
        { provide: ProprieteMedicinaleService, useValue: proprieteMedicinaleServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProprietesMedicinalesComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger les propriétés médicinales', async () => {
    await component.chargerProprietes();

    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalled();
    expect(component.proprietes()).toEqual(proprietesMock);
    expect(component.message()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait afficher un message si le chargement échoue', async () => {
    proprieteMedicinaleServiceMock.getProprietesMedicinales.mockRejectedValue(new Error('Erreur test'));

    await component.chargerProprietes();

    expect(component.message()).toBe('Erreur pendant le chargement des propriétés médicinales.');
    expect(component.isLoading()).toBe(false);
  });

  it('devrait filtrer les propriétés médicinales par nom', () => {
    component.proprietes.set(proprietesMock);
    component.recherche.set('diges');

    expect(component.proprietesFiltrees()).toEqual([proprietesMock[0]]);
  });

  it('devrait retourner toutes les propriétés si la recherche est vide', () => {
    component.proprietes.set(proprietesMock);

    expect(component.proprietesFiltrees()).toEqual(proprietesMock);
  });

  it('devrait mettre à jour la recherche', () => {
    const event = {
      target: { value: 'anti' },
    } as unknown as Event;

    component.changerRecherche(event);

    expect(component.recherche()).toBe('anti');
  });

  it('devrait passer en mode ajout', () => {
    component.proprieteForm.patchValue({ nom_propriete: 'Ancienne valeur' });

    component.afficherAjout();

    expect(component.mode()).toBe('ajout');
    expect(component.proprieteSelectionnee()).toBeNull();
    expect(component.proprieteForm.getRawValue()).toEqual({
      nom_propriete: '',
    });
  });

  it('devrait passer en mode modification', () => {
    component.afficherModification(proprietesMock[0]);

    expect(component.mode()).toBe('modification');
    expect(component.proprieteSelectionnee()).toEqual(proprietesMock[0]);
    expect(component.proprieteForm.getRawValue()).toEqual({
      nom_propriete: 'Digestive',
    });
  });

  it('devrait annuler le mode en cours', () => {
    component.afficherModification(proprietesMock[0]);

    component.annuler();

    expect(component.mode()).toBe('aucun');
    expect(component.proprieteSelectionnee()).toBeNull();
    expect(component.proprieteForm.getRawValue()).toEqual({
      nom_propriete: '',
    });
  });

  it('devrait invalider le formulaire si le nom est vide', async () => {
    component.proprieteForm.patchValue({
      nom_propriete: '',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez saisir un nom de propriété médicinale.');
    expect(proprieteMedicinaleServiceMock.createProprieteMedicinale).not.toHaveBeenCalled();
    expect(proprieteMedicinaleServiceMock.updateProprieteMedicinale).not.toHaveBeenCalled();
  });

  it('devrait refuser un nom composé uniquement d’espaces', async () => {
    component.proprieteForm.patchValue({
      nom_propriete: '   ',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Veuillez saisir un nom de propriété médicinale.');
  });

  it('devrait créer une propriété médicinale en mode ajout', async () => {
    component.afficherAjout();
    component.proprieteForm.patchValue({
      nom_propriete: ' Digestive ',
    });

    await component.enregistrer();

    expect(proprieteMedicinaleServiceMock.createProprieteMedicinale).toHaveBeenCalledWith({
      nom_propriete: 'Digestive',
    });

    expect(component.mode()).toBe('aucun');
    expect(component.message()).toBe('');
  });

  it('devrait modifier une propriété médicinale en mode modification', async () => {
    component.afficherModification(proprietesMock[0]);
    component.proprieteForm.patchValue({
      nom_propriete: ' Apaisante ',
    });

    await component.enregistrer();

    expect(proprieteMedicinaleServiceMock.updateProprieteMedicinale).toHaveBeenCalledWith({
      id_propriete: 1,
      nom_propriete: 'Apaisante',
    });

    expect(component.mode()).toBe('aucun');
    expect(component.message()).toBe('');
  });

  it('devrait afficher un message si l’enregistrement échoue', async () => {
    proprieteMedicinaleServiceMock.createProprieteMedicinale.mockRejectedValue(new Error('Erreur test'));

    component.afficherAjout();
    component.proprieteForm.patchValue({
      nom_propriete: 'Digestive',
    });

    await component.enregistrer();

    expect(component.message()).toBe('Erreur pendant l’enregistrement de la propriété médicinale.');
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    await component.supprimer(proprietesMock[0]);

    expect(confirmSpy).toHaveBeenCalledWith(
      'Voulez-vous vraiment supprimer cette propriété médicinale ? Elle sera aussi retirée des aromates associés.'
    );
    expect(proprieteMedicinaleServiceMock.deleteProprieteMedicinale).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait supprimer une propriété médicinale après confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    await component.supprimer(proprietesMock[0]);

    expect(proprieteMedicinaleServiceMock.deleteProprieteMedicinale).toHaveBeenCalledWith(1);
    expect(proprieteMedicinaleServiceMock.getProprietesMedicinales).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait afficher un message si la suppression échoue', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    proprieteMedicinaleServiceMock.deleteProprieteMedicinale.mockRejectedValue(new Error('Erreur test'));

    await component.supprimer(proprietesMock[0]);

    expect(component.message()).toBe('Erreur pendant la suppression de la propriété médicinale.');
  });

  it('devrait retourner le titre du formulaire en mode ajout', () => {
    component.mode.set('ajout');

    expect(component.getTitreFormulaire()).toBe('Ajouter une propriété médicinale');
  });

  it('devrait retourner le titre du formulaire en mode modification', () => {
    component.mode.set('modification');

    expect(component.getTitreFormulaire()).toBe('Modifier une propriété médicinale');
  });
});