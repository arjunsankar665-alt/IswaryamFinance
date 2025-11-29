
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService, CartItem } from './cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  subtotal = 0;
  discounts = 0;
  shipping = 0;
  taxes = 0;

  private sub: Subscription | null = null;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.cartService.items$.subscribe(items => {
      this.items = items;
      this.recalculate();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  recalculate(): void {
    this.subtotal = this.items.reduce((s, it) => s + it.price * it.quantity, 0);
    // Simple rules for demo
    this.discounts = this.subtotal > 200000 ? Math.round(this.subtotal * 0.02) : 0;
    this.shipping = this.subtotal > 50000 ? 0 : 199;
    this.taxes = Math.round((this.subtotal - this.discounts) * 0.03);
  }

  onQuantityChange(event: { id: string; quantity: number }): void {
    this.cartService.updateQuantity(event.id, event.quantity);
  }

  onRemove(id: string): void {
    this.cartService.removeItem(id);
  }

  onMoveToWishlist(id: string): void {
    const item = this.cartService.moveToWishlist(id);
    console.log('Moved to wishlist:', item);
    // TODO: integrate with wishlist service
  }

  onCheckout(): void {
    // navigate to checkout
    this.router.navigate(['/checkout']);
  }
}
