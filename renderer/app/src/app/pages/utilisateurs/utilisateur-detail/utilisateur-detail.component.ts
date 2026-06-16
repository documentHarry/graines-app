import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdresseLivraison, Utilisateur } from '../../../types/electron';
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

  id = input<string>();
  utilisateur = signal<Utilisateur | null>(null);
  isLoading = signal(true);
  message = signal('');

  async ngOnInit(): Promise<void> {
    await this.chargerUtilisateur();
  }

  chargerUtilisateur = async (): Promise<void> => {
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
  };

  getStatutUtilisateur(): string {
    return this.utilisateurService.getStatutUtilisateur(this.utilisateur());
  }

  getNomComplet(): string {
    return this.utilisateurService.getNomComplet(this.utilisateur());
  }

  getRolesUtilisateur(): string {
    return this.utilisateurService.getRolesUtilisateur(this.utilisateur());
  }

  getAdresses(): AdresseLivraison[] {
    return this.utilisateur()?.adresse_livraison ?? [];
  }

}