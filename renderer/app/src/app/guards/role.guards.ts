import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesAutorises = route.data['roles'] as string[] | undefined;

  if (!rolesAutorises || rolesAutorises.length === 0) {
    return true;
  }

  if (authService.hasAnyRole(rolesAutorises)) {
    return true;
  }

  return router.createUrlTree(['/']);
};