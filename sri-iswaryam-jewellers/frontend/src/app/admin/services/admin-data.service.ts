import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ProductStatus = 'draft' | 'active' | 'archived';
export type OrderStatus = 'pending' | 'processing' | 'hallmarking' | 'packed' | 'shipped' | 'delivered';

export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
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

export interface AdminProductInput extends Omit<AdminProduct, 'id' | 'updatedAt'> {}

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
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  channel: 'Web' | 'In-store' | 'App';
  status: OrderStatus;
  total: number;
  placedAt: string;
  expectedDispatch: string;
  shippingProvider: string;
  trackingId: string;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly productStorageKey = 'si_admin_products';
  private readonly orderStorageKey = 'si_admin_orders';
  private readonly userStorageKey = 'si_admin_users';

  private readonly productsSubject = new BehaviorSubject<AdminProduct[]>(this.loadProducts());
  private readonly ordersSubject = new BehaviorSubject<AdminOrder[]>(this.loadOrders());
  private readonly usersSubject = new BehaviorSubject<AdminUser[]>(this.loadUsers());

  readonly products$ = this.productsSubject.asObservable();
  readonly orders$ = this.ordersSubject.asObservable();
  readonly users$ = this.usersSubject.asObservable();

  addProduct(payload: AdminProductInput): AdminProduct {
    const nextProduct: AdminProduct = {
      ...payload,
      id: this.generateId('PROD'),
      updatedAt: new Date().toISOString()
    };
    const nextCollection = [nextProduct, ...this.productsSubject.value];
    this.persist(this.productStorageKey, nextCollection);
    this.productsSubject.next(nextCollection);
    return nextProduct;
  }

  updateProduct(id: string, changes: Partial<AdminProduct>): AdminProduct | undefined {
    const updatedCollection = this.productsSubject.value.map(product => {
      if (product.id !== id) {
        return product;
      }
      return {
        ...product,
        ...changes,
        updatedAt: new Date().toISOString()
      };
    });
    this.persist(this.productStorageKey, updatedCollection);
    this.productsSubject.next(updatedCollection);
    return updatedCollection.find(product => product.id === id);
  }

  getProductSnapshot(id: string): AdminProduct | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  updateOrderStatus(id: string, status: OrderStatus): void {
    const collection = this.ordersSubject.value.map(order =>
      order.id === id ? { ...order, status } : order
    );
    this.persist(this.orderStorageKey, collection);
    this.ordersSubject.next(collection);
  }

  private loadProducts(): AdminProduct[] {
    const raw = localStorage.getItem(this.productStorageKey);
    if (raw) {
      try {
        return JSON.parse(raw) as AdminProduct[];
      } catch {
        localStorage.removeItem(this.productStorageKey);
      }
    }
    return this.seedProducts();
  }

  private loadOrders(): AdminOrder[] {
    const raw = localStorage.getItem(this.orderStorageKey);
    if (raw) {
      try {
        return JSON.parse(raw) as AdminOrder[];
      } catch {
        localStorage.removeItem(this.orderStorageKey);
      }
    }
    return this.seedOrders();
  }

  private loadUsers(): AdminUser[] {
    const raw = localStorage.getItem(this.userStorageKey);
    if (raw) {
      try {
        return JSON.parse(raw) as AdminUser[];
      } catch {
        localStorage.removeItem(this.userStorageKey);
      }
    }
    const seeded = this.seedUsers();
    this.persist(this.userStorageKey, seeded);
    return seeded;
  }

  private seedProducts(): AdminProduct[] {
    const catalog: AdminProduct[] = [
      this.buildProduct('Heritage Temple Necklace', 'PROD-NEC-01', 'necklaces', 248000, 279000, 6, '22K', 48, 'assets/Necklace/necklace1.webp', ['assets/Necklace/necklace2.webp', 'assets/Necklace/necklace3.webp'], ['Temple', 'Wedding'], true),
      this.buildProduct('Aurora Diamond Jhumkas', 'PROD-EAR-04', 'earrings', 68000, 74500, 18, '18K', 14, 'assets/Earrings/earrings4.webp', ['assets/Earrings/earrings6.webp'], ['Diamond', 'Polki'], true),
      this.buildProduct('Rajam Bridal Bangles', 'PROD-BAN-03', 'bangles', 198000, 214000, 10, '22K', 54, 'assets/Bangles/bangles3.webp', ['assets/Bangles/bangles5.webp'], ['Bridal'], false),
      this.buildProduct('Serenity Platinum Band', 'PROD-RNG-09', 'rings', 84000, 91000, 24, 'PT950', 8, 'assets/Rings/ring9.webp', ['assets/Rings/ring10.webp'], ['Gifting'], false),
      this.buildProduct('Polki Bridal Suite', 'PROD-SPL-02', 'special', 365000, 402000, 4, '22K', 98, 'assets/Special/item4.webp', ['assets/Special/item6.webp'], ['Limited'], true)
    ];
    this.persist(this.productStorageKey, catalog);
    return catalog;
  }

  private seedOrders(): AdminOrder[] {
    const today = new Date();
    const formatDate = (offset: number) => new Date(today.getTime() - offset * 86400000).toISOString();
    const orders: AdminOrder[] = [
      {
        id: 'ORD-10245',
        customerName: 'Lakshmi R.',
        customerEmail: 'lakshmi@sriswaryam.com',
        channel: 'Web',
        status: 'processing',
        total: 312000,
        placedAt: formatDate(1),
        expectedDispatch: formatDate(-2),
        shippingProvider: 'BlueDart Priority',
        trackingId: 'BDX234553',
        items: [
          { productId: 'PROD-NEC-01', name: 'Heritage Temple Necklace', quantity: 1, price: 248000, category: 'necklaces' },
          { productId: 'PROD-EAR-04', name: 'Aurora Diamond Jhumkas', quantity: 1, price: 64000, category: 'earrings' }
        ]
      },
      {
        id: 'ORD-10212',
        customerName: 'Meera D.',
        customerEmail: 'meera@sriswaryam.com',
        channel: 'App',
        status: 'hallmarking',
        total: 154000,
        placedAt: formatDate(3),
        expectedDispatch: formatDate(-1),
        shippingProvider: 'Delhivery Luxe',
        trackingId: 'DLX982341',
        items: [
          { productId: 'PROD-BAN-03', name: 'Rajam Bridal Bangles', quantity: 1, price: 154000, category: 'bangles' }
        ]
      },
      {
        id: 'ORD-10168',
        customerName: 'Arjun K.',
        customerEmail: 'arjun@sriswaryam.com',
        channel: 'In-store',
        status: 'shipped',
        total: 89000,
        placedAt: formatDate(7),
        expectedDispatch: formatDate(-3),
        shippingProvider: 'Sri Courier',
        trackingId: 'SRIC99021',
        items: [
          { productId: 'PROD-RNG-09', name: 'Serenity Platinum Band', quantity: 1, price: 89000, category: 'rings' }
        ]
      }
    ];
    this.persist(this.orderStorageKey, orders);
    return orders;
  }

  private seedUsers(): AdminUser[] {
    return [
      {
        id: 'USR-001',
        name: 'Lakshmi Ramanujam',
        email: 'lakshmi@sriswaryam.com',
        tier: 'Platinum',
        orders: 18,
        lifetimeValue: 1520000,
        joinedOn: '2022-03-18T00:00:00.000Z',
        lastActive: new Date().toISOString(),
        location: 'Chennai'
      },
      {
        id: 'USR-002',
        name: 'Meera Dhandapani',
        email: 'meera@sriswaryam.com',
        tier: 'Gold',
        orders: 9,
        lifetimeValue: 620000,
        joinedOn: '2022-11-02T00:00:00.000Z',
        lastActive: new Date().toISOString(),
        location: 'Coimbatore'
      },
      {
        id: 'USR-003',
        name: 'Arjun Krish',
        email: 'arjun@sriswaryam.com',
        tier: 'Silver',
        orders: 4,
        lifetimeValue: 210000,
        joinedOn: '2023-05-26T00:00:00.000Z',
        lastActive: new Date().toISOString(),
        location: 'Bengaluru'
      }
    ];
  }

  private buildProduct(
    name: string,
    sku: string,
    category: string,
    price: number,
    mrp: number,
    stock: number,
    purity: string,
    weight: number,
    heroImage: string,
    gallery: string[],
    tags: string[],
    featured: boolean
  ): AdminProduct {
    return {
      id: sku,
      name,
      sku,
      category,
      price,
      mrp,
      stock,
      status: 'active',
      purity,
      weight,
      heroImage,
      gallery,
      tags,
      featured,
      description: `${name} crafted in ${purity} with meticulous detailing.`,
      updatedAt: new Date().toISOString()
    };
  }

  private persist(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
  }
}
