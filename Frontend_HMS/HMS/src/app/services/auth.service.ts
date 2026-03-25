import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import type { AuthResponse } from '../models';
import type { LoginRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private API = '/api/auth';  //for production
  private subject = new BehaviorSubject<AuthResponse | null>(this.storedUser());
  currentUser$ = this.subject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, req).pipe(
      tap(res => {
        localStorage.setItem('hms_token', res.token);
        localStorage.setItem('hms_user', JSON.stringify(res));
        this.subject.next(res);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    this.subject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUser(): AuthResponse | null { return this.subject.value; }
  get token(): string | null { return localStorage.getItem('hms_token'); }
  get isLoggedIn(): boolean { return !!this.token && !!this.currentUser; }

  hasRole(role: string): boolean {
  return this.currentUser?.roles?.some(r =>
    r === role || r === `ROLE_${role}`
  ) ?? false;
}
  get isAdmin(): boolean        { return this.hasRole('ADMIN'); }
  get isDoctor(): boolean       { return this.hasRole('DOCTOR'); }
  get isReceptionist(): boolean { return this.hasRole('RECEPTIONIST'); }

  get dashboardRoute(): string {
  if (this.isAdmin)        return '/admin/dashboard';
  if (this.isReceptionist) return '/reception/dashboard';
  if (this.isDoctor)       return '/doctor/dashboard';
  return '/login';
}

  private storedUser(): AuthResponse | null {
    try { const u = localStorage.getItem('hms_user'); return u ? JSON.parse(u) : null; }
    catch { return null; }
  }
}