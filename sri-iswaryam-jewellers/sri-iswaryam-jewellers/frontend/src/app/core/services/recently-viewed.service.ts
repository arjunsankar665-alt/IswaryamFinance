import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RecentProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  viewedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'recently_viewed';
  private readonly MAX_ITEMS = 10;
  
  private recentlyViewed$ = new BehaviorSubject<RecentProduct[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  get products(): Observable<RecentProduct[]> {
    return this.recentlyViewed$.asObservable();
  }

  get currentProducts(): RecentProduct[] {
    return this.recentlyViewed$.value;
  }

  addProduct(product: Omit<RecentProduct, 'viewedAt'>): void {
    const current = this.recentlyViewed$.value;
    
    // Remove if already exists
    const filtered = current.filter(p => p.id !== product.id);
    
    // Add to beginning with timestamp
    const updated = [
      { ...product, viewedAt: new Date() },
      ...filtered
    ].slice(0, this.MAX_ITEMS);
    
    this.recentlyViewed$.next(updated);
    this.saveToStorage(updated);
  }

  removeProduct(productId: string): void {
    const updated = this.recentlyViewed$.value.filter(p => p.id !== productId);
    this.recentlyViewed$.next(updated);
    this.saveToStorage(updated);
  }

  clear(): void {
    this.recentlyViewed$.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored) as RecentProduct[];
        this.recentlyViewed$.next(products);
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
  }

  private saveToStorage(products: RecentProduct[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  }
}
