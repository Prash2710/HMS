import { Routes } from '@angular/router';
import { roleGuard } from './gaurds/auth.gaurd';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'admin/dashboard',
    canActivate: [roleGuard(['ROLE_ADMIN'])],
    loadComponent: () =>
      import('./components/admin/admin.component')
        .then(m => m.AdminDashboardComponent)
  },

  {
    path: 'doctor/dashboard',
    canActivate: [roleGuard(['ROLE_DOCTOR'])],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  {
    path: 'patient/dashboard',
    canActivate: [roleGuard(['ROLE_PATIENT'])],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  { path: '**', redirectTo: 'login' }
];
