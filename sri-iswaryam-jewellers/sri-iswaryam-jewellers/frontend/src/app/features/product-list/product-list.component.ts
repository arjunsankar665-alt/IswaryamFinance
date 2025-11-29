import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from './components/product-grid/product-grid.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  categoryName = '';
  totalProducts = 0;
  showMobileFilters = false;
  
  products: Product[] = [];
  currentPage = 1;
  totalPages = 5;
  itemsPerPage = 12;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['category']) {
        this.categoryName = this.formatCategoryName(params['category']);
      }
    });
    this.loadProducts();
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatCategoryName(slug: string): string {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  loadProducts(): void {
    // Mock data - replace with API call
    this.products = [
      {
        id: '1', name: 'Traditional Gold Necklace', image: 'assets/images/products/necklace-1.jpg',
        category: 'Necklaces', price: 125000, originalPrice: 140000, discount: 10,
        weight: 25, purity: '22K', rating: 4.5, reviews: 128, inStock: true, isNew: true
      },
      {
        id: '2', name: 'Diamond Studded Earrings', image: 'assets/images/products/earring-1.jpg',
        category: 'Earrings', price: 45000, weight: 8, purity: '18K', 
        rating: 4.8, reviews: 95, inStock: true
      },
      {
        id: '3', name: 'Gold Bangles Set (6 pcs)', image: 'assets/images/products/bangle-1.jpg',
        category: 'Bangles', price: 185000, originalPrice: 200000, discount: 7,
        weight: 45, purity: '22K', rating: 4.3, reviews: 64, inStock: true
      },
      {
        id: '4', name: 'Platinum Wedding Ring', image: 'assets/images/products/ring-1.jpg',
        category: 'Rings', price: 75000, weight: 6, purity: 'PT950',
        rating: 4.9, reviews: 210, inStock: false
      },
      {
        id: '5', name: 'Temple Jewellery Set', image: 'assets/images/products/set-1.jpg',
        category: 'Sets', price: 350000, originalPrice: 380000, discount: 8,
        weight: 85, purity: '22K', rating: 4.7, reviews: 42, inStock: true, isNew: true
      },
      {
        id: '6', name: 'Rose Gold Pendant', image: 'assets/images/products/pendant-1.jpg',
        category: 'Pendants', price: 28000, weight: 4, purity: '18K Rose',
        rating: 4.4, reviews: 78, inStock: true
      }
    ];
    this.totalProducts = this.products.length;
  }

  onSortChange(sortBy: string): void {
    console.log('Sort by:', sortBy);
    // Implement sorting logic
  }

  onFilterChange(filter: any): void {
    console.log('Filter changed:', filter);
    // Implement filter logic
  }

  onWishlistToggle(product: Product): void {
    console.log('Wishlist toggle:', product.name);
    // Implement wishlist toggle
  }

  onAddToCart(product: Product): void {
    console.log('Add to cart:', product.name);
    // Implement add to cart
  }

  openQuickView(product: Product): void {
    console.log('Quick view:', product.name);
    // Implement quick view modal
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }
}
