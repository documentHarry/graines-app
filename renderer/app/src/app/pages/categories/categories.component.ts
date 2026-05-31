import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Categorie } from '../../types/electron';
import { CategorieService } from '../../services/categorie.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly categorieService = inject(CategorieService);
  readonly authService = inject(AuthService);

  categories = signal<Categorie[]>([]);
  isLoading = signal(true);
  message = signal('');
  rechercheNom = signal('');
  rechercheDescriptif = signal('');

  constructor() {
    this.chargerCategories();
  }

  async chargerCategories(): Promise<void> {
    try {
      const result = await this.categorieService.getCategories();

      this.categories.set(result);
      this.message.set('');
    }
    catch {
      this.message.set('Erreur pendant le chargement des catégories.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  categoriesFiltrees = computed(() => {
    const rechercheNom = this.rechercheNom().toLowerCase().trim();
    const rechercheDescriptif = this.rechercheDescriptif().toLowerCase().trim();

    return this.categories().filter(categorie => {
      const correspondNom = rechercheNom === '' ||  categorie.nom_categorie.toLowerCase().includes(rechercheNom);
      const correspondDescriptif = rechercheDescriptif === '' || (categorie.descriptif ?? '').toLowerCase().includes(rechercheDescriptif);

      return correspondNom && correspondDescriptif;
    });
  });

  changerRechercheNom(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rechercheNom.set(input.value);
  }

  changerRechercheDescriptif(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rechercheDescriptif.set(input.value);
  }

  getNombreProduits(categorie: Categorie): number {
    return categorie._count?.produit ?? 0;
  }

}