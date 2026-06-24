import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const currentUrl = state.url;
  const isLoggedIn = authService.isLoggedIn();
  const AUTH_URLS = ['/auth/login', '/auth/register'];

  if (!AUTH_URLS.includes(currentUrl) && !isLoggedIn) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  if (AUTH_URLS.includes(currentUrl) && isLoggedIn) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
