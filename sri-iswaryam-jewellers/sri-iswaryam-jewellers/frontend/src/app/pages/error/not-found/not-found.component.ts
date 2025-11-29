import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  searchQuery = '';
  suggestedLinks = [
    { label: 'Gold Jewellery', url: '/products/gold', icon: 'sparkles' },
    { label: 'Diamond Collection', url: '/products/diamond', icon: 'gem' },
    { label: 'New Arrivals', url: '/products/new-arrivals', icon: 'star' },
    { label: 'Offers', url: '/offers', icon: 'tag' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  goBack(): void {
    window.history.back();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
    }
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }
}
