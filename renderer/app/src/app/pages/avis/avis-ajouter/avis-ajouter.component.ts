import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AvisCreateInput, Produit } from '../../../types/electron';
import { AvisService } from '../../../services/avis.service';
import { ProduitService } from '../../../services/produit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-avis-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './avis-ajouter.component.html',
  styleUrl: './avis-ajouter.component.css',
})

export class AvisAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly avisService = inject(AvisService);
  private readonly produitService = inject(ProduitService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  produits = signal<Produit[]>([]);
  isLoading = signal(true);
  message = signal('');

  avisForm = this.formBuilder.group({
    note: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    titre: [''],
    commentaire: [''],
    produit_id: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.chargerDonneesFormulaire();
  }

  async chargerDonneesFormulaire(): Promise<void> {
    try {
      const produits = await this.produitService.getProduits();

      this.produits.set(produits);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement du formulaire.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.avisForm.invalid) {
      this.avisForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const utilisateur = this.authService.getUtilisateur();

    if (!utilisateur) {
      this.message.set('Vous devez être connecté pour ajouter un avis.');
      return;
    }

    const valeurFormulaire = this.avisForm.getRawValue();

    const avis: AvisCreateInput = {
      note: Number(valeurFormulaire.note),
      titre: valeurFormulaire.titre?.trim() || null,
      commentaire: valeurFormulaire.commentaire?.trim() || null,
      utilisateur_id: utilisateur.id_utilisateur,
      produit_id: Number(valeurFormulaire.produit_id),
    };

    try {
      await this.avisService.createAvis(avis);
      await this.router.navigate(['/avis']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_AVIS')) {
        this.message.set('Vous avez déjà déposé un avis pour ce produit.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la création de l’avis.');
    }
  }
}