import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type ProductStatus = 'draft' | 'active' | 'inactive' | 'archived';
export type OrderStatus = 'pending' | 'processing' | 'hallmarking' | 'packed' | 'shipped' | 'delivered';

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  categoryName: string;
  price: number;
  mrp: number;
  stock: number;
  status: ProductStatus;
  purity: string;
  weight: number;
  heroImage: string;
  gallery: string[];
  tags: string[];
  featured: boolean;
  updatedAt: string;
  description: string;
}

export type AdminProductInput = Omit<AdminProduct, 'id' | 'updatedAt' | 'categoryName'> & {
  categoryName?: string;
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Guest';
  orders: number;
  lifetimeValue: number;
  joinedOn: string;
  lastActive: string;
  location: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  heroImage?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  channel: 'Web' | 'In-store' | 'App';
  status: OrderStatus;
  total: number;
  placedAt: string;
  expectedDispatch: string | null;
  shippingProvider: string;
  trackingId: string;
  items: OrderItem[];
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  isActive: boolean;
  sortOrder: number;
  updatedAt?: string;
}

export interface UploadedAsset {
  path: string;
  url: string;
  filename: string;
  category: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  private readonly productsSubject = new BehaviorSubject<AdminProduct[]>([]);
  private readonly ordersSubject = new BehaviorSubject<AdminOrder[]>([]);
  private readonly usersSubject = new BehaviorSubject<AdminUser[]>([]);
  private readonly categoriesSubject = new BehaviorSubject<AdminCategory[]>([]);

