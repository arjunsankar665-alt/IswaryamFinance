import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface WishlistItem {
  productId: string;
  name: string;
  price?: number;
  slug?: string;
  image?: string;
  category?: string;
  inStock?: boolean;
  attributes?: Record<string, unknown>;
}

export interface WishlistState {
  id?: string;
  items: WishlistItem[];
  updatedAt?: string;
}

interface WishlistResponse {
  success: boolean;
  data: WishlistState;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly endpoint = `${environment.apiUrl}/wishlist`;
  private readonly wishlistSubject = new BehaviorSubject<WishlistState>(this.emptyState());

  readonly wishlist$ = this.wishlistSubject.asObservable();
  readonly items$ = this.wishlist$.pipe(map((state) => state.items));
  readonly count$ = this.items$.pipe(map((items) => items.length));

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        void this.refresh();
      } else {
        this.wishlistSubject.next(this.emptyState());
      }
    });
  }

  private emptyState(): WishlistState {
    return { items: [] };
  }

  private updateState(state: WishlistState): void {
    this.wishlistSubject.next(state ?? this.emptyState());
  }

  private requireAuth(redirect: string): void {
    if (!this.authService.getToken()) {
      this.authService.promptLogin(redirect);
      throw new Error('Authentication required');
    }
  }

  private extractError(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Unable to process wishlist request.';
    }
    return 'Unable to process wishlist request.';
  }

  async refresh(): Promise<void> {
    if (!this.authService.getToken()) {
      this.updateState(this.emptyState());
      return;
    }

    try {
      const response = await firstValueFrom(this.http.get<WishlistResponse>(this.endpoint));
      if (response.success) {
        this.updateState(response.data);
      }
    } catch (error) {
      console.error('Wishlist refresh failed', error);
    }
  }

  async addItem(payload: WishlistItem, redirect = '/wishlist'): Promise<WishlistState> {
    this.requireAuth(redirect);
    try {
      const response = await firstValueFrom(this.http.post<WishlistResponse>(this.endpoint, payload));
      if (!response.success) {
        throw new Error('Unable to add item to wishlist.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }

  async remove(productId: string): Promise<WishlistState> {
    this.requireAuth('/wishlist');
    try {
      const response = await firstValueFrom(
        this.http.delete<WishlistResponse>(`${this.endpoint}/${productId}`)
      );
      if (!response.success) {
        throw new Error('Unable to remove wishlist item.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }

  async clear(): Promise<WishlistState> {
    this.requireAuth('/wishlist');
    try {
      const response = await firstValueFrom(this.http.delete<WishlistResponse>(this.endpoint));
      if (!response.success) {
        throw new Error('Unable to clear wishlist.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }
}
