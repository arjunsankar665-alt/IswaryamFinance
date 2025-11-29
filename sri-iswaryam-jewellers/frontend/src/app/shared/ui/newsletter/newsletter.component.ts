import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  newsletterForm: FormGroup;
  isSubmitting = false;
  isSubscribed = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.newsletterForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubscribed = true;
      this.notificationService.success('Successfully subscribed to our newsletter!');
      this.newsletterForm.reset();
    }, 1500);
  }

  get emailControl() {
    return this.newsletterForm.get('email');
  }
}
