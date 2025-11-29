import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from './components/product-grid/product-grid.component';
import { FilterChangeEvent } from './components/filter-panel/filter-panel.component';

interface FilterState {
  category: string[];
  metal: string[];
  weight: string | null;
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
}

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
  private allProducts: Product[] = [];
  private appliedFilters: FilterState = this.getInitialFilters();
  currentPage = 1;
  totalPages = 5;
  itemsPerPage = 12;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) {}

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
    this.allProducts = [
      {
        id: '1', name: 'Traditional Gold Necklace', image: 'assets/images/products/necklace-1.jpg',
        category: 'Necklaces', price: 125000, originalPrice: 140000, discount: 10,
        weight: 25, purity: '22K', rating: 4.5, reviews: 128, inStock: true, isNew: true,
        metal: 'Gold'
      },
      {
        id: '2', name: 'Diamond Studded Earrings', image: 'assets/images/products/earring-1.jpg',
        category: 'Earrings', price: 45000, weight: 8, purity: '18K', 
        rating: 4.8, reviews: 95, inStock: true, metal: 'Gold'
      },
      {
        id: '3', name: 'Gold Bangles Set (6 pcs)', image: 'assets/images/products/bangle-1.jpg',
        category: 'Bangles', price: 185000, originalPrice: 200000, discount: 7,
        weight: 45, purity: '22K', rating: 4.3, reviews: 64, inStock: true, metal: 'Gold'
      },
      {
        id: '4', name: 'Platinum Wedding Ring', image: 'assets/images/products/ring-1.jpg',
        category: 'Rings', price: 75000, weight: 6, purity: 'PT950',
        rating: 4.9, reviews: 210, inStock: false, metal: 'Platinum'
      },
      {
        id: '5', name: 'Temple Jewellery Set', image: 'assets/images/products/set-1.jpg',
        category: 'Sets', price: 350000, originalPrice: 380000, discount: 8,
        weight: 85, purity: '22K', rating: 4.7, reviews: 42, inStock: true, isNew: true, metal: 'Gold'
      },
      {
        id: '6', name: 'Rose Gold Pendant', image: 'assets/images/products/pendant-1.jpg',
        category: 'Pendants', price: 28000, weight: 4, purity: '18K Rose',
        rating: 4.4, reviews: 78, inStock: true, metal: 'Rose Gold'
      }
    ];
    this.appliedFilters = this.getInitialFilters();
    this.applyFilters();
  }

  onSortChange(sortBy: string): void {
    console.log('Sort by:', sortBy);
    // Implement sorting logic
  }

  onFilterChange(filter: FilterChangeEvent): void {
    switch (filter.type) {
      case 'category':
        this.appliedFilters.category = filter.values ?? [];
        break;
      case 'metal':
        this.appliedFilters.metal = filter.values ?? [];
        break;
      case 'weight':
        this.appliedFilters.weight = filter.values?.[0] ?? null;
        break;
      case 'price':
        this.appliedFilters.priceMin = filter.min ?? null;
        this.appliedFilters.priceMax = filter.max ?? null;
        break;
      case 'inStock':
        this.appliedFilters.inStockOnly = Boolean(filter.value);
        break;
      case 'clear':
        this.appliedFilters = this.getInitialFilters();
        break;
    }

    this.applyFilters();
  }

  async onWishlistToggle(product: Product): Promise<void> {
    try {
      if (product.isWishlisted) {
        await this.wishlistService.addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: this.slugify(product.name),
          category: product.category,
          inStock: product.inStock
        });
      } else {
        await this.wishlistService.remove(product.id);
      }
    } catch (error) {
      product.isWishlisted = !product.isWishlisted;
      console.error('Wishlist error', error);
    }
  }

  async onAddToCart(product: Product): Promise<void> {
    try {
      await this.cartService.addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: this.slugify(product.name),
        inStock: product.inStock,
        category: product.category
      });
    } catch (error) {
      console.error('Cart error', error);
    }
  }

  openQuickView(product: Product): void {
    console.log('Quick view:', product.name);
    // Implement quick view modal
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private slugify(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  private applyFilters(): void {
    this.currentPage = 1;
    this.products = this.allProducts.filter(product => this.matchesFilters(product));
    this.totalProducts = this.products.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalProducts / this.itemsPerPage));
  }

  private matchesFilters(product: Product): boolean {
    if (this.appliedFilters.category.length) {
      const slug = this.slugify(product.category);
      if (!this.appliedFilters.category.includes(slug)) {
        return false;
      }
    }

    if (this.appliedFilters.metal.length) {
      if (!product.metal || !this.appliedFilters.metal.includes(product.metal)) {
        return false;
      }
    }

    if (this.appliedFilters.weight) {
      if (!this.matchesWeightRange(product.weight, this.appliedFilters.weight)) {
        return false;
      }
    }

    if (this.appliedFilters.priceMin !== null && product.price < this.appliedFilters.priceMin) {
      return false;
    }

    if (this.appliedFilters.priceMax !== null && product.price > this.appliedFilters.priceMax) {
      return false;
    }

    if (this.appliedFilters.inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  }

  private matchesWeightRange(weight: number, range: string): boolean {
    if (range.includes('+')) {
      const min = parseFloat(range);
      return weight >= min;
    }

    const [min, max] = range.split('-').map(value => parseFloat(value));
    return weight >= min && weight <= max;
  }

  private getInitialFilters(): FilterState {
    return {
      category: [],
      metal: [],
      weight: null,
      priceMin: null,
      priceMax: null,
      inStockOnly: false
    };
  }
}
