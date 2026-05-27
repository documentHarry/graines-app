import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdresseLivraison, Utilisateur } from '../../../types/electron';
import { AdresseLivraisonService } from '../../../services/adresse-livraison.service';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-detail',
  imports: [RouterLink],
  templateUrl: './utilisateur-detail.component.html',
  styleUrl: './utilisateur-detail.component.css',
})

export class UtilisateurDetailComponent {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly adresseLivraisonService = inject(AdresseLivraisonService);

  id = input<string>();

  utilisateur = signal<Utilisateur | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerUtilisateur();
  }

  async chargerUtilisateur(): Promise<void> {
    const idUtilisateur = Number(this.id());

    if (!idUtilisateur) {
      this.message.set('Identifiant de l’utilisateur invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const utilisateur = await this.utilisateurService.getUtilisateurById(idUtilisateur);

      if (!utilisateur) {
        this.message.set('Utilisateur introuvable.');
        return;
      }

      this.utilisateur.set(utilisateur);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement de l’utilisateur.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getStatutUtilisateur(): string {
    if (this.utilisateur()?.actif === 1) {
      return 'Actif';
    }

    return 'Inactif';
  }

  getNomComplet(): string {
    const utilisateur = this.utilisateur();

    if (!utilisateur) {
      return '';
    }

    return `${utilisateur.prenom} ${utilisateur.nom}`;
  }

  getAdresses(): AdresseLivraison[] {
    return this.utilisateur()?.adresse_livraison ?? [];
  }

  getAdresseComplete(adresse: AdresseLivraison): string {
    return `${adresse.rue} ${adresse.numero}, ${adresse.localite.code_postal} ${adresse.localite.localite}`;
  }

  getLabelAdresseParDefaut(adresse: AdresseLivraison): string {
    if (adresse.par_defaut === 1) {
      return 'Adresse par défaut';
    }

    return 'Adresse secondaire';
  }

  async supprimerAdresse(adresse: AdresseLivraison): Promise<void> {
    const confirmation = confirm('Voulez-vous vraiment supprimer cette adresse ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.adresseLivraisonService.deleteAdresseLivraison(adresse.id_adresse);
      await this.chargerUtilisateur();
    }
    catch (error) {
      console.error(error);
      this.message.set('Une erreur est survenue pendant la suppression de l’adresse.');
    }
  }

}