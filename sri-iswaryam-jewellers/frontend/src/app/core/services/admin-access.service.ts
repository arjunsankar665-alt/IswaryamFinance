import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export const ADMIN_ACCESS_STORAGE_KEY = 'si_admin_access';

interface VerifyResponse {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAccessService {
  private readonly endpoint = `${environment.apiUrl}/admin/verify-password`;
  private pendingRedirect?: string;

  constructor(private readonly http: HttpClient) {}

  hasAccess(): boolean {
    return localStorage.getItem(ADMIN_ACCESS_STORAGE_KEY) === 'granted';
  }

  rememberRedirect(url: string): void {
    this.pendingRedirect = url;
  }

  consumeRedirect(): string | undefined {
    const target = this.pendingRedirect;
    this.pendingRedirect = undefined;
    return target;
  }

  async verifyPassword(password: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<VerifyResponse>(this.endpoint, { password })
      );

      if (!response.success) {
        throw new Error(response.message || 'Unable to verify admin access.');
      }

      localStorage.setItem(ADMIN_ACCESS_STORAGE_KEY, 'granted');
    } catch (error) {
      throw new Error(this.extractErrorMessage(error));
    }
  }

  revoke(): void {
    localStorage.removeItem(ADMIN_ACCESS_STORAGE_KEY);
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Unable to verify admin access.';
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Unable to verify admin access.';
  }
}
