import { Component } from '@angular/core';

interface AccountNavItem {
  label: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  readonly navItems: AccountNavItem[] = [
    { label: 'Orders & Returns', description: 'History, invoices, easy reorders', icon: '📦', route: 'orders' },
    { label: 'Track Order', description: 'Live courier updates & ETA', icon: '🎯', route: 'order-tracking' },
    { label: 'Profile', description: 'Personal details & preferences', icon: '👤', route: 'profile' },
    { label: 'Settings', description: 'Security, addresses, alerts', icon: '⚙️', route: 'settings' }
  ];
}
