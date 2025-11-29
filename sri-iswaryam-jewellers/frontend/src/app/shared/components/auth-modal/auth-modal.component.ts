import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthModalComponent implements OnChanges {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() authenticated = new EventEmitter<void>();

  mode: 'login' | 'register' = 'login';
  errorMessage = '';
  isSubmitting = false;

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && !this.open) {
      this.reset();
    }
  }

  switchMode(nextMode: 'login' | 'register'): void {
    if (this.mode === nextMode) {
      return;
    }
    this.mode = nextMode;
    this.errorMessage = '';
  }

  async submitLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';
    try {
      await this.authService.login(this.loginForm.getRawValue());
      this.authenticated.emit();
      this.close();
    } catch (error) {
      this.errorMessage = this.presentError(error);
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = '';
    try {
      await this.authService.register(this.registerForm.getRawValue());
      this.authenticated.emit();
      this.close();
    } catch (error) {
      this.errorMessage = this.presentError(error);
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  close(): void {
    this.closed.emit();
    this.reset();
  }

  private reset(): void {
    this.mode = 'login';
    this.errorMessage = '';
    this.isSubmitting = false;
    this.loginForm.reset({ email: '', password: '' });
    this.registerForm.reset({ name: '', email: '', password: '' });
  }

  private presentError(error: unknown): string {
    if (!error) {
      return 'Unable to complete the request. Please try again.';
    }
    if (typeof error === 'string') {
      return error;
    }
    if (typeof error === 'object') {
      const { message } = error as { message?: string };
      if (message) {
        return message;
      }
    }
    return 'Unable to complete the request. Please try again.';
  }
}
