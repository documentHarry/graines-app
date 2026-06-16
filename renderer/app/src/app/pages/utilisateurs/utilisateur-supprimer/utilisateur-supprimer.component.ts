import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Utilisateur } from '../../../types/electron';
import { UtilisateurService } from '../../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-supprimer',
  imports: [RouterLink],
  templateUrl: './utilisateur-supprimer.component.html',
  styleUrl: './utilisateur-supprimer.component.css',
})

export class UtilisateurSupprimerComponent {
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly router = inject(Router);

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
    catch (error) {
      console.error('Erreur chargement utilisateur', { error, idUtilisateur });
      this.message.set('Erreur pendant le chargement de l’utilisateur.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNomComplet(): string {
    return this.utilisateurService.getNomComplet(this.utilisateur());
  }

  getNombreAdresses(): number {
    return this.utilisateurService.getNombreAdresses(this.utilisateur());
  }

  async supprimerUtilisateur(): Promise<void> {
    const utilisateur = this.utilisateur();

    if (!utilisateur) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment désactiver cet utilisateur ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.utilisateurService.deleteUtilisateur(utilisateur.id_utilisateur);
      await this.router.navigate(['/utilisateurs']);
    }
    catch (error) {
      console.error('Erreur suppression utilisateur', { error, utilisateur });
      this.message.set(this.utilisateurService.getMessageErreurSuppression());
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/utilisateurs', this.utilisateur()?.id_utilisateur]);
  }
}