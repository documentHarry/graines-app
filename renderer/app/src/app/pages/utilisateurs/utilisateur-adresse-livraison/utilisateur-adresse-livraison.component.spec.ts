import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { UtilisateurAdresseLivraisonComponent } from './utilisateur-adresse-livraison.component';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { AdresseLivraison, Localite } from '../../../types/electron';

describe('UtilisateurAdresseLivraisonComponent', () => {
  let component: UtilisateurAdresseLivraisonComponent;
  let fixture: ComponentFixture<UtilisateurAdresseLivraisonComponent>;
  let adresseLivraisonServiceMock: {
    createAdresseLivraison: ReturnType<typeof vi.fn>;
    updateAdresseLivraison: ReturnType<typeof vi.fn>;
    deleteAdresseLivraison: ReturnType<typeof vi.fn>;
  };

  const localiteMock: Localite = {
    id_localite: 1,
    code_postal: '5000',
    localite: 'Namur',
  };

  const adresseMock: AdresseLivraison = {
    id_adresse: 1,
    rue: 'Rue des Fleurs',
    numero: '12',
    par_defaut: 1,
    utilisateur_id: 1,
    localite_id: 1,
    localite: localiteMock,
  };

  beforeEach(async () => {
    adresseLivraisonServiceMock = {
      createAdresseLivraison: vi.fn().mockResolvedValue(undefined),
      updateAdresseLivraison: vi.fn().mockResolvedValue(undefined),
      deleteAdresseLivraison: vi.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [UtilisateurAdresseLivraisonComponent],
      providers: [
        { provide: AdresseLivraisonService, useValue: adresseLivraisonServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilisateurAdresseLivraisonComponent);
    fixture.componentRef.setInput('utilisateurId', 1);
    fixture.componentRef.setInput('adresses', [adresseMock]);
    fixture.componentRef.setInput('localites', [localiteMock]);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait retourner l’adresse complète', () => {
    expect(component.getAdresseComplete(adresseMock)).toBe('Rue des Fleurs 12, 5000 Namur');
  });

  it('devrait retourner Adresse par défaut si par_defaut vaut 1', () => {
    expect(component.getLabelAdresseParDefaut(adresseMock)).toBe('Adresse par défaut');
  });

  it('devrait retourner Adresse secondaire si par_defaut vaut 0', () => {
    expect(component.getLabelAdresseParDefaut({
      ...adresseMock,
      par_defaut: 0,
    })).toBe('Adresse secondaire');
  });

  it('devrait passer en mode ajout', () => {
    component.afficherAjoutAdresse();

    expect(component.modeAdresse()).toBe('ajout');
    expect(component.adresseSelectionnee()).toBeNull();
    expect(component.adresseForm.getRawValue()).toEqual({
      rue: '',
      numero: '',
      par_defaut: 0,
      localite_id: null,
    });
  });

  it('devrait passer en mode modification et remplir le formulaire', () => {
    component.afficherModificationAdresse(adresseMock);

    expect(component.modeAdresse()).toBe('modification');
    expect(component.adresseSelectionnee()).toEqual(adresseMock);
    expect(component.adresseForm.getRawValue()).toEqual({
      rue: 'Rue des Fleurs',
      numero: '12',
      par_defaut: 1,
      localite_id: 1,
    });
  });

  it('devrait annuler le mode adresse', () => {
    component.afficherModificationAdresse(adresseMock);

    component.annulerAdresse();

    expect(component.modeAdresse()).toBe('aucun');
    expect(component.adresseSelectionnee()).toBeNull();
    expect(component.adresseForm.getRawValue()).toEqual({
      rue: '',
      numero: '',
      par_defaut: 0,
      localite_id: null,
    });
  });

  it('devrait émettre une erreur si le formulaire est invalide', async () => {
    const erreurSpy = vi.spyOn(component.erreur, 'emit');

    component.adresseForm.patchValue({
      rue: '',
      numero: '',
      par_defaut: 0,
      localite_id: null,
    });

    await component.enregistrerAdresse();

    expect(erreurSpy).toHaveBeenCalledWith('Veuillez remplir les champs obligatoires de l’adresse.');
    expect(adresseLivraisonServiceMock.createAdresseLivraison).not.toHaveBeenCalled();
    expect(adresseLivraisonServiceMock.updateAdresseLivraison).not.toHaveBeenCalled();
  });

  it('devrait créer une adresse en mode ajout', async () => {
    const adressesModifieesSpy = vi.spyOn(component.adressesModifiees, 'emit');

    component.afficherAjoutAdresse();
    component.adresseForm.patchValue({
      rue: ' Rue des Roses ',
      numero: ' 5 ',
      par_defaut: 0,
      localite_id: 1,
    });

    await component.enregistrerAdresse();

    expect(adresseLivraisonServiceMock.createAdresseLivraison).toHaveBeenCalledWith({
      rue: 'Rue des Roses',
      numero: '5',
      par_defaut: 0,
      utilisateur_id: 1,
      localite_id: 1,
    });

    expect(component.modeAdresse()).toBe('aucun');
    expect(adressesModifieesSpy).toHaveBeenCalled();
  });

  it('devrait modifier une adresse en mode modification', async () => {
    const adressesModifieesSpy = vi.spyOn(component.adressesModifiees, 'emit');

    component.afficherModificationAdresse(adresseMock);
    component.adresseForm.patchValue({
      rue: ' Rue modifiée ',
      numero: ' 99 ',
      par_defaut: 1,
      localite_id: 1,
    });

    await component.enregistrerAdresse();

    expect(adresseLivraisonServiceMock.updateAdresseLivraison).toHaveBeenCalledWith({
      id_adresse: 1,
      rue: 'Rue modifiée',
      numero: '99',
      par_defaut: 1,
      localite_id: 1,
    });

    expect(component.modeAdresse()).toBe('aucun');
    expect(adressesModifieesSpy).toHaveBeenCalled();
  });

  it('devrait émettre une erreur si l’enregistrement échoue', async () => {
    const erreurSpy = vi.spyOn(component.erreur, 'emit');

    adresseLivraisonServiceMock.createAdresseLivraison.mockRejectedValue(new Error('Erreur test'));

    component.afficherAjoutAdresse();
    component.adresseForm.patchValue({
      rue: 'Rue des Roses',
      numero: '5',
      par_defaut: 0,
      localite_id: 1,
    });

    await component.enregistrerAdresse();

    expect(erreurSpy).toHaveBeenCalledWith('Une erreur est survenue pendant l’enregistrement de l’adresse.');
  });

  it('ne devrait pas supprimer si la confirmation est annulée', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    await component.supprimerAdresse(adresseMock);

    expect(confirmSpy).toHaveBeenCalledWith('Voulez-vous vraiment supprimer cette adresse ?');
    expect(adresseLivraisonServiceMock.deleteAdresseLivraison).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait supprimer une adresse après confirmation', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const adressesModifieesSpy = vi.spyOn(component.adressesModifiees, 'emit');

    await component.supprimerAdresse(adresseMock);

    expect(adresseLivraisonServiceMock.deleteAdresseLivraison).toHaveBeenCalledWith(1);
    expect(adressesModifieesSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('devrait émettre une erreur si la suppression échoue', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const erreurSpy = vi.spyOn(component.erreur, 'emit');

    adresseLivraisonServiceMock.deleteAdresseLivraison.mockRejectedValue(new Error('Erreur test'));

    await component.supprimerAdresse(adresseMock);

    expect(erreurSpy).toHaveBeenCalledWith('Une erreur est survenue pendant la suppression de l’adresse.');

    confirmSpy.mockRestore();
  });
});