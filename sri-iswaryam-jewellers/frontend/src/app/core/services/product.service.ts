import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProductImage, StorefrontProduct } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;
  private readonly placeholderImage = 'assets/carousel/FirstImage.jpg';

  constructor(private readonly http: HttpClient) {}

  getProducts(params?: Record<string, string | number | boolean | undefined>): Observable<StorefrontProduct[]> {
    const httpParams = this.buildParams(params);
    return this.http
      .get<ApiResponse<ApiProduct[]>>(this.baseUrl, { params: httpParams })
      .pipe(map(response => (response.data ?? []).map(product => this.mapProduct(product))));
  }

  getProductBySlug(slug: string): Observable<StorefrontProduct> {
    return this.http
      .get<ApiResponse<ApiProduct>>(`${this.baseUrl}/${slug}`)
      .pipe(map(response => this.mapProduct(response.data)));
  }

  private buildParams(params?: Record<string, string | number | boolean | undefined>): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  private mapProduct(product?: ApiProduct): StorefrontProduct {
    if (!product) {
      return this.createEmptyProduct();
    }

    const gallery = product.images ?? [];
    const primaryImage = gallery[0]?.full || gallery[0]?.thumb || this.placeholderImage;
    const price = Number(product.price ?? 0);
    const originalPrice = this.resolveOriginalPrice(price, product);
    const discount = this.resolveDiscount(price, originalPrice, product);
    const normalizedWeight = this.normalizeWeight(product.weight);
    const purity = product.purity ?? '22K';
    const categorySlug = this.slugify(product.category ?? 'misc');

    return {
      id: String(product.id ?? product._id ?? this.generateId()),
      slug: product.slug ?? this.slugify(product.name ?? 'product'),
      name: product.name ?? 'Untitled Product',
      image: primaryImage,
      gallery,
      category: this.formatCategory(product.category ?? 'misc'),
      categorySlug,
      metal: product.metal ?? 'Gold',
      price,
      originalPrice,
      discount,
      weight: normalizedWeight,
      purity,
      rating: product.rating ?? 0,
      reviews: product.reviewCount ?? 0,
      inStock: product.inStock ?? true,
      isNew: product.isNew
    };
  }

  private resolveOriginalPrice(price: number, product: ApiProduct): number | undefined {
    if (product.originalPrice) {
      return product.originalPrice;
    }

    if (typeof product.discount === 'number' && product.discount > 0) {
      return Math.round(price / (1 - product.discount / 100));
    }

    return undefined;
  }

  private resolveDiscount(price: number, originalPrice: number | undefined, product: ApiProduct): number | undefined {
    if (typeof product.discount === 'number') {
      return product.discount;
    }

    if (originalPrice && originalPrice > price) {
      return Math.round((1 - price / originalPrice) * 100);
    }

    return undefined;
  }

  private normalizeWeight(weight?: string | number): number {
    if (typeof weight === 'number') {
      return weight;
    }

    const parsed = parseFloat(weight ?? '0');
    return Number.isFinite(parsed) ? Math.round(parsed * 10) / 10 : 0;
  }

  private formatCategory(category: string): string {
    return category
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private createEmptyProduct(): StorefrontProduct {
    return {
      id: this.generateId(),
      slug: 'placeholder-product',
      name: 'Placeholder Product',
      image: this.placeholderImage,
      category: 'Placeholder',
      categorySlug: 'placeholder',
      price: 0,
      weight: 0,
      purity: '22K',
      inStock: true
    };
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 10);
  }
}

interface ApiProduct {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  images?: ProductImage[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  weight?: string | number;
  purity?: string;
  metal?: string;
  isNew?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}
