import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminDataService, AdminMenu } from '../../services/admin-data.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-menu-manager',
  templateUrl: './menu-manager.component.html',
  styleUrls: ['./menu-manager.component.css']
})
export class MenuManagerComponent {
  readonly menus$ = this.adminData.menus$;

  readonly form = this.fb.nonNullable.group({
    label: ['', [Validators.required, Validators.minLength(3)]],
    url: ['', [Validators.required]],
    display: ['link' as 'link' | 'categories'],
    isActive: [true],
    sortOrder: [0, [Validators.required, Validators.min(0)]],
    icon: ['']
  });

  editingId: string | null = null;
  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly adminData: AdminDataService,
    private readonly notifications: NotificationService
  ) {}

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    try {
      const payload = this.form.getRawValue();
      if (this.editingId) {
        await this.adminData.updateMenu(this.editingId, payload);
        this.notifications.success('Menu updated', `${payload.label} saved successfully.`);
      } else {
        await this.adminData.addMenu(payload);
        this.notifications.success('Menu created', `${payload.label} added to navigation.`);
      }
      this.resetForm();
    } finally {
      this.submitting = false;
    }
  }

  edit(menu: AdminMenu): void {
    this.editingId = menu.id;
    this.form.patchValue({
      label: menu.label,
      url: menu.url,
      display: menu.display,
      isActive: menu.isActive,
      sortOrder: menu.sortOrder,
      icon: menu.icon ?? ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async delete(menu: AdminMenu): Promise<void> {
    if (!confirm(`Remove ${menu.label} from navigation?`)) {
      return;
    }
    await this.adminData.deleteMenu(menu.id);
    this.notifications.success('Menu removed', `${menu.label} no longer visible.`);
    if (this.editingId === menu.id) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ label: '', url: '', display: 'link', isActive: true, sortOrder: 0, icon: '' });
  }
}
