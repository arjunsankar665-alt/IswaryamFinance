import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  isSubmitted = false;

  inquiryTypes = [
    { value: 'order', label: 'Order Related' },
    { value: 'product', label: 'Product Inquiry' },
    { value: 'return', label: 'Return/Exchange' },
    { value: 'custom', label: 'Custom Order' },
    { value: 'feedback', label: 'Feedback/Suggestion' },
    { value: 'other', label: 'Other' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      inquiryType: ['', Validators.required],
      orderNumber: [''],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
    }, 2000);
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.contactForm.reset();
  }

  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  getError(field: string): string {
    const control = this.contactForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Please enter a valid email';
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} characters required`;
    }
    if (control?.hasError('pattern')) return 'Please enter a valid 10-digit phone number';
    return '';
  }
}
