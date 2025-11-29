import { Component, EventEmitter, Output } from '@angular/core';

interface SortOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  styleUrls: ['./sort-dropdown.component.css']
})
export class SortDropdownComponent {
  @Output() sortChanged = new EventEmitter<string>();

  isOpen = false;

  sortOptions: SortOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Popularity', value: 'popularity' },
    { label: 'Rating', value: 'rating' },
    { label: 'Weight: Low to High', value: 'weight_asc' },
    { label: 'Weight: High to Low', value: 'weight_desc' }
  ];

  selectedOption: SortOption = this.sortOptions[0];

  selectOption(option: SortOption): void {
    this.selectedOption = option;
    this.isOpen = false;
    this.sortChanged.emit(option.value);
  }
}
