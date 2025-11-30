import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';
import { StorefrontProduct } from '../../shared/models/product.model';
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
export class ProductListComponent implements OnInit, OnDestroy {
  categoryName = '';
  totalProducts = 0;
  showMobileFilters = false;
  isLoading = false;
  loadError: string | null = null;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 12;
  
  products: StorefrontProduct[] = [];
  private allProducts: StorefrontProduct[] = [];
  private appliedFilters: FilterState = this.getInitialFilters();
  private readonly subscriptions = new Subscription();
  private routeCategory: string | null = null;
  private isAuthenticated = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.routeCategory = params['category'] ?? null;
        this.categoryName = this.routeCategory ? this.formatCategoryName(this.routeCategory) : 'All Products';
        if (this.allProducts.length) {
          this.applyFilters();
        }
      })
    );

    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      })
    );

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    this.isLoading = true;
    this.loadError = null;

    const loadSub = this.productService.getProducts().subscribe({
      next: products => {
        this.allProducts = products;
        this.appliedFilters = this.getInitialFilters();
        this.applyFilters();
        this.isLoading = false;
      },
      error: error => {
        this.loadError = this.formatErrorMessage(error);
        this.allProducts = [];
        this.applyFilters();
        this.isLoading = false;
      }
    });

    this.subscriptions.add(loadSub);
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

  async onWishlistToggle(product: StorefrontProduct): Promise<void> {
    if (!this.ensureAuthenticated()) {
      return;
    }
    try {
      const nextState = !product.isWishlisted;
      product.isWishlisted = nextState;
      if (nextState) {
        await this.wishlistService.addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          category: product.category,
          inStock: product.inStock
        });
        this.notificationService.success('Added to wishlist', `${product.name} is saved for later.`);
      } else {
        await this.wishlistService.remove(product.id);
        this.notificationService.info('Removed from wishlist', `${product.name} is no longer in your shortlist.`);
      }
    } catch (error) {
      product.isWishlisted = !product.isWishlisted;
      this.notificationService.error('Wishlist update failed', this.formatErrorMessage(error));
    }
  }

  async onAddToCart(product: StorefrontProduct): Promise<void> {
    if (!this.ensureAuthenticated()) {
      return;
    }
    try {
      await this.cartService.addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        quantity: 1,
        inStock: product.inStock,
        category: product.category
      });
      this.notificationService.success('Added to bag', `${product.name} is ready in your cart.`);
    } catch (error) {
      this.notificationService.error('Unable to add item', this.formatErrorMessage(error));
    }
  }

  openQuickView(product: StorefrontProduct): void {
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

  private matchesFilters(product: StorefrontProduct): boolean {
    const categorySlug = product.categorySlug ?? this.slugify(product.category);

    if (this.routeCategory && categorySlug !== this.routeCategory) {
      return false;
    }

    if (this.appliedFilters.category.length) {
      if (!this.appliedFilters.category.includes(categorySlug)) {
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
    if (!Number.isFinite(weight)) {
      return false;
    }

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

  private ensureAuthenticated(): boolean {
    if (this.isAuthenticated) {
      return true;
    }

    this.notificationService.warning('Sign in required', 'Please sign in to continue.');
    this.authService.promptLogin(this.router.url);
    return false;
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
