import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Angular 17 Signals
  loginData = signal<LoginRequest>({
    username: '',
    password: ''
  });

  errorMessage = signal('');
  loading = signal(false);

  

  onSubmit(): void {
  this.loading.set(true);
  this.errorMessage.set('');

  this.authService.login(this.loginData()).subscribe({
    next: (response: any) => {
      console.log('Login successful', response);

      // 🔐 Store JWT token
      localStorage.setItem('token', response.token);

      // 🔐 Store role (IMPORTANT)
      if (response.roles && response.roles.length > 0) {
        localStorage.setItem('role', response.roles[0]);
      }

      // redirect
      this.redirectToDashboard();
    },
    error: (error) => {
      console.error('Login failed', error);
      this.errorMessage.set('Invalid username or password');
      this.loading.set(false);
    }
  });
}



redirectToDashboard() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (!user || !user.roles) {
    console.error('No user or roles found');
    return;
  }

  if (user.roles.includes('ROLE_ADMIN')) {
    this.router.navigate(['/admin/dashboard']);
  } else if (user.roles.includes('ROLE_DOCTOR')) {
    this.router.navigate(['/doctor/dashboard']);
  } else if (user.roles.includes('ROLE_PATIENT')) {
    this.router.navigate(['/patient/dashboard']);
  }
}





  updateUsername(value: string): void {
    this.loginData.update(data => ({ ...data, username: value }));
  }

  updatePassword(value: string): void {
    this.loginData.update(data => ({ ...data, password: value }));
  }
}