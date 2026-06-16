import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categorie, Produit, Variete } from '../../../types/electron';
import { CategorieService } from '../../../services/categorie.service';
import { ProduitService } from '../../../services/produit.service';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-produit-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produit-modifier.component.html',
  styleUrl: './produit-modifier.component.css',
})

export class ProduitModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categorieService = inject(CategorieService);
  private readonly produitService = inject(ProduitService);
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

  id = input<string>();

  produit = signal<Produit | null>(null);
  categories = signal<Categorie[]>([]);
  varietes = signal<Variete[]>([]);
  isLoading = signal(true);
  message = signal('');

  produitForm = this.formBuilder.group({
    intitule: ['', Validators.required],
    prix_unitaire: [0, [Validators.required, Validators.min(0.01)]],
    quantite: [0, [Validators.required, Validators.min(0)]],
    categorie_id: [0, [Validators.required, Validators.min(1)]],
    variete_id: [0, [Validators.required, Validators.min(1)]]
  });

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    const idProduit = Number(this.id());

    if (!idProduit) {
      this.message.set('Identifiant du produit invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const categories = await this.categorieService.getCategories();
      const varietes = await this.varieteService.getVarietes();
      const produit = await this.produitService.getProduitById(idProduit);

      if (!produit) {
        this.message.set('Produit introuvable.');
        return;
      }

      this.categories.set(categories);
      this.varietes.set(varietes);
      this.produit.set(produit);

      this.produitForm.patchValue({
        intitule: produit.intitule,
        prix_unitaire: produit.prix_unitaire,
        quantite: produit.quantite,
        categorie_id: produit.categorie_id,
        variete_id: produit.variete_id,
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement produit', { error, idProduit });
      this.message.set('Erreur pendant le chargement du produit.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    if (this.produitForm.invalid || !this.produit()) {
      this.produitForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const produit = this.produitService.construireProduitUpdateInput(
      this.produit()!.id_produit,
      this.produitForm.getRawValue()
    );

    try {
      await this.produitService.updateProduit(produit);
      await this.router.navigate(['/produits', produit.id_produit]);
    }
    catch (error) {
      console.error('Erreur modification produit', { error, formulaire: this.produitForm.getRawValue(), produit });
      this.message.set(this.produitService.getMessageErreurModification());
    }
  }
}