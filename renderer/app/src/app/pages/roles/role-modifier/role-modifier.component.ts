import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role } from '../../../types/electron';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-modifier',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './role-modifier.component.html',
  styleUrl: './role-modifier.component.css',
})

export class RoleModifierComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);

  id = input<string>();

  role = signal<Role | null>(null);
  isLoading = signal(true);
  message = signal('');

  roleForm = this.formBuilder.group({
    nom_role: ['', Validators.required],
  });

  async ngOnInit(): Promise<void> {
    await this.chargerRole();
  }

  async chargerRole(): Promise<void> {
    const idRole = Number(this.id());

    if (!idRole) {
      this.message.set('Identifiant du rôle invalide.');
      this.isLoading.set(false);
      return;
    }

    try {
      const roles = await this.roleService.getRoles();
      const role = roles.find(item => item.id_role === idRole) ?? null;

      if (!role) {
        this.message.set('Rôle introuvable.');
        return;
      }

      this.role.set(role);

      this.roleForm.patchValue({
        nom_role: role.nom_role,
      });

      this.message.set('');
    }
    catch (error) {
      console.error('Erreur chargement rôle', { error, idRole });
      this.message.set('Erreur pendant le chargement du rôle.');
    }
    finally {
      this.isLoading.set(false);
    }
  }

  async enregistrer(): Promise<void> {
    const roleActuel = this.role();

    if (this.roleForm.invalid || !roleActuel) {
      this.roleForm.markAllAsTouched();
      this.message.set('Veuillez saisir un nom de rôle.');
      return;
    }

    const role = this.roleService.construireRoleUpdateInput(
      roleActuel.id_role,
      this.roleForm.getRawValue()
    );

    try {
      await this.roleService.updateRole(role);
      await this.router.navigate(['/roles']);
    }
    catch (error) {
      console.error('Erreur modification rôle', { error, formulaire: this.roleForm.getRawValue(), role });
      this.message.set(this.roleService.getMessageErreurModificationRole());
    }
  }
}