import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export type PaymentMethod = 'cod' | 'card' | 'upi' | 'netbanking';

export interface PaymentDetails {
  method: PaymentMethod;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  upiId?: string;
  bank?: string;
}

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css']
})
export class PaymentMethodsComponent implements OnInit {
  @Output() paymentSelected = new EventEmitter<PaymentDetails>();
  @Output() validityChange = new EventEmitter<boolean>();

  selectedMethod: PaymentMethod | null = null;
  cardForm!: FormGroup;
  upiForm!: FormGroup;
  netbankingForm!: FormGroup;

  banks = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardCvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });

    this.upiForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern(/^[\w.-]+@[\w]+$/)]]
    });

    this.netbankingForm = this.fb.group({
      bank: ['', Validators.required]
    });

    // Subscribe to form changes
    this.cardForm.statusChanges.subscribe(() => this.checkValidity());
    this.upiForm.statusChanges.subscribe(() => this.checkValidity());
    this.netbankingForm.statusChanges.subscribe(() => this.checkValidity());
  }

  selectMethod(method: PaymentMethod): void {
    this.selectedMethod = method;
    this.checkValidity();
  }

  checkValidity(): void {
    let isValid = false;
    if (this.selectedMethod === 'cod') {
      isValid = true;
      this.paymentSelected.emit({ method: 'cod' });
    } else if (this.selectedMethod === 'card' && this.cardForm.valid) {
      isValid = true;
      this.paymentSelected.emit({
        method: 'card',
        cardNumber: this.cardForm.value.cardNumber,
        cardExpiry: this.cardForm.value.cardExpiry,
        cardCvv: this.cardForm.value.cardCvv
      });
    } else if (this.selectedMethod === 'upi' && this.upiForm.valid) {
      isValid = true;
      this.paymentSelected.emit({ method: 'upi', upiId: this.upiForm.value.upiId });
    } else if (this.selectedMethod === 'netbanking' && this.netbankingForm.valid) {
      isValid = true;
      this.paymentSelected.emit({ method: 'netbanking', bank: this.netbankingForm.value.bank });
    }
    this.validityChange.emit(isValid);
  }

  get cf() { return this.cardForm.controls; }
  get uf() { return this.upiForm.controls; }
}
