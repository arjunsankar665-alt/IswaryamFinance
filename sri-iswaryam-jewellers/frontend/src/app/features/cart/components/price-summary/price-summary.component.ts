import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-summary',
  templateUrl: './price-summary.component.html',
  styleUrls: ['./price-summary.component.css']
})
export class PriceSummaryComponent {
  @Input() subtotal = 0;
  @Input() discounts = 0;
  @Input() shipping = 0;
  @Input() taxes = 0;
  @Output() checkout = new EventEmitter<void>();

  get total(): number {
    return Math.max(0, this.subtotal - this.discounts + this.shipping + this.taxes);
  }

  onCheckout(): void {
    this.checkout.emit();
  }
}
