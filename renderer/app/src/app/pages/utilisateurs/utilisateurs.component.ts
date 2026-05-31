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
    catch {
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
    const roles = utilisateur.utilisateur_role ?? [];

    if (roles.length === 0) {
      return 'Aucun rôle';
    }

    return roles.map(utilisateurRole => utilisateurRole.role.nom_role)
      .join(', ');
  }

  utilisateursFiltres = computed(() => {
    const nomRecherche = this.nomRecherche().toLowerCase().trim();
    const prenomRecherche = this.prenomRecherche().toLowerCase().trim();
    const emailRecherche = this.emailRecherche().toLowerCase().trim();
    const statutRecherche = this.statutRecherche();
    const roleRecherche = this.roleRecherche();
    const adresseRecherche = this.adresseRecherche();

    return this.utilisateurs().filter(utilisateur => {

      const correspondNom = nomRecherche === '' ||
        utilisateur.nom.toLowerCase().includes(nomRecherche);

      const correspondPrenom = prenomRecherche === '' ||
        utilisateur.prenom.toLowerCase().includes(prenomRecherche);

      const correspondEmail = emailRecherche === '' ||
        utilisateur.email.toLowerCase().includes(emailRecherche);

      const correspondStatut = statutRecherche === '' ||
        statutRecherche === 'actif' && utilisateur.actif === 1 ||
        statutRecherche === 'inactif' && utilisateur.actif === 0;

      const correspondRole = roleRecherche === '' ||
        (utilisateur.utilisateur_role ?? [])
          .some(utilisateurRole => utilisateurRole.role.nom_role === roleRecherche);

      const nombreAdresses = this.getNombreAdresses(utilisateur);

      const correspondAdresse = adresseRecherche === '' ||
        adresseRecherche === 'avec-adresse' && nombreAdresses > 0 ||
        adresseRecherche === 'sans-adresse' && nombreAdresses === 0;

      return correspondNom && correspondPrenom && correspondEmail && correspondStatut && correspondRole && correspondAdresse;
    });
  });

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