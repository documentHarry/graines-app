import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categorie } from '../../../types/electron';
import { CategorieService } from '../../../services/categorie.service';

@Component({
  selector: 'app-categorie-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorie-modifier.component.html',
  styleUrl: './categorie-modifier.component.css',
})

export class CategorieModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categorieService = inject(CategorieService);
  private readonly router = inject(Router);

  id = input<string>();

  categorie = signal<Categorie | null>(null);
  isLoading = signal(true);
  message = signal('');

  categorieForm = this.formBuilder.group({
    nom_categorie: ['', Validators.required],
    descriptif: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerCategorie();
  }

  async chargerCategorie(): Promise<void> {
    const idCategorie = Number(this.id());

    if (!idCategorie) {
      this.message.set('Identifiant de la catégorie invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const categorie = await this.categorieService.getCategorieById(idCategorie);

      if (!categorie) {
        this.message.set('Catégorie introuvable.');
        return;
      }

      this.categorie.set(categorie);

      this.categorieForm.patchValue({
        nom_categorie: categorie.nom_categorie,
        descriptif: categorie.descriptif ?? '',
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement catégorie', { error, idCategorie });
      this.message.set('Erreur pendant le chargement de la catégorie.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    const categorieActuelle = this.categorie();

    if (this.categorieForm.invalid || !categorieActuelle) {
      this.categorieForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const categorie = this.categorieService.construireCategorieUpdateInput(
      categorieActuelle.id_categorie,
      this.categorieForm.getRawValue()
    );

    try {
      await this.categorieService.updateCategorie(categorie);
      await this.router.navigate(['/categories']);
    }
    catch (error) {
      console.error('Erreur modification catégorie', { error, formulaire: this.categorieForm.getRawValue(), categorie });
      this.message.set(this.categorieService.getMessageErreurModification());
    }
  }
}