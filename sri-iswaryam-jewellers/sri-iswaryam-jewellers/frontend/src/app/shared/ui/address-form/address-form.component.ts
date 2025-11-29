import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work' | 'other';
  isDefault?: boolean;
}

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  @Input() address: Address | null = null;
  @Input() isSubmitting = false;
  @Input() submitButtonText = 'Save Address';
  
  @Output() submitForm = new EventEmitter<Address>();
  @Output() cancel = new EventEmitter<void>();

  addressForm!: FormGroup;

  states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Chandigarh'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    if (this.address) {
      this.addressForm.patchValue(this.address);
    }
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      alternatePhone: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      addressLine1: ['', [Validators.required, Validators.minLength(10)]],
      addressLine2: [''],
      landmark: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      addressType: ['home', Validators.required],
      isDefault: [false]
    });
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.submitForm.emit({
      ...this.address,
      ...this.addressForm.value
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getError(field: string): string {
    const control = this.addressForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} characters required`;
    if (control?.hasError('pattern')) {
      if (field === 'phone' || field === 'alternatePhone') return 'Enter valid 10-digit mobile number';
      if (field === 'pincode') return 'Enter valid 6-digit pincode';
    }
    return '';
  }

  isInvalid(field: string): boolean {
    const control = this.addressForm.get(field);
    return !!control && control.invalid && control.touched;
  }
}
