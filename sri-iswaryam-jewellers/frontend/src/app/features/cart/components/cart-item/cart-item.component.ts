import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Input() disabled = false;
  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() moveToWishlist = new EventEmitter<string>();

  increment(): void {
    if (this.disabled) {
      return;
    }
    if (this.item.quantity < 99) {
      this.item.quantity++;
      this.quantityChange.emit({ id: this.item.productId, quantity: this.item.quantity });
    }
  }

  decrement(): void {
    if (this.disabled) {
      return;
    }
    if (this.item.quantity > 1) {
      this.item.quantity--;
      this.quantityChange.emit({ id: this.item.productId, quantity: this.item.quantity });
    }
  }

  onRemove(): void {
    if (this.disabled) {
      return;
    }
    this.remove.emit(this.item.productId);
  }

  onMoveToWishlist(): void {
    if (this.disabled) {
      return;
    }
    this.moveToWishlist.emit(this.item.productId);
  }
}
