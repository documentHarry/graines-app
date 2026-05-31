import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Avis } from '../../../../types/electron';

type AvisFormValue = {
  note: number;
  titre: string | null;
  commentaire: string | null;
};

@Component({
  selector: 'app-produit-avis-form',
  imports: [ReactiveFormsModule],
  templateUrl: './produit-avis-form.component.html',
  styleUrl: './produit-avis-form.component.css',
})
export class ProduitAvisFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  mode = input.required<'ajout' | 'modification'>();
  avis = input<Avis | null>(null);

  onEnregistrer = input.required<(valeur: AvisFormValue) => void | Promise<void>>();
  onAnnuler = input.required<() => void>();

  avisForm = this.formBuilder.group({
    note: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    titre: [''],
    commentaire: ['']
  });

  constructor() {
    effect(() => {
      const avis = this.avis();

      if (this.mode() === 'modification' && avis) {
        this.avisForm.reset({
          note: avis.note ?? 5,
          titre: avis.titre ?? '',
          commentaire: avis.commentaire ?? ''
        });

        return;
      }

      this.avisForm.reset({
        note: 5,
        titre: '',
        commentaire: ''
      });
    });
  }

  envoyerFormulaire(): void {
    if (this.avisForm.invalid) {
      this.avisForm.markAllAsTouched();
      return;
    }

    const valeur = this.avisForm.getRawValue();

    this.onEnregistrer()({
      note: valeur.note ?? 5,
      titre: valeur.titre?.trim() || null,
      commentaire: valeur.commentaire?.trim() || null
    });
  }

  annulerFormulaire(): void {
    this.onAnnuler()();
  }

  getTitreFormulaire(): string {
    if (this.mode() === 'ajout') {
      return 'Ajouter un avis';
    }

    return 'Modifier un avis';
  }
}