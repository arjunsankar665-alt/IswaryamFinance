import { Component } from '@angular/core';

interface TrendingProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  category: string;
  discount?: number;
}

@Component({
  selector: 'app-trending-products',
  templateUrl: './trending-products.component.html',
  styleUrls: ['./trending-products.component.css']
})
export class TrendingProductsComponent {
  trendingProducts: TrendingProduct[] = [
    { id: '1', name: 'Temple Gold Necklace', image: 'assets/images/products/trending-1.jpg', price: 185000, originalPrice: 200000, rating: 4.8, category: 'Necklaces', discount: 7 },
    { id: '2', name: 'Diamond Jhumkas', image: 'assets/images/products/trending-2.jpg', price: 65000, rating: 4.9, category: 'Earrings' },
    { id: '3', name: 'Bridal Bangles Set', image: 'assets/images/products/trending-3.jpg', price: 125000, originalPrice: 140000, rating: 4.7, category: 'Bangles', discount: 10 },
    { id: '4', name: 'Platinum Ring', image: 'assets/images/products/trending-4.jpg', price: 45000, rating: 4.6, category: 'Rings' }
  ];
}
