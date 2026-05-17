import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategorieCreateInput } from '../../../types/electron';
import { CategorieService } from '../../../services/categorie.service';

@Component({
  selector: 'app-categorie-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categorie-ajouter.component.html',
  styleUrl: './categorie-ajouter.component.css',
})

export class CategorieAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categorieService = inject(CategorieService);
  private readonly router = inject(Router);

  message = signal('');

  categorieForm = this.formBuilder.group({
    nom_categorie: ['', Validators.required],
    descriptif: [''],
  });

  async enregistrer(): Promise<void> {
    if (this.categorieForm.invalid) {
      this.categorieForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const valeurFormulaire = this.categorieForm.getRawValue();

    const categorie: CategorieCreateInput = {
      nom_categorie: valeurFormulaire.nom_categorie?.trim() ?? '',
      descriptif: valeurFormulaire.descriptif?.trim() || null,
    };

    try {
      await this.categorieService.createCategorie(categorie);
      await this.router.navigate(['/categories']);
    }
    catch (error) {
      const message = String(error);

      if (message.includes('DUPLICATE_CATEGORY')) {
        this.message.set('Une catégorie avec ce nom existe déjà.');
        return;
      }

      console.error(error);
      this.message.set('Une erreur technique est survenue pendant la création de la catégorie.');
    }
  }
}