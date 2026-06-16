import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProprieteMedicinale, Variete } from '../../../types/electron';
import { AromateService } from '../../../services/aromate.service';
import { ProprieteMedicinaleService } from '../../../services/propriete-medicinale.service';
import { VarieteService } from '../../../services/variete.service';

@Component({
  selector: 'app-aromate-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aromate-ajouter.component.html',
  styleUrl: './aromate-ajouter.component.css',
})

export class AromateAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly aromateService = inject(AromateService);
  private readonly proprieteMedicinaleService = inject(ProprieteMedicinaleService);
  private readonly varieteService = inject(VarieteService);
  private readonly router = inject(Router);

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
    try {
      const varietes = await this.varieteService.getVarietes();
      const proprietesMedicinales = await this.proprieteMedicinaleService.getProprietesMedicinales();

      this.varietes.set(varietes);
      this.proprietesMedicinales.set(proprietesMedicinales);
      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement données aromate', { error });
      this.message.set('Erreur pendant le chargement des données.');
    }
    finally {
      this.isLoading.set(false);
    }
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
    if (this.aromateForm.invalid) {
      this.aromateForm.markAllAsTouched();
      this.message.set('Veuillez remplir les champs obligatoires.');
      return;
    }

    const aromate = this.aromateService.construireAromateCreateInput(
      this.aromateForm.getRawValue(),
      this.proprietesSelectionnees()
    );

    try {
      await this.aromateService.createAromate(aromate);
      await this.router.navigate(['/aromates']);
    }
    catch (error) {
      console.error('Erreur création aromate', { error, formulaire: this.aromateForm.getRawValue(), proprietesSelectionnees: this.proprietesSelectionnees(), aromate });
      this.message.set(this.aromateService.getMessageErreurCreation());
    }
  }
}