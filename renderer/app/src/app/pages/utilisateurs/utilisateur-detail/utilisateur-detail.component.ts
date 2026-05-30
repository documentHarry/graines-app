import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdresseLivraison, Localite, Utilisateur } from '../../../types/electron';
import { LocaliteService } from '../../../services/localite.service';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { UtilisateurAdresseLivraisonComponent } from '../utilisateur-adresse-livraison/utilisateur-adresse-livraison.component';

@Component({
  selector: 'app-utilisateur-detail',
  imports: [RouterLink, UtilisateurAdresseLivraisonComponent],
  templateUrl: './utilisateur-detail.component.html',
  styleUrl: './utilisateur-detail.component.css',
})

export class UtilisateurDetailComponent {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly localiteService = inject(LocaliteService);

  id = input<string>();
  utilisateur = signal<Utilisateur | null>(null);
  localites = signal<Localite[]>([]);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerUtilisateur();
    await this.chargerLocalites();
  }

  async chargerLocalites(): Promise<void> {
    try {
      const localites = await this.localiteService.getLocalites();
      this.localites.set(localites);
    }
    catch (error) {
      console.error(error);
      this.message.set('Erreur pendant le chargement des localités.');
    }
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

  getRolesUtilisateur(): string {
    const roles = this.utilisateur()?.utilisateur_role ?? [];

    if (roles.length === 0) {
      return 'Aucun rôle';
    }

    return roles.map(utilisateurRole => utilisateurRole.role.nom_role)
      .join(', ');
  }

  afficherErreurAdresse(message: string): void {
    this.message.set(message);
  }

}