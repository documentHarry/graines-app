import { Injectable } from '@angular/core';

export interface UtilisateurConnecte {
  id_utilisateur: number;
  email: string;
  nom: string;
  prenom: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly DUREE_INACTIVITE = 90 * 60 * 1000; // 90 minutes
  private utilisateur: UtilisateurConnecte | null = null;
  private timerInactivite: ReturnType<typeof setTimeout> | null = null;

  async login(email: string, motDePasse: string): Promise<UtilisateurConnecte | null> {
    const utilisateur = await (window as any).api.login(email, motDePasse);

    if (!utilisateur) {
      return null;
    }

    this.setUtilisateur(utilisateur);
    return utilisateur;
  }

  setUtilisateur(utilisateur: UtilisateurConnecte): void {
    this.utilisateur = utilisateur;
    sessionStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    this.demarrerSurveillanceInactivite();
  }

  getUtilisateur(): UtilisateurConnecte | null {
    if (this.utilisateur) {
      return this.utilisateur;
    }

    const utilisateurJson = sessionStorage.getItem('utilisateur');

    if (!utilisateurJson) {
      return null;
    }

    this.utilisateur = JSON.parse(utilisateurJson);
    this.demarrerSurveillanceInactivite();

    return this.utilisateur;
  }

  isLoggedIn(): boolean {
    return this.getUtilisateur() !== null;
  }

  hasRole(role: string): boolean {
    const utilisateur = this.getUtilisateur();
    return utilisateur?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    const utilisateur = this.getUtilisateur();

    if (!utilisateur) {
      return false;
    }

    return roles.some(role => utilisateur.roles.includes(role));
  }

  logout(): void {
    this.utilisateur = null;
    sessionStorage.removeItem('utilisateur');

    if (this.timerInactivite) {
      clearTimeout(this.timerInactivite);
      this.timerInactivite = null;
    }
  }

  private demarrerSurveillanceInactivite(): void {
    this.reinitialiserTimerInactivite();

    window.addEventListener('mousemove', this.reinitialiserTimerInactivite);
    window.addEventListener('keydown', this.reinitialiserTimerInactivite);
    window.addEventListener('click', this.reinitialiserTimerInactivite);
  }

  private reinitialiserTimerInactivite = (): void => {
    if (!this.utilisateur) {
      return;
    }

    if (this.timerInactivite) {
      clearTimeout(this.timerInactivite);
    }

    this.timerInactivite = setTimeout(() => {
      this.logout();
    }, this.DUREE_INACTIVITE);
  };

  construireIdentifiantsConnexion(valeurFormulaire: {
    email: string | null;
    mot_de_passe: string | null;
  }): { email: string; mot_de_passe: string } {
    return {
      email: valeurFormulaire.email?.trim() ?? '',
      mot_de_passe: valeurFormulaire.mot_de_passe ?? '',
    };
  }

  getMessageErreurFormulaireConnexion(): string {
    return 'Veuillez remplir correctement les champs.';
  }

  getMessageErreurIdentifiants(): string {
    return 'Email ou mot de passe incorrect.';
  }

  getMessageErreurConnexion(): string {
    return 'Une erreur est survenue pendant la connexion.';
  }
}