import { Component, Output, EventEmitter, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AccountMenuItem } from './account-dropdown/account-dropdown.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CategoryService, StorefrontCategory } from '../../../core/services/category.service';
import { MenuService, StorefrontMenu } from '../../../core/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() toggleMobileNav = new EventEmitter<void>();
  
  isSearchOpen = false;
  cartCount = 0;
  wishlistCount = 0;
  showAuthModal = false;
  showAccountDropdown = false;
  user$ = this.authService.user$;
  isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;
  private subscriptions = new Subscription();
  readonly menus$ = this.menuService.menus$;
  readonly categories$ = this.categoryService.categories$;
  collectionsMenuOpen = false;

  accountItems: AccountMenuItem[] = [
    { icon: '📦', label: 'Orders & Returns', description: 'History, invoices, reorders', routerLink: '/account/orders' },
    { icon: '🎯', label: 'Track Order', description: 'Live courier updates', routerLink: '/account/order-tracking' },
    { icon: '❤️', label: 'Wishlist', description: 'Saved favourites', routerLink: '/wishlist' },
    { icon: '👤', label: 'Profile & Settings', description: 'Details and alerts', routerLink: '/account/profile' },
    { icon: '💬', label: 'Customer Support', routerLink: '/support/contact-us' },
    { icon: '⏻', label: 'Log Out', action: 'logout' as const }
  ];

  constructor(
	private readonly authService: AuthService,
	private readonly router: Router,
	private readonly elementRef: ElementRef,
	private readonly cartService: CartService,
  private readonly wishlistService: WishlistService,
  private readonly categoryService: CategoryService,
  private readonly menuService: MenuService
  ) {
    this.subscriptions.add(
      this.cartService.itemCount$.subscribe((count) => (this.cartCount = count))
    );
    this.subscriptions.add(
      this.wishlistService.count$.subscribe((count) => (this.wishlistCount = count))
    );
    this.subscriptions.add(
      this.authService.loginPrompt$.subscribe(() => {
        this.showAuthModal = true;
        this.closeAccountDropdown();
      })
    );
  }

  navFallback: StorefrontMenu[] = [
    { id: 'home', label: 'Home', slug: 'home', url: '/', display: 'link' },
    { id: 'collections', label: 'Collections', slug: 'collections', url: '/collections', display: 'categories' },
    { id: 'necklaces', label: 'Necklaces', slug: 'necklaces', url: '/products/necklaces', display: 'link' },
    { id: 'bangles', label: 'Bangles', slug: 'bangles', url: '/products/bangles', display: 'link' },
    { id: 'earrings', label: 'Earrings', slug: 'earrings', url: '/products/earrings', display: 'link' },
    { id: 'rings', label: 'Rings', slug: 'rings', url: '/products/rings', display: 'link' },
    { id: 'bridal', label: 'Bridal', slug: 'bridal', url: '/products/bridal', display: 'link' }
  ];

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.categoryService.preload().catch(() => undefined),
      this.menuService.preload().catch(() => undefined)
    ]);
  }

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

  openCollections(): void {
    this.collectionsMenuOpen = true;
  }

  closeCollections(): void {
    this.collectionsMenuOpen = false;
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
