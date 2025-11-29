import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface CompareProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: string;
  metal: string;
  purity: string;
  weight: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: { [key: string]: string };
}

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  products: CompareProduct[] = [];
  maxProducts = 4;

  // All comparison attributes
  comparisonAttributes = [
    { key: 'metal', label: 'Metal Type' },
    { key: 'purity', label: 'Purity' },
    { key: 'weight', label: 'Gross Weight' },
    { key: 'stone', label: 'Stone Type' },
    { key: 'stoneWeight', label: 'Stone Weight' },
    { key: 'certification', label: 'Certification' },
    { key: 'occasion', label: 'Occasion' },
    { key: 'style', label: 'Style' },
    { key: 'warranty', label: 'Warranty' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCompareProducts();
  }

  private loadCompareProducts(): void {
    // Sample products - would come from service in real app
    this.products = [
      {
        id: '1',
        name: 'Classic Gold Necklace',
        image: 'assets/images/products/necklace1.jpg',
        price: 125000,
        originalPrice: 135000,
        category: 'Necklaces',
        metal: 'Gold',
        purity: '22K (916)',
        weight: '25.5g',
        rating: 4.5,
        reviews: 128,
        inStock: true,
        features: {
          stone: 'None',
          stoneWeight: '-',
          certification: 'BIS Hallmark',
          occasion: 'Wedding, Festival',
          style: 'Traditional',
          warranty: '1 Year'
        }
      },
      {
        id: '2',
        name: 'Diamond Pendant Set',
        image: 'assets/images/products/pendant1.jpg',
        price: 89000,
        category: 'Pendants',
        metal: 'White Gold',
        purity: '18K (750)',
        weight: '12.3g',
        rating: 4.8,
        reviews: 86,
        inStock: true,
        features: {
          stone: 'Diamond',
          stoneWeight: '1.2 Carat',
          certification: 'IGI Certified',
          occasion: 'Party, Casual',
          style: 'Contemporary',
          warranty: '2 Years'
        }
      }
    ];
  }

  removeProduct(productId: string): void {
    this.products = this.products.filter(p => p.id !== productId);
    // Update localStorage or service
  }

  clearAll(): void {
    this.products = [];
    // Clear from localStorage or service
  }

  addToCart(product: CompareProduct): void {
    console.log('Adding to cart:', product.id);
    // Implement cart service integration
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  getFeatureValue(product: CompareProduct, key: string): string {
    if (key === 'metal') return product.metal;
    if (key === 'purity') return product.purity;
    if (key === 'weight') return product.weight;
    return product.features[key] || '-';
  }
}
