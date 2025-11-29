import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  metal?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  weight: number;
  purity: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isWishlisted?: boolean;
}

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Output() wishlistToggle = new EventEmitter<Product>();
  @Output() cartAdd = new EventEmitter<Product>();
  @Output() quickViewOpen = new EventEmitter<Product>();

  addToWishlist(product: Product): void {
    this.wishlistToggle.emit(product);
  }

  addToCart(product: Product): void {
    this.cartAdd.emit(product);
  }

  quickView(product: Product): void {
    this.quickViewOpen.emit(product);
  }
}
