import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthUser } from '../../../../core/services/auth.service';

export interface AccountMenuItem {
  icon: string;
  label: string;
  description?: string;
  routerLink?: string;
  action?: 'contact' | 'logout';
}

@Component({
  selector: 'app-account-dropdown',
  templateUrl: './account-dropdown.component.html',
  styleUrls: ['./account-dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDropdownComponent {
  @Input() user: AuthUser | null = null;
  @Input() items: AccountMenuItem[] = [];
  @Input() open = false;
  @Output() select = new EventEmitter<AccountMenuItem>();

  trackByLabel(_: number, item: AccountMenuItem): string {
    return item.label;
  }

  onSelect(item: AccountMenuItem): void {
    this.select.emit(item);
  }
}
