import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-connexion',
  imports: [ ReactiveFormsModule ],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})

export class ConnexionComponent {

  private readonly formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  messageErreur = '';

  connexionForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    mot_de_passe: ['', Validators.required],
  });

  async seConnecter(): Promise<void> {
    this.messageErreur = '';

    if (this.connexionForm.invalid) {
      this.connexionForm.markAllAsTouched();
      this.messageErreur = this.authService.getMessageErreurFormulaireConnexion();
      return;
    }

    const identifiants = this.authService.construireIdentifiantsConnexion(this.connexionForm.getRawValue());

    try {
      const utilisateur = await this.authService.login(identifiants.email, identifiants.mot_de_passe);

      if (!utilisateur) {
        this.messageErreur = this.authService.getMessageErreurIdentifiants();
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
      await this.router.navigateByUrl(returnUrl);
    }
    catch (error) {
      console.error('Erreur connexion', { error, formulaire: this.connexionForm.getRawValue(), identifiants });
      this.messageErreur = this.authService.getMessageErreurConnexion();
    }
  }

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
