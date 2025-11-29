import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartItem, CartService, CartState } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

interface PriceSummary {
  subtotal: number;
  discounts: number;
  shipping: number;
  taxes: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  readonly cart$ = this.cartService.cart$;
  readonly items$ = this.cartService.items$;
  readonly isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;
  isBusy = false;

  constructor(
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  summary(cart: CartState): PriceSummary {
    const subtotal = cart.totals.subtotal;
    const discounts = subtotal > 200000 ? Math.round(subtotal * 0.02) : 0;
    const shipping = subtotal === 0 || subtotal > 50000 ? 0 : 199;
    const taxes = Math.round((subtotal - discounts) * 0.03);
    return { subtotal, discounts, shipping, taxes };
  }

  async onQuantityChange(event: { id: string; quantity: number }): Promise<void> {
    try {
      this.isBusy = true;
      await this.cartService.updateQuantity(event.id, event.quantity);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }
  }

  async onRemove(productId: string): Promise<void> {
    try {
      this.isBusy = true;
      await this.cartService.removeItem(productId);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }
  }

  async onMoveToWishlist(productId: string): Promise<void> {
    try {
      this.isBusy = true;
      await this.cartService.moveToWishlist(productId);
      await this.wishlistService.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }
  }

  async onCheckout(): Promise<void> {
    await this.cartService.refresh();
    await this.router.navigate(['/checkout']);
  }

  promptLogin(): void {
    this.authService.promptLogin('/cart');
  }

  trackByProductId(_: number, item: CartItem): string {
    return item.productId;
  }
}
