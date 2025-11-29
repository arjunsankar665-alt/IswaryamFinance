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
  readonly trendingProducts: TrendingProduct[] = this.buildTrendingCollection();

  private buildTrendingCollection(): TrendingProduct[] {
    const heroNames = [
      'Sunrise Polki Choker',
      'Rajam Bridal Cascade',
      'Lotus Filigree Mala',
      'Emerald Rajputi Set',
      'Classic Temple Rows',
      'Contemporary Cuff Set',
      'Zuri Heritage Collar',
      'Ivory Heirloom Layers'
    ];

    return heroNames.map((name, index) => {
      const price = 185000 + index * 18000;
      const originalPrice = Math.round(price * 1.08);
      return {
        id: `special-${index + 1}`,
        name,
        image: `assets/Special/item${index + 1}.webp`,
        price,
        originalPrice,
        rating: 4.5 + (index % 3) * 0.1,
        category: 'Special Editions',
        discount: Math.max(5, Math.round((1 - price / originalPrice) * 100))
      } as TrendingProduct;
    });
  }
}
