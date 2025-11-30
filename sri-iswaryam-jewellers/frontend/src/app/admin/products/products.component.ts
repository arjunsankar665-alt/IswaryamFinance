import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminDataService, AdminProduct, ProductStatus } from '../../admin/services/admin-data.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: AdminProduct[] = [];
  filteredProducts: AdminProduct[] = [];
  categories: string[] = [];
  categoryFilter = 'all';
  searchTerm = '';
  includeInactive = false;
  viewMode: 'table' | 'gallery' = 'table';
  private subscriptions = new Subscription();

  constructor(
    private readonly adminData: AdminDataService,
    private readonly router: Router,
    private readonly notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.adminData.products$.subscribe(products => {
        this.products = products;
        this.categories = Array.from(new Set(products.map(product => product.category)));
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  async onStatusChange(product: AdminProduct, status: ProductStatus): Promise<void> {
    try {
      await this.adminData.updateProduct(product.id, { status });
      this.notifications.success('Status updated', `${product.name} is now ${status}.`);
    } catch (error) {
      this.notifications.error('Unable to update status');
    }
  }

  async toggleFeatured(product: AdminProduct): Promise<void> {
    try {
      await this.adminData.updateProduct(product.id, { featured: !product.featured });
      this.notifications.success('Visibility updated', `${product.name} feature badge refreshed.`);
    } catch (error) {
      this.notifications.error('Unable to update product');
    }
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
      const matchesSearch = !this.searchTerm || product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      const isVisible = this.includeInactive ? true : product.status !== 'inactive';
      return matchesCategory && matchesSearch && isVisible;
    });
  }

  async editProduct(product: AdminProduct): Promise<void> {
    await this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  async addProduct(): Promise<void> {
    await this.router.navigate(['/admin/products/new']);
  }

  confirmDelete(product: AdminProduct): void {
    const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }
    void this.deleteProduct(product);
  }

  private async deleteProduct(product: AdminProduct): Promise<void> {
    try {
      await this.adminData.deleteProduct(product.id);
      this.notifications.success('Product deleted', `${product.name} has been permanently removed.`);
    } catch (error) {
      this.notifications.error('Unable to delete product');
    }
  }
}
