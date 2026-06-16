import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdresseLivraison, Localite, Utilisateur } from '../../../types/electron';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { LocaliteService } from '../../../services/localite.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-adresse-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './utilisateur-adresse-modifier.component.html',
  styleUrl: './utilisateur-adresse-modifier.component.css',
})

export class UtilisateurAdresseModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly adresseLivraisonService = inject(AdresseLivraisonService);
  private readonly localiteService = inject(LocaliteService);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

  id = input<string>();
  adresseId = input<string>();

  utilisateur = signal<Utilisateur | null>(null);
  adresse = signal<AdresseLivraison | null>(null);
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
    const idAdresse = Number(this.adresseId());

    if (!idUtilisateur || !idAdresse) {
      this.message.set('Identifiant de l’utilisateur ou de l’adresse invalide.');
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

      const adresse = utilisateur.adresse_livraison
        .find(adresse => adresse.id_adresse === idAdresse) ?? null;

      if (!adresse) {
        this.message.set('Adresse introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);
      this.adresse.set(adresse);
      this.localites.set(localites);

      this.adresseForm.patchValue({
        rue: adresse.rue,
        numero: adresse.numero,
        par_defaut: adresse.par_defaut ?? 0,
        localite_id: adresse.localite_id,
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement adresse livraison', { error, idUtilisateur, idAdresse });
      this.message.set('Erreur pendant le chargement de l’adresse.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    const utilisateur = this.utilisateur();
    const adresseActuelle = this.adresse();

    if (this.adresseForm.invalid || !utilisateur || !adresseActuelle) {
      this.adresseForm.markAllAsTouched();
      this.message.set(this.adresseLivraisonService.getMessageErreurChampsObligatoires());
      return;
    }

    const valeurFormulaire = this.adresseForm.getRawValue();

    if (!valeurFormulaire.localite_id || valeurFormulaire.localite_id < 1) {
      this.message.set(this.adresseLivraisonService.getMessageErreurLocalite());
      return;
    }

    const adresse = this.adresseLivraisonService.construireAdresseLivraisonUpdateInput(
      adresseActuelle.id_adresse,
      valeurFormulaire
    );

    try {
      await this.adresseLivraisonService.updateAdresseLivraison(adresse);
      await this.router.navigate(['/utilisateurs', utilisateur.id_utilisateur]);
    }
    catch (error) {
      console.error('Erreur modification adresse livraison', { error, formulaire: this.adresseForm.getRawValue(), adresse });
      this.message.set(this.adresseLivraisonService.getMessageErreurEnregistrement());
    }
  }
}