  readonly products$ = this.productsSubject.asObservable();
  readonly orders$ = this.ordersSubject.asObservable();
  readonly users$ = this.usersSubject.asObservable();
  readonly categories$ = this.categoriesSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    void this.refreshAll();
  }

  async refreshAll(): Promise<void> {
    await Promise.all([
      this.refreshProducts(),
      this.refreshOrders(),
      this.refreshUsers(),
      this.refreshCategories()
    ]);
  }

  async refreshProducts(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<unknown[]>>(`${this.baseUrl}/products`)
      );
      const products = (response.data || []).map(doc => this.normalizeProduct(doc));
      this.productsSubject.next(products);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  }

  async refreshOrders(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<unknown[]>>(`${this.baseUrl}/orders`)
      );
      const orders = (response.data || []).map(doc => this.normalizeOrder(doc));
      this.ordersSubject.next(orders);
    } catch (error) {
      console.error('Failed to load orders', error);
    }
  }

  async refreshUsers(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<unknown[]>>(`${this.baseUrl}/users`)
      );
      const users = (response.data || []).map(doc => this.normalizeUser(doc));
      this.usersSubject.next(users);
    } catch (error) {
      console.error('Failed to load users', error);
    }
  }

  async refreshCategories(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<unknown[]>>(`${this.baseUrl}/categories`)
      );
      const categories = (response.data || []).map(doc => this.normalizeCategory(doc));
      this.categoriesSubject.next(categories);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  }

  async addProduct(payload: AdminProductInput): Promise<AdminProduct> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/products`, payload)
    );
    const product = this.normalizeProduct(response.data);
    this.upsertProduct(product);
    return product;
  }

  async updateProduct(id: string, changes: Partial<AdminProduct>): Promise<AdminProduct> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<unknown>>(`${this.baseUrl}/products/${id}`, changes)
    );
    const product = this.normalizeProduct(response.data);
    this.upsertProduct(product);
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/products/${id}`));
    this.productsSubject.next(this.productsSubject.value.filter(product => product.id !== id));
  }

  async fetchProduct(id: string): Promise<AdminProduct | null> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<unknown>>(`${this.baseUrl}/products/${id}`)
    );
    if (!response.success || !response.data) {
      return null;
    }
    const product = this.normalizeProduct(response.data);
    this.upsertProduct(product);
    return product;
  }

  getProductFromCache(id: string): AdminProduct | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    await firstValueFrom(
      this.http.patch<ApiResponse<unknown>>(`${this.baseUrl}/orders/${id}/status`, { status })
    );
    await this.refreshOrders();
  }

  async addCategory(payload: Partial<AdminCategory>): Promise<AdminCategory> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/categories`, payload)
    );
    const category = this.normalizeCategory(response.data);
    this.categoriesSubject.next([category, ...this.categoriesSubject.value]);
    return category;
  }

  async updateCategory(id: string, payload: Partial<AdminCategory>): Promise<AdminCategory> {
    const response = await firstValueFrom(
      this.http.put<ApiResponse<unknown>>(`${this.baseUrl}/categories/${id}`, payload)
    );
    const category = this.normalizeCategory(response.data);
    const list = this.categoriesSubject.value.slice();
    const index = list.findIndex(entry => entry.id === id);
    if (index === -1) {
      list.unshift(category);
    } else {
      list[index] = category;
    }
    this.categoriesSubject.next(list);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/categories/${id}`));
    this.categoriesSubject.next(this.categoriesSubject.value.filter(category => category.id !== id));
  }

  async uploadImage(file: File, category: string): Promise<UploadedAsset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category || 'general');
    const response = await firstValueFrom(
      this.http.post<ApiResponse<UploadedAsset>>(`${this.baseUrl}/uploads/images`, formData)
    );
    if (!response.success || !response.data) {
      throw new Error('Upload failed');
    }
    return response.data;
  }

  private upsertProduct(product: AdminProduct): void {
    const existing = this.productsSubject.value;
    const index = existing.findIndex(entry => entry.id === product.id);
    if (index === -1) {
      this.productsSubject.next([product, ...existing]);
    } else {
      const clone = [...existing];
      clone[index] = product;
      this.productsSubject.next(clone);
    }
  }

  private normalizeProduct(doc: any): AdminProduct {
    return {
      id: doc._id ?? doc.id,
      name: doc.name,
      sku: doc.sku,
      category: doc.category,
      categoryName: doc.categoryName ?? doc.category,
      price: doc.price,
      mrp: doc.mrp,
      stock: doc.stock ?? 0,
      status: doc.status ?? 'draft',
      purity: doc.purity ?? '22K',
      weight: doc.weight ?? 0,
      heroImage: doc.heroImage ?? '',
      gallery: Array.isArray(doc.gallery) ? doc.gallery : [],
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      featured: Boolean(doc.featured),
      description: doc.description ?? '',
      updatedAt: doc.updatedAt ?? new Date().toISOString()
    };
  }

  private normalizeOrder(doc: any): AdminOrder {
    return {
      id: doc.orderNumber ?? doc._id ?? 'ORDER',
      customerName: doc.customerName ?? 'Client',
      customerEmail: doc.customerEmail ?? '—',
      channel: doc.channel ?? 'Web',
      status: doc.status ?? 'pending',
      total: doc.total ?? 0,
      placedAt: doc.createdAt ?? new Date().toISOString(),
      expectedDispatch: doc.expectedDispatch ?? null,
      shippingProvider: doc.shippingProvider ?? '—',
      trackingId: doc.trackingId ?? '—',
      items: Array.isArray(doc.items)
        ? doc.items.map((item: any) => ({
            productId: item.productId?.toString?.() ?? item.productId ?? '',
            name: item.name ?? 'SKU',
            quantity: item.quantity ?? 0,
            price: item.price ?? 0,
            category: item.category ?? '',
            heroImage: item.heroImage ?? ''
          }))
        : []
    };
  }

  private normalizeUser(doc: any): AdminUser {
    return {
      id: doc.id ?? doc._id,
      name: doc.name,
      email: doc.email,
      tier: doc.tier ?? 'Guest',
      orders: doc.orders ?? doc.ordersCount ?? 0,
      lifetimeValue: doc.lifetimeValue ?? 0,
      joinedOn: doc.joinedOn ?? doc.createdAt ?? new Date().toISOString(),
      lastActive: doc.lastActive ?? doc.updatedAt ?? new Date().toISOString(),
      location: doc.location ?? '—'
    };
  }

  private normalizeCategory(doc: any): AdminCategory {
    return {
      id: doc._id ?? doc.id,
      name: doc.name ?? 'Category',
      slug: doc.slug ?? 'category',
      description: doc.description ?? '',
      heroImage: doc.heroImage ?? '',
      isActive: doc.isActive ?? true,
      sortOrder: doc.sortOrder ?? 0,
      updatedAt: doc.updatedAt ?? new Date().toISOString()
    };
  }
}
