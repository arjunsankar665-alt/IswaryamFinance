import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from './components/address-selection/address-selection.component';
import { DeliveryOption } from './components/delivery-options/delivery-options.component';
import { PaymentDetails } from './components/payment-methods/payment-methods.component';
import { OrderItem } from './components/order-review/order-review.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentStep = 0;
  steps = ['Address', 'Delivery', 'Payment', 'Review'];

  // Step validity flags
  stepValidity = [false, true, false, true]; // Delivery pre-selected, Review always valid

  // Selected data
  selectedAddress: Address | null = null;
  selectedDelivery: DeliveryOption | null = null;
  selectedPayment: PaymentDetails | null = null;

  // Cart items (mock data)
  cartItems: OrderItem[] = [
    { id: '1', name: 'Traditional Gold Necklace', image: 'assets/images/products/necklace-1.jpg', price: 125000, quantity: 1 },
    { id: '4', name: 'Platinum Wedding Ring', image: 'assets/images/products/ring-1.jpg', price: 75000, quantity: 2 }
  ];

  // Price calculations
  subtotal = 0;
  discounts = 0;
  shipping = 0;
  taxes = 0;

  constructor(
    private router: Router,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.calculatePrices();
  }

  calculatePrices(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.discounts = this.subtotal > 200000 ? Math.round(this.subtotal * 0.02) : 0;
    this.shipping = this.selectedDelivery?.price || 0;
    this.taxes = Math.round((this.subtotal - this.discounts) * 0.03);
  }

  // Step navigation
  canProceed(): boolean {
    return this.stepValidity[this.currentStep];
  }

  nextStep(): void {
    if (this.canProceed() && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.stepValidity[step - 1]) {
      this.currentStep = step;
    }
  }

  // Event handlers
  onAddressSelected(address: Address): void {
    this.selectedAddress = address;
  }

  onAddressValidity(valid: boolean): void {
    this.stepValidity[0] = valid;
  }

  onDeliverySelected(option: DeliveryOption): void {
    this.selectedDelivery = option;
    this.calculatePrices();
  }

  onDeliveryValidity(valid: boolean): void {
    this.stepValidity[1] = valid;
  }

  onPaymentSelected(payment: PaymentDetails): void {
    this.selectedPayment = payment;
  }

  onPaymentValidity(valid: boolean): void {
    this.stepValidity[2] = valid;
  }

  onEditStep(step: number): void {
    this.goToStep(step);
  }

  onPlaceOrder(): void {
    console.log('Placing order...', {
      address: this.selectedAddress,
      delivery: this.selectedDelivery,
      payment: this.selectedPayment,
      items: this.cartItems,
      total: this.subtotal - this.discounts + this.shipping + this.taxes
    });
    // TODO: Call order API
    this.notificationService.success('Order placed', 'Thank you for shopping with Sri Iswaryam.');
    this.router.navigate(['/account/orders']);
  }
}
