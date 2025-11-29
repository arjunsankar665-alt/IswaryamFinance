import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: Date;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number }; // 1-5 star counts
}

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.css']
})
export class ProductReviewsComponent {
  @Input() reviews: Review[] = [];
  @Input() summary: ReviewSummary = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
  @Input() canAddReview = true;
  @Input() isLoading = false;

  @Output() addReview = new EventEmitter<void>();
  @Output() markHelpful = new EventEmitter<string>();
  @Output() reportReview = new EventEmitter<string>();
  @Output() filterByRating = new EventEmitter<number | null>();
  @Output() loadMore = new EventEmitter<void>();

  selectedFilter: number | null = null;
  sortBy: 'recent' | 'helpful' | 'rating-high' | 'rating-low' = 'recent';

  getStars(rating: number | string | null | undefined): number[] {
    const numericRating = typeof rating === 'string'
      ? parseFloat(rating)
      : rating ?? 0;
    const roundedRating = Math.max(0, Math.min(5, Math.round(numericRating)));
    return Array(5)
      .fill(0)
      .map((_, i) => (i < roundedRating ? 1 : 0));
  }

  getRatingPercentage(stars: number): number {
    if (this.summary.totalReviews === 0) return 0;
    return (this.summary.ratingDistribution[stars] / this.summary.totalReviews) * 100;
  }

  onFilterByRating(rating: number | null): void {
    this.selectedFilter = rating;
    this.filterByRating.emit(rating);
  }

  onMarkHelpful(reviewId: string): void {
    this.markHelpful.emit(reviewId);
  }

  onReportReview(reviewId: string): void {
    this.reportReview.emit(reviewId);
  }

  onAddReview(): void {
    this.addReview.emit();
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}
