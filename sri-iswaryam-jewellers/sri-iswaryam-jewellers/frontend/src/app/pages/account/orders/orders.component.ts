import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  trackingNumber?: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedFilter = 'all';
  isLoading = true;

  filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    // Simulate API call
    setTimeout(() => {
      this.orders = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001234',
          date: new Date('2024-01-15'),
          status: 'delivered',
          items: [
            { id: 'p1', name: 'Gold Temple Necklace', image: 'assets/images/products/necklace1.jpg', price: 125000, quantity: 1 },
            { id: 'p2', name: 'Gold Jhumka Earrings', image: 'assets/images/products/earring1.jpg', price: 35000, quantity: 1 }
          ],
          total: 160000,
          paymentMethod: 'Credit Card',
          trackingNumber: 'DL123456789IN'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-001567',
          date: new Date('2024-02-20'),
          status: 'shipped',
          items: [
            { id: 'p3', name: 'Diamond Pendant', image: 'assets/images/products/pendant1.jpg', price: 89000, quantity: 1 }
          ],
          total: 89000,
          paymentMethod: 'UPI',
          trackingNumber: 'DL987654321IN'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-002100',
          date: new Date('2024-03-10'),
          status: 'processing',
          items: [
            { id: 'p4', name: 'Gold Bangles Set', image: 'assets/images/products/bangle1.jpg', price: 75000, quantity: 2 }
          ],
          total: 150000,
          paymentMethod: 'Net Banking'
        }
      ];
      this.filteredOrders = [...this.orders];
      this.isLoading = false;
    }, 1000);
  }

  onFilterChange(): void {
    if (this.selectedFilter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.selectedFilter);
    }
  }

  viewOrder(orderId: string): void {
    this.router.navigate(['/account/orders', orderId]);
  }

  trackOrder(order: Order): void {
    this.router.navigate(['/account/order-tracking', order.id]);
  }

  reorder(order: Order): void {
    // Add items to cart logic
    console.log('Reordering:', order.id);
  }

  downloadInvoice(order: Order): void {
    // Download invoice logic
    console.log('Downloading invoice:', order.orderNumber);
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'processing': 'bg-blue-100 text-blue-700',
      'shipped': 'bg-purple-100 text-purple-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
