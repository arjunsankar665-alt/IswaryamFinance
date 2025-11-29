import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  avatar?: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  isSubmitting = false;

  user: UserProfile = {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '9876543210',
    dateOfBirth: '1990-05-15',
    gender: 'female',
    avatar: ''
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [{ value: this.user.email, disabled: true }],
      phone: [this.user.phone, [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      dateOfBirth: [this.user.dateOfBirth],
      gender: [this.user.gender]
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.profileForm.patchValue(this.user);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.user = { ...this.user, ...this.profileForm.getRawValue() };
      this.isSubmitting = false;
      this.isEditing = false;
    }, 1500);
  }

  isInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  getError(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('minlength')) return `Minimum ${control.errors?.['minlength'].requiredLength} characters`;
    if (control?.hasError('pattern')) return 'Enter a valid 10-digit phone number';
    return '';
  }

  get initials(): string {
    return (this.user.firstName[0] + this.user.lastName[0]).toUpperCase();
  }
}
