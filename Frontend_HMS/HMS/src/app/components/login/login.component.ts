import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  loading = false;
  showPwd = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  constructor() {
    if (this.auth.isLoggedIn) {
      this.router.navigate([this.auth.dashboardRoute]);
    }
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password) {
      this.toast.error('Please enter username and password');
      return;
    }

    this.loading = true;

    this.auth.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate([this.auth.dashboardRoute]);
      },
      error: (err: any) => {
        this.loading = false;
        this.toast.error(err?.error?.message || 'Invalid credentials');
      }
    });
  }
}