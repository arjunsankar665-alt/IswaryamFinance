import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() toggleMobileNav = new EventEmitter<void>();
  
  isSearchOpen = false;
  cartCount = 0;
  wishlistCount = 0;

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
}
