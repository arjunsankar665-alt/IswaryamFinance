import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StorefrontProduct } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent {
  @Input() products: StorefrontProduct[] = [];
  @Output() wishlistToggle = new EventEmitter<StorefrontProduct>();
  @Output() cartAdd = new EventEmitter<StorefrontProduct>();
  @Output() quickViewOpen = new EventEmitter<StorefrontProduct>();

  addToWishlist(product: StorefrontProduct): void {
    this.wishlistToggle.emit(product);
  }

  addToCart(product: StorefrontProduct): void {
    this.cartAdd.emit(product);
  }

  quickView(product: StorefrontProduct): void {
    this.quickViewOpen.emit(product);
  }
}
