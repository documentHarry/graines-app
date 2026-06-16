import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

    const categorie = this.categorieService.construireCategorieCreateInput(
      this.categorieForm.getRawValue()
    );

    try {
      await this.categorieService.createCategorie(categorie);
      await this.router.navigate(['/categories']);
    }
    catch (error) {
      console.error('Erreur création catégorie', { error, formulaire: this.categorieForm.getRawValue(), categorie });
      this.message.set(this.categorieService.getMessageErreurCreation());
    }
  }
}