import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ADMIN_ACCESS_STORAGE_KEY } from './admin-access.service';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  role?: string;
}

interface AuthSuccessResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

interface ProfileResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  private readonly loginPromptSubject = new Subject<string | undefined>();
  private redirectUrl?: string;
  private readonly tokenStorageKey = 'si_auth_token';
  private readonly userStorageKey = 'si_auth_user';
  private readonly apiBase = environment.apiUrl;

  readonly user$: Observable<AuthUser | null> = this.userSubject.asObservable();
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(map(Boolean));
  readonly loginPrompt$ = this.loginPromptSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.restoreSession();
  }

  promptLogin(redirectUrl?: string): void {
    if (redirectUrl) {
      this.redirectUrl = redirectUrl;
    }
    this.loginPromptSubject.next(redirectUrl);
  }

  async login(credentials: { email: string; password: string }): Promise<AuthUser> {
    return this.authenticate('login', credentials);
  }

  async register(payload: { name: string; email: string; password: string }): Promise<AuthUser> {
    return this.authenticate('register', payload);
  }

  async fetchProfile(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const response = await firstValueFrom(
        this.http.get<ProfileResponse>(`${this.apiBase}/auth/me`, {
          headers: this.buildAuthHeaders(token)
        })
      );
      if (response.success) {
        this.persistUser(response.data.user);
        return response.data.user;
      }
      return null;
    } catch (error) {
      if (this.shouldInvalidateSession(error)) {
        this.clearSession();
      } else {
        console.warn('Profile refresh failed, keeping cached session.', error);
      }
      return this.userSubject.value;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  async logout(): Promise<void> {
    this.clearSession();
    this.redirectUrl = undefined;
    await this.router.navigateByUrl('/');
  }

  setRedirectUrl(url?: string): void {
    this.redirectUrl = url;
  }

  private async authenticate(endpoint: 'login' | 'register', payload: unknown): Promise<AuthUser> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthSuccessResponse>(`${this.apiBase}/auth/${endpoint}`, payload)
      );

      if (!response.success) {
        throw new Error('Unable to authenticate.');
      }

      this.persistSession(response.data.token, response.data.user);
      await this.handlePostLoginNavigation();
      return response.data.user;
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  private async handlePostLoginNavigation(): Promise<void> {
    if (!this.redirectUrl) {
      return;
    }
    const target = this.redirectUrl;
    this.redirectUrl = undefined;
    await this.router.navigateByUrl(target);
  }

  private buildAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private persistSession(token: string, user: AuthUser): void {
    localStorage.setItem(this.tokenStorageKey, token);
    this.persistUser(user);
  }

  private persistUser(user: AuthUser): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.tokenStorageKey);
    const rawUser = localStorage.getItem(this.userStorageKey);
    if (token && rawUser) {
      try {
        const parsed = JSON.parse(rawUser) as AuthUser;
        this.userSubject.next(parsed);
        void this.fetchProfile();
      } catch {
        this.clearSession();
      }
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.userStorageKey);
    localStorage.removeItem(ADMIN_ACCESS_STORAGE_KEY);
    this.userSubject.next(null);
  }

  private shouldInvalidateSession(error: unknown): boolean {
    if (error instanceof HttpErrorResponse) {
      return error.status === 401 || error.status === 403;
    }
    return false;
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Unable to complete the request. Please try again.';
    }
    return 'Unable to complete the request. Please try again.';
  }
}
