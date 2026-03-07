import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignUpRequest } from '../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals
  registerData = signal<SignUpRequest>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    roles: ['patient']
  });

  confirmPassword = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  loading = signal(false);

  onSubmit(): void {
    // Validation
    if (this.registerData().password !== this.confirmPassword()) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (this.registerData().password.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.register(this.registerData()).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.successMessage.set('Registration successful! Redirecting to login...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration failed', error);
        if (error.error && typeof error.error === 'string') {
          this.errorMessage.set(error.error);
        } else {
          this.errorMessage.set('Registration failed. Please try again.');
        }
        this.loading.set(false);
      }
    });
  }

  updateField(field: keyof SignUpRequest, value: any): void {
    this.registerData.update(data => ({ ...data, [field]: value }));
  }
}