import { Component, Output, EventEmitter, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AccountMenuItem } from './account-dropdown/account-dropdown.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  @Output() toggleMobileNav = new EventEmitter<void>();
  
  isSearchOpen = false;
  cartCount = 0;
  wishlistCount = 0;
  showAuthModal = false;
  showAccountDropdown = false;
  user$ = this.authService.user$;
  isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;
  private subscriptions = new Subscription();

  accountItems: AccountMenuItem[] = [
    { icon: '⟳', label: 'Order History', routerLink: '/account' },
    { icon: '🎁', label: 'Gift Card Balance', routerLink: '/account' },
    { icon: '📦', label: 'Track Order', routerLink: '/account' },
    { icon: '💬', label: 'Contact Us', routerLink: '/support/contact-us' },
    { icon: '⏻', label: 'Log Out', action: 'logout' as const }
  ];

  constructor(
	private readonly authService: AuthService,
	private readonly router: Router,
	private readonly elementRef: ElementRef,
	private readonly cartService: CartService,
	private readonly wishlistService: WishlistService
  ) {
    this.subscriptions.add(
      this.cartService.itemCount$.subscribe((count) => (this.cartCount = count))
    );
    this.subscriptions.add(
      this.wishlistService.count$.subscribe((count) => (this.wishlistCount = count))
    );
  }

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Necklaces', path: '/products/necklaces' },
    { label: 'Bangles', path: '/products/bangles' },
    { label: 'Earrings', path: '/products/earrings' },
    { label: 'Rings', path: '/products/rings' },
    { label: 'Bridal', path: '/products/bridal' }
  ];

  onMenuClick(): void {
    this.toggleMobileNav.emit();
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  openAuthModal(): void {
    this.closeAccountDropdown();
    this.showAuthModal = true;
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
  }

  toggleAccountDropdown(): void {
    this.showAccountDropdown = !this.showAccountDropdown;
  }

  closeAccountDropdown(): void {
    this.showAccountDropdown = false;
  }

  onAccountButtonClick(): void {
    if (window.matchMedia('(max-width: 639px)').matches) {
      this.router.navigateByUrl('/account');
      return;
    }
    this.toggleAccountDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.showAccountDropdown) {
      return;
    }
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeAccountDropdown();
    }
  }

  async onAccountSelect(item: AccountMenuItem): Promise<void> {
    if (item.action === 'logout') {
      await this.authService.logout();
      this.closeAccountDropdown();
      return;
    }

    if (item.action === 'contact') {
      await this.router.navigateByUrl('/support/contact-us');
      this.closeAccountDropdown();
      return;
    }

    if (item.routerLink) {
      await this.router.navigateByUrl(item.routerLink);
      this.closeAccountDropdown();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
