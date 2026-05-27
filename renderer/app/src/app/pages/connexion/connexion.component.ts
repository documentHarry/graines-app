import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  imports: [ FormsModule ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})

export class ConnexionComponent {
  email = '';
  motDePasse = '';
  messageErreur = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  async seConnecter(): Promise<void> {
    console.log('Début connexion');
    console.log('Email saisi :', this.email);

    this.messageErreur = '';

    if (!this.email || !this.motDePasse) {
      console.log('Champs manquants');
      this.messageErreur = 'Veuillez remplir tous les champs.';
      return;
    }

    try {
      console.log('Avant authService.login');

      const utilisateur = await this.authService.login(
        this.email,
        this.motDePasse
      );

      console.log('Utilisateur retourné :', utilisateur);

      if (!utilisateur) {
        console.log('Utilisateur null');
        this.messageErreur = 'Email ou mot de passe incorrect.';
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

      console.log('Redirection vers :', returnUrl);

      this.router.navigateByUrl(returnUrl);
    }
    catch (error) {
      console.error('Erreur pendant la connexion :', error);
      this.messageErreur = 'Une erreur est survenue pendant la connexion.';
    }
  }

}

  /*


    this.authService.setUtilisateur({
      id_utilisateur: 1,
      email: this.email,
      nom: 'Thomas',
      prenom: 'Jean',
      roles: [ 'ADMIN' ]
    });

  async seConnecter(): Promise<void> {
    this.messageErreur = '';
    this.messageErreur = `Tu as cliqué avec l'email : ${this.email}`;
// jthomas@example.org
// &o)FpKqbK0
    if (!this.email || !this.motDePasse) {
      this.messageErreur = 'Veuillez remplir tous les champs.';
      return;
    }


  }
    */

