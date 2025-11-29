import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private idCounter = 0;

  get notifications(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  success(title: string, message?: string, duration = 4000): void {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration = 6000): void {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration = 5000): void {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration = 4000): void {
    this.show({ type: 'info', title, message, duration });
  }

  private show(toast: Omit<Toast, 'id' | 'dismissible'>): void {
    const newToast: Toast = {
      ...toast,
      id: ++this.idCounter,
      dismissible: true
    };
    
    this.toasts$.next([...this.toasts$.value, newToast]);

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => this.dismiss(newToast.id), toast.duration);
    }
  }

  dismiss(id: number): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts$.next([]);
  }
}
