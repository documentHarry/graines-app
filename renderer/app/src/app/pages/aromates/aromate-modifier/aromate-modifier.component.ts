import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Aromate, ProprieteMedicinale, Variete } from '../../../types/electron';
import { AromateService } from '../../../services/aromate.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-aromate-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aromate-modifier.component.html',
  styleUrl: './aromate-modifier.component.css',
})

export class AromateModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly aromateService = inject(AromateService);
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

  id = input<string>();

  aromate = signal<Aromate | null>(null);
  varietes = signal<Variete[]>([]);
  proprietesMedicinales = signal<ProprieteMedicinale[]>([]);
  proprietesSelectionnees = signal<number[]>([]);
  isLoading = signal(true);
  message = signal('');

  aromateForm = this.formBuilder.group({
    variete_id: [0, [Validators.required, Validators.min(1)]],
    partie_utilisee: [''],
    propriete: [''],
    usage_culinaire: [''],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerDonnees();
  }

  async chargerDonnees(): Promise<void> {
    const idAromate = Number(this.id());

    if (!idAromate) {
      this.message.set('Identifiant de l’aromate invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const aromate = await this.aromateService.getAromateById(idAromate);
      const varietes = await this.varieteService.getVarietes();
      const proprietesMedicinales = await this.proprieteMedicinaleService.getProprietesMedicinales();

      if (!aromate) {
        this.message.set('Aromate introuvable.');
        return;
      }

      this.aromate.set(aromate);
      this.varietes.set(varietes);
      this.proprietesMedicinales.set(proprietesMedicinales);

      this.aromateForm.patchValue({
        variete_id: aromate.variete_id,
        partie_utilisee: aromate.partie_utilisee ?? '',
        propriete: aromate.propriete ?? '',
        usage_culinaire: aromate.usage_culinaire ?? '',
      });

      this.proprietesSelectionnees.set(
        this.aromateService.getProprietesSelectionneesDepuisAromate(aromate)
      );

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement aromate', { error, idAromate });
      this.message.set('Erreur pendant le chargement de l’aromate.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  estProprieteSelectionnee(proprieteId: number): boolean {
    return this.proprietesSelectionnees().includes(proprieteId);
  }

  changerPropriete(event: Event, proprieteId: number): void {
    const input = event.target as HTMLInputElement;
    const proprietes = this.proprietesSelectionnees();

    if (input.checked) {
      this.proprietesSelectionnees.set([...proprietes, proprieteId]);
      return;
    }

    this.proprietesSelectionnees.set(
      proprietes.filter(id => id !== proprieteId)
    );
  }

  async enregistrer(): Promise<void> {
    const aromateActuel = this.aromate();

    if (this.aromateForm.invalid || !aromateActuel) {
      this.aromateForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const aromate = this.aromateService.construireAromateUpdateInput(
      aromateActuel.id_aromate,
      this.aromateForm.getRawValue(),
      this.proprietesSelectionnees()
    );

    try {
      await this.aromateService.updateAromate(aromate);
      await this.router.navigate(['/aromates', aromate.id_aromate]);
    }
    catch (error) {
      console.error('Erreur modification aromate', { error, formulaire: this.aromateForm.getRawValue(), proprietesSelectionnees: this.proprietesSelectionnees(), aromate });
      this.message.set(this.aromateService.getMessageErreurModification());
    }
  }
}