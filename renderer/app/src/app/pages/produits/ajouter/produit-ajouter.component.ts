import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categorie, ProduitCreateInput, Variete } from '../../../types/electron';
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
    categorie_id: [0, [Validators.required, Validators.min(1)]],
    variete_id: [0, [Validators.required, Validators.min(1)]],
    quantite: [0, [Validators.required, Validators.min(0)]],
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
    catch {
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

    const valeurFormulaire = this.produitForm.getRawValue();

    const produit: ProduitCreateInput = {
      intitule: valeurFormulaire.intitule ?? '',
      prix_unitaire: Number(valeurFormulaire.prix_unitaire),
      quantite: Number(valeurFormulaire.quantite),
      categorie_id: Number(valeurFormulaire.categorie_id),
      variete_id: Number(valeurFormulaire.variete_id),
    };

    try {
      await this.produitService.createProduit(produit);

      await this.router.navigate(['/produits']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_PRODUCT')) {
        this.message.set('Un produit avec cet intitulé et cette variété existe déjà.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la création du produit.');
    }
  }
}