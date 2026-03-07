import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Angular 17: Functional guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// Role-based guard
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    const userRoles = authService.userRoles();
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};