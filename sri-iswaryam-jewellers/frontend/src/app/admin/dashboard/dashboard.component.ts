import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';
import {
  AdminCategory,
  AdminDataService,
  AdminOrder,
  AdminProduct,
  AdminUser
} from '../services/admin-data.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis
} from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  products: AdminProduct[] = [];
  orders: AdminOrder[] = [];
  users: AdminUser[] = [];
  categories: AdminCategory[] = [];

  kpis: Array<{ label: string; value: string; trend: string; positive: boolean }> = [];
  fulfillmentQueue: AdminOrder[] = [];
  spotlightProducts: AdminProduct[] = [];
  loyaltySnapshot: AdminUser[] = [];

  revenueSeries: ApexAxisChartSeries = [];
  revenueChart: ApexChart = { type: 'line', height: 280, toolbar: { show: false } };
  revenueStroke: Partial<ApexStroke> = { curve: 'smooth', width: 3 };
  revenueDataLabels: Partial<ApexDataLabels> = { enabled: false };
  revenueFill: Partial<ApexFill> = {
    type: 'gradient',
    gradient: { shadeIntensity: 0.6, opacityFrom: 0.85, opacityTo: 0.1, stops: [0, 90, 100] }
  };
  revenueTooltip: Partial<ApexTooltip> = {
    y: {
      formatter: value => `₹${Math.round(value ?? 0).toLocaleString('en-IN')}`
    }
  };
  revenueXAxis: Partial<ApexXAxis> = { categories: [] };

  categorySeries: ApexNonAxisChartSeries = [];
  categoryLabels: string[] = [];
  categoryChart: ApexChart = { type: 'donut', height: 260 };
  categoryLegend: Partial<ApexLegend> = { position: 'bottom' };
  categoryResponsive: ApexResponsive[] = [{ breakpoint: 1024, options: { chart: { height: 240 } } }];
  categoryColors: string[] = ['#f59e0b', '#6366f1', '#10b981', '#06b6d4', '#f97316', '#8b5cf6'];

  statusSeries: ApexAxisChartSeries = [];
  statusChart: ApexChart = { type: 'bar', height: 260, toolbar: { show: false } };
  statusPlotOptions: Partial<ApexPlotOptions> = { bar: { horizontal: true, barHeight: '60%' } };
  statusDataLabels: Partial<ApexDataLabels> = { enabled: false };
  statusXAxis: Partial<ApexXAxis> = { categories: [] };
  statusColors: string[] = ['#facc15', '#f97316', '#8b5cf6', '#0ea5e9', '#10b981'];
  statusTooltip: Partial<ApexTooltip> = {
    y: {
      formatter: value => `${Math.round(value ?? 0)} orders`
    }
  };

  private subscriptions = new Subscription();

  constructor(private readonly adminData: AdminDataService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.adminData.products$,
        this.adminData.orders$,
        this.adminData.users$,
        this.adminData.categories$
      ]).subscribe(([products, orders, users, categories]) => {
        this.products = products;
        this.orders = orders;
        this.users = users;
        this.categories = categories;
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

    this.calculateRevenueChart();
    this.calculateCategoryChart(activeProducts);
    this.calculateStatusChart(openOrders);
  }

  private asCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
  }

  private calculateRevenueChart(): void {
    const months = 6;
    const now = new Date();
    const buckets: Array<{ key: string; label: string; total: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const point = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${point.getFullYear()}-${point.getMonth()}`;
      buckets.push({
        key,
        label: point.toLocaleString('en-US', { month: 'short' }),
        total: 0
      });
    }

    const bucketMap = new Map(buckets.map(bucket => [bucket.key, bucket]));
    this.orders.forEach(order => {
      const placed = order.placedAt ? new Date(order.placedAt) : null;
      if (!placed || Number.isNaN(placed.getTime())) {
        return;
      }
      const key = `${placed.getFullYear()}-${placed.getMonth()}`;
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.total += order.total ?? 0;
      }
    });

    this.revenueSeries = [
      {
        name: 'Revenue',
        data: buckets.map(bucket => Math.round(bucket.total))
      }
    ];
    this.revenueXAxis = { categories: buckets.map(bucket => bucket.label) };
  }

  private calculateCategoryChart(activeProducts: AdminProduct[]): void {
    const mixMap = new Map<string, number>();

    activeProducts.forEach(product => {
      const label = product.categoryName || product.category || 'Uncategorized';
      mixMap.set(label, (mixMap.get(label) ?? 0) + 1);
    });

    // Fallback to known categories if products list is empty
    if (mixMap.size === 0 && this.categories.length) {
      this.categories.forEach(category => {
        mixMap.set(category.name, category.isActive ? 1 : 0);
      });
    }

    const entries = Array.from(mixMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
    this.categoryLabels = entries.map(entry => entry[0]);
    this.categorySeries = entries.map(entry => entry[1]);
  }

  private calculateStatusChart(openOrders: AdminOrder[]): void {
    const statuses = ['pending', 'processing', 'hallmarking', 'shipped', 'delivered'];
    const counts = new Map<string, number>(statuses.map(status => [status, 0]));

    openOrders.forEach(order => {
      const raw = order.status?.toLowerCase?.() ?? 'pending';
      const key = statuses.includes(raw) ? raw : 'pending';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    this.statusXAxis = { categories: statuses.map(status => status.charAt(0).toUpperCase() + status.slice(1)) };
    this.statusSeries = [
      {
        name: 'Orders',
        data: statuses.map(status => counts.get(status) ?? 0)
      }
    ];
  }
}
