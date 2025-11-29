import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface CartItem {
  productId: string;
  name: string;
  slug?: string;
  image?: string;
  price: number;
  quantity: number;
  inStock?: boolean;
  category?: string;
  attributes?: Record<string, unknown>;
}

export interface CartTotals {
  subtotal: number;
  itemCount: number;
  totalQuantity: number;
}

export interface CartState {
  id?: string;
  items: CartItem[];
  totals: CartTotals;
  updatedAt?: string;
}

interface CartResponse {
  success: boolean;
  data: CartState;
  message?: string;
}

export interface AddCartItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity?: number;
  slug?: string;
  image?: string;
  inStock?: boolean;
  category?: string;
  attributes?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly endpoint = `${environment.apiUrl}/cart`;
  private readonly cartSubject = new BehaviorSubject<CartState>(this.emptyState());

  readonly cart$ = this.cartSubject.asObservable();
  readonly items$ = this.cart$.pipe(map((cart) => cart.items));
  readonly totals$ = this.cart$.pipe(map((cart) => cart.totals));
  readonly itemCount$ = this.cart$.pipe(map((cart) => cart.totals.itemCount));

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.authService.user$.subscribe((user) => {
      if (user) {
        void this.refresh();
      } else {
        this.cartSubject.next(this.emptyState());
      }
    });
  }

  private emptyState(): CartState {
    return {
      items: [],
      totals: { subtotal: 0, itemCount: 0, totalQuantity: 0 }
    };
  }

  private requireAuth(redirect: string): void {
    if (!this.authService.getToken()) {
      this.authService.promptLogin(redirect);
      throw new Error('Authentication required');
    }
  }

  private updateState(state: CartState): void {
    this.cartSubject.next(state ?? this.emptyState());
  }

  private extractError(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Unable to process cart request.';
    }
    return 'Unable to process cart request.';
  }

  async refresh(): Promise<void> {
    if (!this.authService.getToken()) {
      this.updateState(this.emptyState());
      return;
    }

    try {
      const response = await firstValueFrom(this.http.get<CartResponse>(this.endpoint));
      if (response.success) {
        this.updateState(response.data);
      }
    } catch (error) {
      console.error('Cart refresh failed', error);
    }
  }

  async addItem(payload: AddCartItemPayload, redirect = '/cart'): Promise<CartState> {
    this.requireAuth(redirect);
    try {
      const response = await firstValueFrom(this.http.post<CartResponse>(this.endpoint, payload));
      if (!response.success) {
        throw new Error('Unable to add item to cart.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }

  async updateQuantity(productId: string, quantity: number): Promise<CartState> {
    this.requireAuth('/cart');
    try {
      const response = await firstValueFrom(
        this.http.patch<CartResponse>(`${this.endpoint}/${productId}`, { quantity })
      );
      if (!response.success) {
        throw new Error('Unable to update cart item.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }

  async removeItem(productId: string): Promise<CartState> {
    this.requireAuth('/cart');
    try {
      const response = await firstValueFrom(
        this.http.delete<CartResponse>(`${this.endpoint}/${productId}`)
      );
      if (!response.success) {
        throw new Error('Unable to remove cart item.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }

  async clear(): Promise<CartState> {
    this.requireAuth('/cart');
    try {
      const response = await firstValueFrom(this.http.delete<CartResponse>(this.endpoint));
      if (!response.success) {
        throw new Error('Unable to clear cart.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }

  async moveToWishlist(productId: string): Promise<CartState> {
    this.requireAuth('/cart');
    try {
      const response = await firstValueFrom(
        this.http.post<CartResponse>(`${this.endpoint}/${productId}/move-to-wishlist`, {})
      );
      if (!response.success) {
        throw new Error('Unable to move item to wishlist.');
      }
      this.updateState(response.data);
      return response.data;
    } catch (error) {
      throw new Error(this.extractError(error));
    }
  }
}
