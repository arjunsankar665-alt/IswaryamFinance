import { Component, EventEmitter, OnInit, Output } from '@angular/core';

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
}

@Component({
  selector: 'app-delivery-options',
  templateUrl: './delivery-options.component.html',
  styleUrls: ['./delivery-options.component.css']
})
export class DeliveryOptionsComponent implements OnInit {
  @Output() optionSelected = new EventEmitter<DeliveryOption>();
  @Output() validityChange = new EventEmitter<boolean>();

  deliveryOptions: DeliveryOption[] = [
    { id: 'standard', name: 'Standard Delivery', description: 'Regular shipping with tracking', price: 0, estimatedDays: 5 },
    { id: 'express', name: 'Express Delivery', description: 'Faster delivery with priority handling', price: 199, estimatedDays: 2 },
    { id: 'sameday', name: 'Same Day Delivery', description: 'Available in select cities only', price: 499, estimatedDays: 0 }
  ];

  selectedOptionId: string | null = null;

  ngOnInit(): void {
    // Pre-select standard delivery
    this.selectOption(this.deliveryOptions[0].id);
  }

  selectOption(id: string): void {
    this.selectedOptionId = id;
    const option = this.deliveryOptions.find(o => o.id === id);
    if (option) {
      this.optionSelected.emit(option);
      this.validityChange.emit(true);
    }
  }

  getEstimatedDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  }
}
