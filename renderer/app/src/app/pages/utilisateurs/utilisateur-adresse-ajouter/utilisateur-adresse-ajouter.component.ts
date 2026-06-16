import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Localite, Utilisateur } from '../../../types/electron';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { LocaliteService } from '../../../services/localite.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-adresse-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './utilisateur-adresse-ajouter.component.html',
  styleUrl: './utilisateur-adresse-ajouter.component.css',
})

export class UtilisateurAdresseAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly adresseLivraisonService = inject(AdresseLivraisonService);
  private readonly localiteService = inject(LocaliteService);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

  id = input<string>();

  utilisateur = signal<Utilisateur | null>(null);
  localites = signal<Localite[]>([]);
  isLoading = signal(true);
  message = signal('');

  adresseForm = this.formBuilder.group({
    rue: ['', Validators.required],
    numero: ['', Validators.required],
    par_defaut: [0, Validators.required],
    localite_id: [0, [Validators.required, Validators.min(1)]],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    const idUtilisateur = Number(this.id());

    if (!idUtilisateur) {
      this.message.set('Identifiant de l’utilisateur invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const utilisateur = await this.utilisateurService.getUtilisateurById(idUtilisateur);
      const localites = await this.localiteService.getLocalites();

      if (!utilisateur) {
        this.message.set('Utilisateur introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);
      this.localites.set(localites);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement données adresse livraison', { error, idUtilisateur });
      this.message.set('Erreur pendant le chargement des données.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    const utilisateur = this.utilisateur();

    if (this.adresseForm.invalid || !utilisateur) {
      this.adresseForm.markAllAsTouched();
      this.message.set(this.adresseLivraisonService.getMessageErreurChampsObligatoires());
      return;
    }

    const valeurFormulaire = this.adresseForm.getRawValue();

    if (!valeurFormulaire.localite_id || valeurFormulaire.localite_id < 1) {
      this.message.set(this.adresseLivraisonService.getMessageErreurLocalite());
      return;
    }

    const adresse = this.adresseLivraisonService.construireAdresseLivraisonCreateInput(
      utilisateur.id_utilisateur,
      valeurFormulaire
    );

    try {
      await this.adresseLivraisonService.createAdresseLivraison(adresse);
      await this.router.navigate(['/utilisateurs', utilisateur.id_utilisateur]);
    }
    catch (error) {
      console.error('Erreur création adresse livraison', { error, formulaire: this.adresseForm.getRawValue(), adresse });
      this.message.set(this.adresseLivraisonService.getMessageErreurEnregistrement());
    }
  }
}