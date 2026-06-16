import { Injectable, inject } from '@angular/core';
import { Utilisateur, UtilisateurCreateInput, UtilisateurUpdateInput } from '../types/electron';
import { ElectronService } from './electron.service';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private readonly electronService = inject(ElectronService);

  getUtilisateurs(): Promise<Utilisateur[]> {
    return this.electronService.getApi().getUtilisateurs();
  }

  getUtilisateurById(id: number): Promise<Utilisateur | null> {
    return this.electronService.getApi().getUtilisateurById(id);
  }

  createUtilisateur(utilisateur: UtilisateurCreateInput): Promise<Utilisateur> {
    return this.electronService.getApi().createUtilisateur(utilisateur);
  }

  updateUtilisateur(utilisateur: UtilisateurUpdateInput): Promise<Utilisateur> {
    return this.electronService.getApi().updateUtilisateur(utilisateur);
  }

  deleteUtilisateur(id: number): Promise<Utilisateur> {
    return this.electronService.getApi().deleteUtilisateur(id);
  }

  filtrerUtilisateurs(
    utilisateurs: Utilisateur[],
    nomRecherche: string,
    prenomRecherche: string,
    emailRecherche: string,
    statutRecherche: string,
    roleRecherche: string,
    adresseRecherche: string
  ): Utilisateur[] {
    const nom = nomRecherche.toLowerCase().trim();
    const prenom = prenomRecherche.toLowerCase().trim();
    const email = emailRecherche.toLowerCase().trim();

    return utilisateurs.filter(utilisateur => {
      const correspondNom = nom === '' || utilisateur.nom.toLowerCase().includes(nom);

      const correspondPrenom = prenom === '' || utilisateur.prenom.toLowerCase().includes(prenom);

      const correspondEmail = email === '' || utilisateur.email.toLowerCase().includes(email);

      const correspondStatut =
        statutRecherche === '' ||
        statutRecherche === 'actif' && utilisateur.actif === 1 ||
        statutRecherche === 'inactif' && utilisateur.actif === 0;

      const correspondRole =
        roleRecherche === '' ||
        (utilisateur.utilisateur_role ?? [])
          .some(utilisateurRole => utilisateurRole.role.nom_role === roleRecherche);

      const nombreAdresses = this.getNombreAdresses(utilisateur);

      const correspondAdresse =
        adresseRecherche === '' ||
        adresseRecherche === 'avec-adresse' && nombreAdresses > 0 ||
        adresseRecherche === 'sans-adresse' && nombreAdresses === 0;

      return correspondNom && correspondPrenom && correspondEmail  && correspondStatut && correspondRole && correspondAdresse;
    });
  }

  getRolesUtilisateur(utilisateur: Utilisateur | null): string {
    const roles = utilisateur?.utilisateur_role ?? [];

    if (roles.length === 0) {
      return 'Aucun rôle';
    }

    return roles
      .map(utilisateurRole => utilisateurRole.role.nom_role)
      .join(', ');
  }

  getNomComplet(utilisateur: Utilisateur | null): string {
    if (!utilisateur) {
      return '';
    }

    return `${utilisateur.prenom} ${utilisateur.nom}`;
  }

  getStatutUtilisateur(utilisateur: Utilisateur | null): string {
    if (utilisateur?.actif === 1) {
      return 'Actif';
    }

    return 'Inactif';
  }

  getNombreAdresses(utilisateur: Utilisateur | null): number {
    return utilisateur?.adresse_livraison?.length ?? 0;
  }

  construireUtilisateurCreateInput(valeurFormulaire: {
    nom: string | null;
    prenom: string | null;
    email: string | null;
    mot_de_passe: string | null;
  }): UtilisateurCreateInput {
    return {
      nom: valeurFormulaire.nom?.trim() ?? '',
      prenom: valeurFormulaire.prenom?.trim() ?? '',
      email: valeurFormulaire.email?.trim() ?? '',
      mot_de_passe: valeurFormulaire.mot_de_passe ?? '',
    };
  }

  construireUtilisateurUpdateInput(
    idUtilisateur: number,
    valeurFormulaire: {
      nom: string | null;
      prenom: string | null;
      email: string | null;
      actif: number | null;
    }
  ): UtilisateurUpdateInput {
    return {
      id_utilisateur: idUtilisateur,
      nom: valeurFormulaire.nom?.trim() ?? '',
      prenom: valeurFormulaire.prenom?.trim() ?? '',
      email: valeurFormulaire.email?.trim() ?? '',
    };
  }

  getMessageErreurCreation(): string {
    return 'Une erreur est survenue pendant la création de l’utilisateur.';
  }

  getMessageErreurModification(): string {
    return 'Une erreur est survenue pendant la modification de l’utilisateur.';
  }

  getMessageErreurSuppression(): string {
    return 'Une erreur est survenue pendant la suppression de l’utilisateur.';
  }

}