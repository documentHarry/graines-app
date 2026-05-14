import { Component, inject, signal } from '@angular/core';
import { Categorie } from '../../types/electron';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly categorieService = inject(CategorieService);

  categories = signal<Categorie[]>([]);
  isLoading = signal(true);
  message = signal('');

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
}