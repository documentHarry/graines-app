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
    motDePasse: ['', Validators.required]
  });

  async seConnecter(): Promise<void> {
    this.messageErreur = '';

    if (this.connexionForm.invalid) {
      this.connexionForm.markAllAsTouched();
      this.messageErreur = 'Veuillez remplir correctement les champs.';
      return;
    }

    const valeurFormulaire = this.connexionForm.getRawValue();

    try {
      const utilisateur = await this.authService.login(
        valeurFormulaire.email?.trim() ?? '',
        valeurFormulaire.motDePasse ?? ''
      );

      if (!utilisateur) {
        this.messageErreur = 'Email ou mot de passe incorrect.';
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
      await this.router.navigateByUrl(returnUrl);
    }
    catch (error) {
      console.error('Erreur pendant la connexion :', error);
      this.messageErreur = 'Une erreur est survenue pendant la connexion.';
    }
  }

}

