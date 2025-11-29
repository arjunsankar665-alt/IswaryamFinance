import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminDataService, AdminOrder, OrderStatus } from '../../admin/services/admin-data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  readonly statuses: Array<OrderStatus | 'all'> = ['all', 'pending', 'processing', 'hallmarking', 'packed', 'shipped', 'delivered'];
  readonly statusFlow: OrderStatus[] = ['pending', 'processing', 'hallmarking', 'packed', 'shipped', 'delivered'];
  selectedStatus: OrderStatus | 'all' = 'all';
  private subscriptions = new Subscription();

  constructor(private readonly adminData: AdminDataService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.adminData.orders$.subscribe(orders => {
        this.orders = orders;
        this.applyFilter();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilter(): void {
    this.filteredOrders = this.orders.filter(order => this.selectedStatus === 'all' || order.status === this.selectedStatus);
  }

  updateStatus(order: AdminOrder, status: OrderStatus): void {
    this.adminData.updateOrderStatus(order.id, status);
  }

  trackByOrder(_: number, order: AdminOrder): string {
    return order.id;
  }

  isStepActive(orderStatus: OrderStatus, step: OrderStatus): boolean {
    return this.statusFlow.indexOf(orderStatus) >= this.statusFlow.indexOf(step);
  }
}
