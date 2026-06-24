import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    const decoded: any = jwtDecode(token);
    const userRole = decoded.role;

    if (allowedRoles.includes(userRole)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
