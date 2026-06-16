import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-ajouter',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './role-ajouter.component.html',
  styleUrl: './role-ajouter.component.css',
})

export class RoleAjouterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);

  message = signal('');

  roleForm = this.formBuilder.group({
    nom_role: ['', Validators.required],
  });

  async enregistrer(): Promise<void> {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      this.message.set('Veuillez saisir un nom de rôle.');
      return;
    }

    const role = this.roleService.construireRoleCreateInput(
      this.roleForm.getRawValue()
    );

    try {
      await this.roleService.createRole(role);
      await this.router.navigate(['/roles']);
    }
    catch (error) {
      console.error('Erreur création rôle', { error, formulaire: this.roleForm.getRawValue(), role });
      this.message.set(this.roleService.getMessageErreurCreationRole());
    }
  }
}