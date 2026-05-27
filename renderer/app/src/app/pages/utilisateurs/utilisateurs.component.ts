import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Utilisateur } from '../../types/electron';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateurs',
  imports: [RouterLink],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css',
})

export class UtilisateursComponent {
  private readonly utilisateurService = inject(UtilisateurService);

  utilisateurs = signal<Utilisateur[]>([]);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerUtilisateurs();
  }

  async chargerUtilisateurs(): Promise<void> {
    try {
      const result = await this.utilisateurService.getUtilisateurs();

      this.utilisateurs.set(result);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des utilisateurs.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNomComplet(utilisateur: Utilisateur): string {
    return `${utilisateur.prenom} ${utilisateur.nom}`;
  }

  getStatutUtilisateur(utilisateur: Utilisateur): string {
    if (utilisateur.actif === 1) {
      return 'Actif';
    }

    return 'Inactif';
  }

  getNombreAdresses(utilisateur: Utilisateur): number {
    return utilisateur.adresse_livraison?.length ?? 0;
  }

}