import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import { AdminDataService, AdminOrder, AdminProduct, AdminUser } from '../services/admin-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  products: AdminProduct[] = [];
  orders: AdminOrder[] = [];
  users: AdminUser[] = [];

  kpis: Array<{ label: string; value: string; trend: string; positive: boolean }> = [];
  fulfillmentQueue: AdminOrder[] = [];
  spotlightProducts: AdminProduct[] = [];
  loyaltySnapshot: AdminUser[] = [];

  private subscriptions = new Subscription();

  constructor(private readonly adminData: AdminDataService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.adminData.products$,
        this.adminData.orders$,
        this.adminData.users$
      ]).subscribe(([products, orders, users]) => {
        this.products = products;
        this.orders = orders;
        this.users = users;
        this.recalculateDashboard();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private recalculateDashboard(): void {
    const activeProducts = this.products.filter(product => product.status === 'active');
    const totalInventory = activeProducts.reduce((sum, product) => sum + product.stock, 0);
    const openOrders = this.orders.filter(order => order.status !== 'delivered');
    const revenue = this.orders.reduce((sum, order) => sum + order.total, 0);
    const premiumUsers = this.users.filter(user => user.tier === 'Platinum' || user.tier === 'Gold');

    this.kpis = [
      { label: 'Active styles', value: activeProducts.length.toString(), trend: '+8.3% vs last week', positive: true },
      { label: 'Orders in pipeline', value: openOrders.length.toString(), trend: '4 priority orders', positive: false },
      { label: 'Inventory units', value: totalInventory.toString(), trend: 'Healthy for 12 days', positive: true },
      { label: 'Monthly revenue', value: `₹${this.asCurrency(revenue)}`, trend: 'Goal: ₹45L', positive: true }
    ];

    this.fulfillmentQueue = openOrders.slice(0, 4);
    this.spotlightProducts = [...activeProducts]
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 3);
    this.loyaltySnapshot = premiumUsers.slice(0, 3);
  }

  private asCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
  }
}
