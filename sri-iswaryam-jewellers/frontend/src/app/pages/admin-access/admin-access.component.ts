import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminAccessService } from '../../core/services/admin-access.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-admin-access',
  templateUrl: './admin-access.component.html',
  styleUrls: ['./admin-access.component.css']
})
export class AdminAccessComponent {
  readonly form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  loading = false;
  redirectUrl = '/admin';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly adminAccessService: AdminAccessService,
    private readonly notificationService: NotificationService
  ) {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    if (redirect) {
      this.redirectUrl = redirect;
    }
  }

  get passwordInvalid(): boolean {
    const control = this.form.get('password');
    return Boolean(control && control.touched && control.invalid);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const password = this.form.value.password ?? '';
    this.loading = true;
    try {
      await this.adminAccessService.verifyPassword(password);
      const target = this.adminAccessService.consumeRedirect() || this.redirectUrl || '/admin';
      this.notificationService.success('Access granted', 'Welcome back to the control room.');
      await this.router.navigateByUrl(target);
    } catch (error) {
      this.notificationService.error('Unable to verify password', this.extractErrorMessage(error));
      this.form.reset();
    } finally {
      this.loading = false;
    }
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Please try again.';
    }
    return 'Please try again.';
  }
}
