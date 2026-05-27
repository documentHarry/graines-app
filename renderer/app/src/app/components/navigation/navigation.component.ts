import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})

export class NavigationComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  getInitiales(): string {
    const utilisateur = this.authService.getUtilisateur();

    if (!utilisateur) {
      return '';
    }

    const prenom = utilisateur.prenom?.charAt(0).toUpperCase() ?? '';
    const nom = utilisateur.nom?.charAt(0).toUpperCase() ?? '';

    return `${prenom}. ${nom}.`;
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/connexion');
  }
}