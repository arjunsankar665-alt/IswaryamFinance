import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  inStock: boolean;
}

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<{ id: string; quantity: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() moveToWishlist = new EventEmitter<string>();

  increment(): void {
    if (this.item.quantity < 99) {
      this.item.quantity++;
      this.quantityChange.emit({ id: this.item.id, quantity: this.item.quantity });
    }
  }

  decrement(): void {
    if (this.item.quantity > 1) {
      this.item.quantity--;
      this.quantityChange.emit({ id: this.item.id, quantity: this.item.quantity });
    }
  }

  onRemove(): void {
    this.remove.emit(this.item.id);
  }

  onMoveToWishlist(): void {
    this.moveToWishlist.emit(this.item.id);
  }
}
