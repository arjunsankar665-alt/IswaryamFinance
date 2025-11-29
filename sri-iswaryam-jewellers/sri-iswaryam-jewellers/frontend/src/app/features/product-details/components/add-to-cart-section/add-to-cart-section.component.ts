import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DeliveryInfo {
  available: boolean;
  estimatedDate?: string;
  codAvailable?: boolean;
}

@Component({
  selector: 'app-add-to-cart-section',
  templateUrl: './add-to-cart-section.component.html',
  styleUrls: ['./add-to-cart-section.component.css']
})
export class AddToCartSectionComponent {
  @Input() inStock = true;
  @Input() maxQuantity = 10;
  @Output() addToCartEvent = new EventEmitter<number>();
  @Output() buyNowEvent = new EventEmitter<number>();

  quantity = 1;
  pincode = '';
  deliveryInfo: DeliveryInfo | null = null;

  offers: string[] = [
    'Get 5% instant discount on HDFC Credit Cards',
    'EMI starting from ₹2,999/month',
    'Free insured shipping on orders above ₹10,000',
    'Extra 2% off with SBI Debit Card'
  ];

  incrementQuantity(): void {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    this.addToCartEvent.emit(this.quantity);
  }

  buyNow(): void {
    this.buyNowEvent.emit(this.quantity);
  }

  checkDelivery(): void {
    // Simulate delivery check API call
    const availablePincodes = ['600001', '600002', '600004', '600005', '600006', '600017', '600018', '600020'];
    const isAvailable = availablePincodes.some(p => this.pincode.startsWith(p.substring(0, 3)));
    
    if (isAvailable) {
      const deliveryDays = Math.floor(Math.random() * 3) + 3;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
      
      this.deliveryInfo = {
        available: true,
        estimatedDate: deliveryDate.toLocaleDateString('en-IN', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        }),
        codAvailable: parseInt(this.pincode) % 2 === 0
      };
    } else {
      this.deliveryInfo = { available: false };
    }
  }
}
