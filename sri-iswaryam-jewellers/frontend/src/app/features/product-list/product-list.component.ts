import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from './components/product-grid/product-grid.component';
import { FilterChangeEvent } from './components/filter-panel/filter-panel.component';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';

interface FilterState {
  category: string[];
  metal: string[];
  weight: string | null;
  priceMin: number | null;
  priceMax: number | null;
  inStockOnly: boolean;
}

interface CatalogConfig {
  name: string;
  slug: string;
  assets: string[];
  metal: string | string[];
  purity: string | string[];
  weightRange: [number, number];
  priceRange: [number, number];
}

const buildAssetPaths = (folder: string, prefix: string, start: number, end: number): string[] => {
  const assets: string[] = [];
  for (let i = start; i <= end; i++) {
    assets.push(`assets/${folder}/${prefix}${i}.webp`);
  }
  return assets;
};

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  categoryName = '';
  totalProducts = 0;
  showMobileFilters = false;
  
  products: Product[] = [];
  private allProducts: Product[] = [];
  private appliedFilters: FilterState = this.getInitialFilters();
  private readonly subscriptions = new Subscription();
  private routeCategory: string | null = null;
  private isAuthenticated = false;
  currentPage = 1;
  totalPages = 5;
  itemsPerPage = 12;
  private readonly catalogConfigs: CatalogConfig[] = [
    {
      name: 'Necklaces',
      slug: 'necklaces',
      assets: buildAssetPaths('Necklace', 'necklace', 1, 10),
      metal: 'Gold',
      purity: '22K',
      weightRange: [18, 48],
      priceRange: [98000, 325000]
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      assets: buildAssetPaths('Earrings', 'earrings', 1, 11),
      metal: 'Gold',
      purity: ['18K', '22K'],
      weightRange: [6, 22],
      priceRange: [38000, 145000]
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      assets: buildAssetPaths('Bangles', 'bangles', 1, 10),
      metal: 'Gold',
      purity: '22K',
      weightRange: [22, 64],
      priceRange: [125000, 385000]
    },
    {
      name: 'Rings',
      slug: 'rings',
      assets: buildAssetPaths('Rings', 'ring', 1, 15),
      metal: ['Gold', 'Rose Gold', 'Platinum'],
      purity: ['18K', '22K', 'PT950'],
      weightRange: [3, 18],
      priceRange: [28000, 120000]
    },
    {
      name: 'Special',
      slug: 'special',
      assets: buildAssetPaths('Special', 'item', 1, 8),
      metal: ['Gold', 'Polki'],
      purity: ['22K', '24K'],
      weightRange: [42, 110],
      priceRange: [215000, 520000]
    }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
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
    this.allProducts = this.catalogConfigs.flatMap((config) => this.createProductsFromConfig(config));
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

  async onAddToCart(product: Product): Promise<void> {
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

  openQuickView(product: Product): void {
    console.log('Quick view:', product.name);
    // Implement quick view modal
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  private createProductsFromConfig(config: CatalogConfig): Product[] {
    const total = config.assets.length;
    return config.assets.map((image, index) => {
      const progress = total > 1 ? index / (total - 1) : 0;
      const price = this.interpolateValue(config.priceRange, progress);
      const offerApplies = index % 2 === 0;
      const originalPrice = offerApplies ? Math.round(price * 1.12) : undefined;
      const discount = offerApplies && originalPrice ? Math.max(3, Math.round((1 - price / originalPrice) * 100)) : undefined;
      const weight = this.interpolateValue(config.weightRange, progress);
      const descriptor = this.getCollectionDescriptor(index);

      return {
        id: `${config.slug}-${index + 1}`,
        slug: this.slugify(`${config.slug}-${descriptor}-${index + 1}`),
        name: this.formatProductName(config.name, index),
        image,
        category: config.name,
        metal: this.resolveOption(config.metal, index),
        price: this.normalizeCurrency(price),
        originalPrice: originalPrice ? this.normalizeCurrency(originalPrice) : undefined,
        discount,
        weight: Math.round(weight * 10) / 10,
        purity: this.resolveOption(config.purity, index),
        rating: Number(Math.min(5, 4.2 + (index % 5) * 0.15).toFixed(1)),
        reviews: 48 + index * 13,
        inStock: index % 6 !== 0,
        isNew: index >= total - 3
      } as Product;
    });
  }

  private resolveOption(option: string | string[], index: number): string {
    return Array.isArray(option) ? option[index % option.length] : option;
  }

  private interpolateValue([min, max]: [number, number], progress: number): number {
    return min + (max - min) * progress;
  }

  private normalizeCurrency(value: number): number {
    return Math.round(value / 100) * 100;
  }

  private formatProductName(category: string, index: number): string {
    const descriptor = this.getCollectionDescriptor(index);
    return `${descriptor} ${category} ${index + 1}`;
  }

  private getCollectionDescriptor(index: number): string {
    const collections = ['Heritage', 'Signature', 'Heirloom', 'Serenity', 'Aurora'];
    return collections[index % collections.length];
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
    if (this.routeCategory && this.slugify(product.category) !== this.routeCategory) {
      return false;
    }

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
