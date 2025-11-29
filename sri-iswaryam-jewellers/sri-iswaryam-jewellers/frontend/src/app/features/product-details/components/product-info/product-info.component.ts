import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductDetails {
  id: string;
  name: string;
  category: { name: string; slug: string };
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  metal: string;
  purity: string;
  weight: number;
  description: string;
  sizes?: string[];
}

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css']
})
export class ProductInfoComponent {
  @Input() product: ProductDetails | null = null;
  @Output() sizeSelected = new EventEmitter<string>();

  selectedSize: string | null = null;

  selectSize(size: string): void {
    this.selectedSize = size;
    this.sizeSelected.emit(size);
  }
}
