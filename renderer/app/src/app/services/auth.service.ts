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
  private utilisateur: UtilisateurConnecte | null = null;

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
    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
  }

  getUtilisateur(): UtilisateurConnecte | null {
    if (this.utilisateur) {
      return this.utilisateur;
    }

    const utilisateurJson = localStorage.getItem('utilisateur');

    if (!utilisateurJson) {
      return null;
    }

    this.utilisateur = JSON.parse(utilisateurJson);
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
    localStorage.removeItem('utilisateur');
  }
}