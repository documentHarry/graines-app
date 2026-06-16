import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Utilisateur } from '../../types/electron';
import { UtilisateurService } from '../../services/utilisateur.service';
import { UtilisateurFiltresComponent } from './utilisateur-filtres/utilisateur-filtres.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-utilisateurs',
  imports: [RouterLink, UtilisateurFiltresComponent],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.css',
})

export class UtilisateursComponent {
  private readonly utilisateurService = inject(UtilisateurService);
  readonly authService = inject(AuthService);

  utilisateurs = signal<Utilisateur[]>([]);
  isLoading = signal(true);
  nomRecherche = signal('');
  prenomRecherche = signal('');
  emailRecherche = signal('');
  statutRecherche = signal('');
  roleRecherche = signal('');
  adresseRecherche = signal('');
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
    catch (error) {
      console.error('Erreur chargement utilisateurs', { error });
      this.message.set('Erreur pendant le chargement des utilisateurs.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  rolesDisponibles = computed(() => {
    const roles = this.utilisateurs()
      .flatMap(utilisateur => utilisateur.utilisateur_role ?? [])
      .map(utilisateurRole => utilisateurRole.role.nom_role);

    return [...new Set(roles)].sort();
  });

  getRolesUtilisateur(utilisateur: Utilisateur): string {
    return this.utilisateurService.getRolesUtilisateur(utilisateur);
  }

  utilisateursFiltres = computed(() => {
    return this.utilisateurService.filtrerUtilisateurs(
      this.utilisateurs(),
      this.nomRecherche(),
      this.prenomRecherche(),
      this.emailRecherche(),
      this.statutRecherche(),
      this.roleRecherche(),
      this.adresseRecherche()
    );
  });

  getNomComplet(utilisateur: Utilisateur): string {
    return this.utilisateurService.getNomComplet(utilisateur);
  }

  getStatutUtilisateur(utilisateur: Utilisateur): string {
    return this.utilisateurService.getStatutUtilisateur(utilisateur);
  }

  getNombreAdresses(utilisateur: Utilisateur): number {
    return this.utilisateurService.getNombreAdresses(utilisateur);
  }

}