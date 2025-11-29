import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistItem, WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  readonly wishlist$ = this.wishlistService.wishlist$;
  readonly items$ = this.wishlistService.items$;
  readonly isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;
  isBusy = false;

  constructor(
    private readonly wishlistService: WishlistService,
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {}

  trackByProductId(_: number, item: WishlistItem): string {
    return item.productId;
  }

  async onRemove(productId: string): Promise<void> {
    try {
      this.isBusy = true;
      await this.wishlistService.remove(productId);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }
  }

  async onMoveToCart(item: WishlistItem): Promise<void> {
    if (!item.price && item.price !== 0) {
      console.warn('Cannot move item without price to cart.');
      return;
    }
    try {
      this.isBusy = true;
      await this.cartService.addItem({
        productId: item.productId,
        name: item.name,
        price: item.price,
        slug: item.slug,
        image: item.image,
        category: item.category,
        inStock: item.inStock,
        attributes: item.attributes
      });
      await this.wishlistService.remove(item.productId);
    } catch (error) {
      console.error(error);
    } finally {
      this.isBusy = false;
    }
  }

  promptLogin(): void {
    this.authService.promptLogin('/wishlist');
  }

}
