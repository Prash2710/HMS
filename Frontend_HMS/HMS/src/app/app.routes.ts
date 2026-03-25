import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './gaurds/auth.gaurd';

export const routes: Routes = [

  // 🔐 Login
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(m => m.LoginComponent)
  },

  // 🔥 ADMIN DASHBOARD (NO LAYOUT)
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard('ADMIN')],
    loadComponent: () =>
      import('./components/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // 🔥 RECEPTION DASHBOARD
  {
    path: 'reception/dashboard',
    canActivate: [authGuard, roleGuard('RECEPTIONIST')],
    loadComponent: () =>
      import('./components/reception-dashboard/reception-dashboard.component')
        .then(m => m.ReceptionDashboardComponent)
  },

  // 🔥 DOCTOR DASHBOARD
  {
    path: 'doctor/dashboard',
    canActivate: [authGuard, roleGuard('DOCTOR')],
    loadComponent: () =>
      import('./components/doctors/doctors.component')
        .then(m => m.DoctorsComponent)
  },

  // 🔧 FEATURES (NO LAYOUT)
  {
    path: 'doctors',
    canActivate: [authGuard, roleGuard('ADMIN')],
    loadComponent: () =>
      import('./components/doctors/doctors.component')
        .then(m => m.DoctorsComponent)
  },

  {
  path: 'appointments',
  loadComponent: () =>
    import('./components/appointments/appointments.component')
      .then(m => m.AppointmentsComponent)
},

  {
    path: 'patients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/patients/patients.component')
        .then(m => m.PatientsComponent)
  },

  {
    path: 'receptionists',
    canActivate: [authGuard, roleGuard('ADMIN')],
    loadComponent: () =>
      import('./components/receptionists/receptionists.component')
        .then(m => m.ReceptionistsComponent)
  },

  // ❌ fallback
  { path: '**', redirectTo: 'login' }
];