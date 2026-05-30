import { Component, input, output, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdresseLivraison, AdresseLivraisonCreateInput, AdresseLivraisonUpdateInput, Localite } from '../../../types/electron';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';

@Component({
  selector: 'app-utilisateur-adresses',
  imports: [ReactiveFormsModule],
  templateUrl: './utilisateur-adresse-livraison.component.html',
  styleUrl: './utilisateur-adresse-livraison.component.css',
})
export class UtilisateurAdresseLivraisonComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly adresseLivraisonService = inject(AdresseLivraisonService);

  utilisateurId = input.required<number>();
  adresses = input<AdresseLivraison[]>([]);
  localites = input<Localite[]>([]);

  adressesModifiees = output<void>();
  erreur = output<string>();

  modeAdresse = signal<'aucun' | 'ajout' | 'modification'>('aucun');
  adresseSelectionnee = signal<AdresseLivraison | null>(null);

  adresseForm = this.formBuilder.group({
    rue: ['', Validators.required],
    numero: ['', Validators.required],
    par_defaut: [0, Validators.required],
    localite_id: [null as number | null, Validators.required]
  });

  getAdresseComplete(adresse: AdresseLivraison): string {
    return `${adresse.rue} ${adresse.numero}, ${adresse.localite.code_postal} ${adresse.localite.localite}`;
  }

  getLabelAdresseParDefaut(adresse: AdresseLivraison): string {
    if (adresse.par_defaut === 1) {
      return 'Adresse par défaut';
    }

    return 'Adresse secondaire';
  }

  afficherAjoutAdresse(): void {
    this.modeAdresse.set('ajout');
    this.adresseSelectionnee.set(null);

    this.adresseForm.reset({
      rue: '',
      numero: '',
      par_defaut: 0,
      localite_id: null
    });
  }

  afficherModificationAdresse(adresse: AdresseLivraison): void {
    this.modeAdresse.set('modification');
    this.adresseSelectionnee.set(adresse);

    this.adresseForm.reset({
      rue: adresse.rue,
      numero: adresse.numero,
      par_defaut: adresse.par_defaut ?? 0,
      localite_id: adresse.localite_id
    });
  }

  annulerAdresse(): void {
    this.modeAdresse.set('aucun');
    this.adresseSelectionnee.set(null);

    this.adresseForm.reset({ rue: '', numero: '', par_defaut: 0, localite_id: null });
  }

  async enregistrerAdresse(): Promise<void> {
    if (this.adresseForm.invalid) {
      this.adresseForm.markAllAsTouched();
      this.erreur.emit('Veuillez remplir les champs obligatoires de l’adresse.');
      return;
    }

    const valeurFormulaire = this.adresseForm.getRawValue();

    if (valeurFormulaire.localite_id === null) {
      this.erreur.emit('Veuillez sélectionner une localité.');
      return;
    }

    try {
      if (this.modeAdresse() === 'ajout') {
        const adresse: AdresseLivraisonCreateInput = {
          rue: valeurFormulaire.rue?.trim() ?? '',
          numero: valeurFormulaire.numero?.trim() ?? '',
          par_defaut: valeurFormulaire.par_defaut ?? 0,
          utilisateur_id: this.utilisateurId(),
          localite_id: valeurFormulaire.localite_id
        };

        await this.adresseLivraisonService.createAdresseLivraison(adresse);
      }

      if (this.modeAdresse() === 'modification' && this.adresseSelectionnee()) {
        const adresse: AdresseLivraisonUpdateInput = {
          id_adresse: this.adresseSelectionnee()!.id_adresse,
          rue: valeurFormulaire.rue?.trim() ?? '',
          numero: valeurFormulaire.numero?.trim() ?? '',
          par_defaut: valeurFormulaire.par_defaut ?? 0,
          localite_id: valeurFormulaire.localite_id
        };

        await this.adresseLivraisonService.updateAdresseLivraison(adresse);
      }

      this.annulerAdresse();
      this.adressesModifiees.emit();
    }
    catch (error) {
      console.error(error);
      this.erreur.emit('Une erreur est survenue pendant l’enregistrement de l’adresse.');
    }
  }

  async supprimerAdresse(adresse: AdresseLivraison): Promise<void> {
    const confirmation = confirm('Voulez-vous vraiment supprimer cette adresse ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.adresseLivraisonService.deleteAdresseLivraison(adresse.id_adresse);
      this.adressesModifiees.emit();
    }
    catch (error) {
      console.error(error);
      this.erreur.emit('Une erreur est survenue pendant la suppression de l’adresse.');
    }
  }
}