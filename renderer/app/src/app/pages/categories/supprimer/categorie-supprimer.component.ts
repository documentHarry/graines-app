import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categorie } from '../../../types/electron';
import { CategorieService } from '../../../services/categorie.service';

@Component({
  selector: 'app-categorie-supprimer',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorie-supprimer.component.html',
  styleUrl: './categorie-supprimer.component.css',
})
export class CategorieSupprimerComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categorieService = inject(CategorieService);
  private readonly router = inject(Router);

  id = input<string>();

  categorie = signal<Categorie | null>(null);
  categories = signal<Categorie[]>([]);
  isLoading = signal(true);
  message = signal('');

  reaffectationForm = this.formBuilder.group({
    categorie_destination_id: [0, [Validators.required, Validators.min(1)]],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    const idCategorie = Number(this.id());

    if (!idCategorie) {
      this.message.set('Identifiant de la catégorie invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const categorie = await this.categorieService.getCategorieById(idCategorie);
      const categories = await this.categorieService.getCategories();

      if (!categorie) {
        this.message.set('Catégorie introuvable.');
        return;
      }

      this.categorie.set(categorie);
      this.categories.set(categories.filter( item => item.id_categorie !== categorie.id_categorie));

      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement de la catégorie.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  getNombreProduits(): number {
    return this.categorie()?._count?.produit ?? 0;
  }

  async supprimerCategorie(): Promise<void> {
    const categorie = this.categorie();

    if (!categorie) {
      return;
    }

    const confirmation = confirm('Voulez-vous vraiment supprimer cette catégorie ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.categorieService.deleteCategorie(categorie.id_categorie);
      await this.router.navigate(['/categories']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('CATEGORY_HAS_PRODUCTS')) {
        this.message.set('Cette catégorie contient des produits. Veuillez choisir une catégorie de réaffectation.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur est survenue pendant la suppression de la catégorie.');
    }
  }

  async supprimerAvecReaffectation(): Promise<void> {
    const categorie = this.categorie();

    if (!categorie) {
      return;
    }

    if (this.reaffectationForm.invalid) {
      this.reaffectationForm.markAllAsTouched();
      this.message.set('Veuillez choisir une catégorie de réaffectation.');
      return;
    }

    const valeurFormulaire = this.reaffectationForm.getRawValue();
    const idDestination = Number(valeurFormulaire.categorie_destination_id);
    const confirmation = confirm('Les produits seront réaffectés à la catégorie choisie. Confirmer la suppression ?');

    if (!confirmation) {
      return;
    }

    try {
      await this.categorieService.deleteCategorieWithReaffectation(
        categorie.id_categorie,
        idDestination
      );

      await this.router.navigate(['/categories']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('SAME_CATEGORY')) {
        this.message.set('La catégorie de destination doit être différente.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur est survenue pendant la réaffectation.');
    }
  }

  async annuler(): Promise<void> {
    await this.router.navigate(['/categories']);
  }
}