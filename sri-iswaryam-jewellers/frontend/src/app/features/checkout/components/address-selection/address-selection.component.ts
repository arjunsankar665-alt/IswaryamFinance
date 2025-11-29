import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

@Component({
  selector: 'app-address-selection',
  templateUrl: './address-selection.component.html',
  styleUrls: ['./address-selection.component.css']
})
export class AddressSelectionComponent implements OnInit {
  @Output() addressSelected = new EventEmitter<Address>();
  @Output() validityChange = new EventEmitter<boolean>();

  savedAddresses: Address[] = [
    {
      id: '1', name: 'Priya Sharma', phone: '9876543210',
      addressLine1: '123, Anna Nagar', addressLine2: 'Near Bus Stand',
      city: 'Chennai', state: 'Tamil Nadu', pincode: '600040', isDefault: true
    },
    {
      id: '2', name: 'Priya Sharma', phone: '9876543210',
      addressLine1: '45, MG Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001'
    }
  ];

  selectedAddressId: string | null = null;
  showNewAddressForm = false;
  addressForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      addressLine1: ['', [Validators.required, Validators.minLength(5)]],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    // Select default address initially
    const defaultAddr = this.savedAddresses.find(a => a.isDefault);
    if (defaultAddr) {
      this.selectAddress(defaultAddr.id);
    }

    this.addressForm.statusChanges.subscribe(() => {
      if (this.showNewAddressForm) {
        this.validityChange.emit(this.addressForm.valid);
      }
    });
  }

  selectAddress(id: string): void {
    this.selectedAddressId = id;
    this.showNewAddressForm = false;
    const addr = this.savedAddresses.find(a => a.id === id);
    if (addr) {
      this.addressSelected.emit(addr);
      this.validityChange.emit(true);
    }
  }

  toggleNewAddressForm(): void {
    this.showNewAddressForm = !this.showNewAddressForm;
    if (this.showNewAddressForm) {
      this.selectedAddressId = null;
      this.validityChange.emit(this.addressForm.valid);
    }
  }

  saveNewAddress(): void {
    if (this.addressForm.valid) {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...this.addressForm.value
      };
      this.savedAddresses.push(newAddress);
      this.selectAddress(newAddress.id);
      this.addressForm.reset();
      this.showNewAddressForm = false;
    }
  }

  get f() { return this.addressForm.controls; }
}
