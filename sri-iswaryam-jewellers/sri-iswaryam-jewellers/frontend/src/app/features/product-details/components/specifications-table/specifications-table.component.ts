import { Component, Input } from '@angular/core';

export interface Specification {
  label: string;
  value: string;
}

export interface Review {
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: string;
  verified: boolean;
}

@Component({
  selector: 'app-specifications-table',
  templateUrl: './specifications-table.component.html',
  styleUrls: ['./specifications-table.component.css']
})
export class SpecificationsTableComponent {
  @Input() specifications: Specification[] = [];
  @Input() description = '';
  @Input() reviews: Review[] = [];
  @Input() averageRating = 0;
  @Input() totalReviews = 0;
  @Input() ratingDistribution: { [key: number]: number } = {};

  tabs = [
    { id: 'specs', label: 'Specifications' },
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: 'Reviews' }
  ];

  activeTab = 'specs';

  getRatingPercentage(rating: number): number {
    if (this.totalReviews === 0) return 0;
    return ((this.ratingDistribution[rating] || 0) / this.totalReviews) * 100;
  }
}
