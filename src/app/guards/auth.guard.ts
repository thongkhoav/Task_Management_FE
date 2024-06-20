import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLocalSaved = authService.decodedToken();

  if (isLocalSaved === null) {
    router.navigate(['/login']);
    console.log('You are not authorized to view this page');

    return false;
  }

  return true;
};
