import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Address } from '../address-selection/address-selection.component';
import { DeliveryOption } from '../delivery-options/delivery-options.component';
import { PaymentDetails } from '../payment-methods/payment-methods.component';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent {
  @Input() items: OrderItem[] = [];
  @Input() address: Address | null = null;
  @Input() delivery: DeliveryOption | null = null;
  @Input() payment: PaymentDetails | null = null;
  @Input() subtotal = 0;
  @Input() discounts = 0;
  @Input() shipping = 0;
  @Input() taxes = 0;
  @Output() placeOrder = new EventEmitter<void>();
  @Output() editStep = new EventEmitter<number>();

  get total(): number {
    return this.subtotal - this.discounts + this.shipping + this.taxes;
  }

  getPaymentMethodLabel(): string {
    if (!this.payment) return '';
    const labels: Record<string, string> = {
      cod: 'Cash on Delivery',
      card: 'Credit/Debit Card',
      upi: 'UPI',
      netbanking: 'Net Banking'
    };
    return labels[this.payment.method] || this.payment.method;
  }

  getMaskedCardNumber(): string {
    if (this.payment?.cardNumber) {
      return '•••• •••• •••• ' + this.payment.cardNumber.slice(-4);
    }
    return '';
  }

  onPlaceOrder(): void {
    this.placeOrder.emit();
  }

  onEditStep(step: number): void {
    this.editStep.emit(step);
  }
}
