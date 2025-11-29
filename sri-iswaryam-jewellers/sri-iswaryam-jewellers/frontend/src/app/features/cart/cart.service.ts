import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  inStock: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {
    // seed with some mock items for development
    const seed: CartItem[] = [
      { id: '1', name: 'Traditional Gold Necklace', image: 'assets/images/products/necklace-1.jpg', price: 125000, quantity: 1, inStock: true },
      { id: '4', name: 'Platinum Wedding Ring', image: 'assets/images/products/ring-1.jpg', price: 75000, quantity: 2, inStock: false }
    ];
    this.itemsSubject.next(seed);
  }

  getItems(): CartItem[] {
    return this.itemsSubject.value;
  }

  setItems(items: CartItem[]): void {
    this.itemsSubject.next(items);
  }

  updateQuantity(id: string, quantity: number): void {
    const items = this.getItems().map(i => i.id === id ? { ...i, quantity } : i);
    this.itemsSubject.next(items);
  }

  removeItem(id: string): void {
    const items = this.getItems().filter(i => i.id !== id);
    this.itemsSubject.next(items);
  }

  moveToWishlist(id: string): CartItem | null {
    const item = this.getItems().find(i => i.id === id) || null;
    if (item) {
      this.removeItem(id);
    }
    return item;
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}
