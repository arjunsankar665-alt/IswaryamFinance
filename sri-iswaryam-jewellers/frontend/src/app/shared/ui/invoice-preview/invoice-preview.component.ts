import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface InvoiceItem {
  name: string;
  sku: string;
  quantity: number;
  weight?: string;
  price: number;
  tax: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  orderDate: Date;
  invoiceDate: Date;
  
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  billingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  items: InvoiceItem[];
  
  subtotal: number;
  discount: number;
  shippingCharge: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css']
})
export class InvoicePreviewComponent {
  @Input() invoice: InvoiceData | null = null;
  @Input() showActions = true;
  
  @Output() download = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
  @Output() email = new EventEmitter<void>();

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  onDownload(): void {
    this.download.emit();
  }

  onPrint(): void {
    this.print.emit();
    window.print();
  }

  onEmail(): void {
    this.email.emit();
  }

  getPaymentStatusClass(): string {
    switch (this.invoice?.paymentStatus) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
