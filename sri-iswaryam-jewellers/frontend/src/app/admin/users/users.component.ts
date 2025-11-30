import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AdminDataService, AdminUser } from '../../admin/services/admin-data.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  tierFilter: AdminUser['tier'] | 'all' = 'all';
  searchTerm = '';
  viewMode: 'table' | 'grid' = 'table';
  summary = {
    activeClients: 0,
    avgOrders: 0,
    totalValue: 0,
    engagedToday: 0
  };
  readonly tiers: Array<AdminUser['tier']> = ['Platinum', 'Gold', 'Silver', 'Guest'];
  private subscriptions = new Subscription();

  constructor(private readonly adminData: AdminDataService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.adminData.users$.subscribe(users => {
        this.users = users;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  applyFilters(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = this.users.filter(user => {
      const matchesTier = this.tierFilter === 'all' || user.tier === this.tierFilter;
      const matchesQuery = !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.location.toLowerCase().includes(query);
      return matchesTier && matchesQuery;
    });
    this.updateSummary();
  }

  trackByUser(_: number, user: AdminUser): string {
    return user.id;
  }

  loyaltyBadge(tier: AdminUser['tier']): string {
    return tier;
  }

  private updateSummary(): void {
    const totalClients = this.filteredUsers.length;
    const totalOrders = this.filteredUsers.reduce((sum, user) => sum + user.orders, 0);
    const totalValue = this.filteredUsers.reduce((sum, user) => sum + user.lifetimeValue, 0);
    const engagedToday = this.filteredUsers.filter(user => this.isRecent(user.lastActive)).length;

    this.summary = {
      activeClients: totalClients,
      avgOrders: totalClients ? Math.round((totalOrders / totalClients) * 10) / 10 : 0,
      totalValue,
      engagedToday
    };
  }

  private isRecent(timestamp: string): boolean {
    const lastActive = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - lastActive.getTime()) / 36e5;
    return diffHours <= 24;
  }

}
