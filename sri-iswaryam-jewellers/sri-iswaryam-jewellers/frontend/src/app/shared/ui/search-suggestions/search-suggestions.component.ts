import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SearchSuggestion {
  id: string;
  type: 'product' | 'category' | 'recent' | 'trending';
  text: string;
  image?: string;
  price?: number;
  category?: string;
}

@Component({
  selector: 'app-search-suggestions',
  templateUrl: './search-suggestions.component.html',
  styleUrls: ['./search-suggestions.component.css']
})
export class SearchSuggestionsComponent {
  @Input() query = '';
  @Input() suggestions: SearchSuggestion[] = [];
  @Input() recentSearches: string[] = [];
  @Input() trendingSearches: string[] = [];
  @Input() isLoading = false;
  @Input() isVisible = false;
  
  @Output() selectSuggestion = new EventEmitter<SearchSuggestion>();
  @Output() selectRecent = new EventEmitter<string>();
  @Output() selectTrending = new EventEmitter<string>();
  @Output() clearRecent = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onSuggestionClick(suggestion: SearchSuggestion): void {
    this.selectSuggestion.emit(suggestion);
  }

  onRecentClick(term: string): void {
    this.selectRecent.emit(term);
  }

  onTrendingClick(term: string): void {
    this.selectTrending.emit(term);
  }

  onClearRecent(): void {
    this.clearRecent.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  highlightMatch(text: string): string {
    if (!this.query) return text;
    const regex = new RegExp(`(${this.query})`, 'gi');
    return text.replace(regex, '<strong class="text-yellow-600">$1</strong>');
  }
}
