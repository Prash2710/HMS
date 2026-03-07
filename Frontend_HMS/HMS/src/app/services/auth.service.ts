import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, SignUpRequest, JwtResponse } from '../models';

const AUTH_API = '/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // ============================================
  // ANGULAR 17 SIGNALS - Reactive State Management
  // ============================================
  
  private currentUserSignal = signal<JwtResponse | null>(this.loadUserFromStorage());
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Read-only signals exposed to components
  public currentUser = this.currentUserSignal.asReadonly();
  public isLoading = this.isLoadingSignal.asReadonly();
  public error = this.errorSignal.asReadonly();
  
  // Computed signals for reactive values
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);
  public userRoles = computed(() => this.currentUserSignal()?.roles || []);
  public userName = computed(() => {
    const user = this.currentUserSignal();
    return user ? user.username : null;
  });
  public userEmail = computed(() => {
    const user = this.currentUserSignal();
    return user ? user.email : null;
  });
  public userId = computed(() => {
    const user = this.currentUserSignal();
    return user ? user.id : null;
  });
  
  // Role-based computed signals
  public isAdmin = computed(() => this.hasRole('ROLE_ADMIN'));
  public isDoctor = computed(() => this.hasRole('ROLE_DOCTOR'));
  public isPatient = computed(() => this.hasRole('ROLE_PATIENT'));
  public isReceptionist = computed(() => this.hasRole('ROLE_RECEPTIONIST'));
  
  // Observable for backwards compatibility with existing code
  public currentUserValue$ = new BehaviorSubject<JwtResponse | null>(this.loadUserFromStorage());

  constructor() {
    // Load user from storage on service initialization
    const storedUser = this.loadUserFromStorage();
    if (storedUser) {
      this.currentUserSignal.set(storedUser);
      this.currentUserValue$.next(storedUser);
    }

    // Sync signal with BehaviorSubject
    effect(() => {
      this.currentUserValue$.next(this.currentUserSignal());
    });
  }

  // ============================================
  // AUTHENTICATION METHODS
  // ============================================

  /**
   * Login user with credentials
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<JwtResponse>(AUTH_API + 'login', credentials, httpOptions).pipe(
      retry(1), // Retry once on failure
      tap(response => {
        this.handleLoginSuccess(response);
      }),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   */
  register(user: SignUpRequest): Observable<any> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post(AUTH_API + 'signup', user, httpOptions).pipe(
      retry(1),
      tap(() => {
        this.isLoadingSignal.set(false);
      }),
      catchError(error => {
        this.handleAuthError(error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear all storage
    this.clearStorage();
    
    // Reset signals
    this.currentUserSignal.set(null);
    this.errorSignal.set(null);
    this.isLoadingSignal.set(false);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Auto logout (when token expires or unauthorized)
   */
  autoLogout(): void {
    this.errorSignal.set('Session expired. Please login again.');
    this.logout();
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  /**
   * Get JWT token
   */
  getToken(): string | null {
    const user = this.currentUserSignal();
    if (user && user.token) {
      return user.token;
    }
    // Fallback to localStorage
    return localStorage.getItem('token');
  }

  /**
   * Check if token is valid (not expired)
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = this.decodeToken(token);
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiryTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Decode JWT token
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpirationTime(): Date | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (payload && payload.exp) {
      return new Date(payload.exp * 1000);
    }
    return null;
  }

  // ============================================
  // USER INFORMATION
  // ============================================

  /**
   * Get current user ID
   */
  getCurrentUserId(): number | null {
    return this.userId();
  }

  /**
   * Get current user value (for backwards compatibility)
   */
  getCurrentUserValue(): JwtResponse | null {
    return this.currentUserSignal();
  }

  /**
   * Get current username
   */
  getCurrentUsername(): string | null {
    return this.userName();
  }

  /**
   * Get current user email
   */
  getCurrentUserEmail(): string | null {
    return this.userEmail();
  }

  /**
   * Get user roles
   */
  getUserRoles(): string[] {
    return this.userRoles();
  }

  /**
   * Get primary role (first role)
   */
  getPrimaryRole(): string | null {
    const roles = this.userRoles();
    return roles.length > 0 ? roles[0] : null;
  }

  // ============================================
  // ROLE CHECKING
  // ============================================

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Check if user has all specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  /**
   * Get user's role display name
   */
  getRoleDisplayName(): string {
    const role = this.getPrimaryRole();
    if (!role) return 'Guest';
    
    // Remove ROLE_ prefix and capitalize
    return role
      .replace('ROLE_', '')
      .toLowerCase()
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  // ============================================
  // NAVIGATION HELPERS
  // ============================================

  /**
   * Navigate to dashboard based on user role
   */
  navigateToDashboard(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.isDoctor()) {
      this.router.navigate(['/doctor']);
    } else if (this.isPatient()) {
      this.router.navigate(['/patient']);
    } else if (this.isReceptionist()) {
      this.router.navigate(['/receptionist']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Get dashboard route based on role
   */
  getDashboardRoute(): string {
    if (this.isAdmin()) return '/admin';
    if (this.isDoctor()) return '/doctor';
    if (this.isPatient()) return '/patient';
    if (this.isReceptionist()) return '/receptionist';
    return '/dashboard';
  }

  // ============================================
  // STORAGE MANAGEMENT
  // ============================================

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): JwtResponse | null {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Verify token is still valid
        if (this.isTokenValidForUser(user.token)) {
          return user;
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    }
    return null;
  }

  /**
   * Check if token is valid for user
   */
  private isTokenValidForUser(token: string): boolean {
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) return false;
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(response: JwtResponse): void {
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(response));
    localStorage.setItem('token', response.token);
    
    // Store primary role
    if (response.roles && response.roles.length > 0) {
      localStorage.setItem('role', response.roles[0]);
      localStorage.setItem('userId', response.id.toString());
      localStorage.setItem('username', response.username);
    }

    // Update signals
    this.currentUserSignal.set(response);
    this.isLoadingSignal.set(false);
    this.errorSignal.set(null);
  }

  /**
   * Clear all authentication storage
   */
  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: HttpErrorResponse): void {
    this.isLoadingSignal.set(false);
    
    let errorMessage = 'An error occurred during authentication';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid username or password';
          break;
        case 403:
          errorMessage = 'Access forbidden';
          break;
        case 404:
          errorMessage = 'Service not found';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = error.error?.message || error.message || 'Authentication failed';
      }
    }
    
    this.errorSignal.set(errorMessage);
    console.error('Auth Error:', error);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Update user profile in current session
   */
  updateUserProfile(updates: Partial<JwtResponse>): void {
    const currentUser = this.currentUserSignal();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSignal.set(updatedUser);
    }
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Check if currently loading
   */
  isCurrentlyLoading(): boolean {
    return this.isLoadingSignal();
  }

  /**
   * Refresh user data
   */
  refreshUserData(): void {
    const storedUser = this.loadUserFromStorage();
    if (storedUser) {
      this.currentUserSignal.set(storedUser);
    }
  }

  /**
   * Check authentication status
   */
  checkAuthStatus(): boolean {
    const isAuth = this.isAuthenticated();
    const tokenValid = this.isTokenValid();
    
    if (isAuth && !tokenValid) {
      this.autoLogout();
      return false;
    }
    
    return isAuth && tokenValid;
  }

  /**
   * Get time until token expires
   */
  getTimeUntilExpiration(): number | null {
    const expirationTime = this.getTokenExpirationTime();
    if (!expirationTime) return null;
    
    return Math.max(0, expirationTime.getTime() - Date.now());
  }

  /**
   * Get formatted time until expiration
   */
  getFormattedTimeUntilExpiration(): string | null {
    const time = this.getTimeUntilExpiration();
    if (time === null) return null;
    
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
}