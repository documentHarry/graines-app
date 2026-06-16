import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categorie, Variete } from '../../../types/electron';
import { CategorieService } from '../../../services/categorie.service';
import { ProduitService } from '../../../services/produit.service';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-produit-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produit-ajouter.component.html',
  styleUrl: './produit-ajouter.component.css',
})

export class ProduitAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categorieService = inject(CategorieService);
  private readonly varieteService = inject(VarieteService);
  private readonly produitService = inject(ProduitService);
  private readonly router = inject(Router);

  categories = signal<Categorie[]>([]);
  varietes = signal<Variete[]>([]);
  isLoading = signal(true);
  message = signal('');

  produitForm = this.formBuilder.group({
    intitule: ['', Validators.required],
    prix_unitaire: [0, [Validators.required, Validators.min(0.01)]],
    quantite: [0, [Validators.required, Validators.min(0)]],
    categorie_id: [0, [Validators.required, Validators.min(1)]],
    variete_id: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.chargerDonneesFormulaire();
  }

  async chargerDonneesFormulaire(): Promise<void> {
    try {
      const categories = await this.categorieService.getCategories();
      const varietes = await this.varieteService.getVarietes();

      this.categories.set(categories);
      this.varietes.set(varietes);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement formulaire produit', { error });
      this.message.set('Erreur pendant le chargement du formulaire.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const produit = this.produitService.construireProduitCreateInput(
      this.produitForm.getRawValue()
    );

    try {
      await this.produitService.createProduit(produit);
      await this.router.navigate(['/produits']);
    }
    catch (error) {
      console.error('Erreur création produit', { error, formulaire: this.produitForm.getRawValue(), produit });
      this.message.set(this.produitService.getMessageErreurCreation());
    }
  }
}