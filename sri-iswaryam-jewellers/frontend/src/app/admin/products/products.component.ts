import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminDataService, AdminProduct, ProductStatus } from '../../admin/services/admin-data.service';

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
  viewMode: 'table' | 'gallery' = 'table';
  private subscriptions = new Subscription();

  constructor(
    private readonly adminData: AdminDataService,
    private readonly router: Router
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

  onStatusChange(product: AdminProduct, status: ProductStatus): void {
    this.adminData.updateProduct(product.id, { status });
  }

  toggleFeatured(product: AdminProduct): void {
    this.adminData.updateProduct(product.id, { featured: !product.featured });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.categoryFilter === 'all' || product.category === this.categoryFilter;
      const matchesSearch = !this.searchTerm || product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || product.sku.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  async editProduct(product: AdminProduct): Promise<void> {
    await this.router.navigate(['/admin/products', product.id, 'edit']);
  }

  async addProduct(): Promise<void> {
    await this.router.navigate(['/admin/products/new']);
  }
}
