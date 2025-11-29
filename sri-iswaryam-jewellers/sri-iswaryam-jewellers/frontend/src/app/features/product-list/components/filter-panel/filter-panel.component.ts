import { Component, EventEmitter, Output } from '@angular/core';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface WeightRange {
  label: string;
  value: string;
}

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Output() filterChanged = new EventEmitter<any>();

  categories: Category[] = [
    { id: 'necklaces', name: 'Necklaces', count: 45 },
    { id: 'earrings', name: 'Earrings', count: 78 },
    { id: 'bangles', name: 'Bangles', count: 56 },
    { id: 'rings', name: 'Rings', count: 92 },
    { id: 'chains', name: 'Chains', count: 34 },
    { id: 'pendants', name: 'Pendants', count: 41 }
  ];

  metalTypes: string[] = ['Gold', 'Silver', 'Platinum', 'Rose Gold'];

  weightRanges: WeightRange[] = [
    { label: '0-5g', value: '0-5' },
    { label: '5-10g', value: '5-10' },
    { label: '10-20g', value: '10-20' },
    { label: '20-50g', value: '20-50' },
    { label: '50g+', value: '50+' }
  ];

  priceMin: number | null = null;
  priceMax: number | null = null;
  inStockOnly = false;

  selectedFilters: { [key: string]: any[] } = {
    category: [],
    metal: [],
    weight: []
  };

  onFilterChange(filterType: string, value: any): void {
    if (filterType === 'inStock') {
      this.filterChanged.emit({ type: filterType, value: this.inStockOnly });
      return;
    }

    const index = this.selectedFilters[filterType]?.indexOf(value);
    if (index > -1) {
      this.selectedFilters[filterType].splice(index, 1);
    } else {
      if (filterType === 'weight') {
        this.selectedFilters[filterType] = [value];
      } else {
        this.selectedFilters[filterType].push(value);
      }
    }
    this.filterChanged.emit({ type: filterType, values: this.selectedFilters[filterType] });
  }

  applyPriceFilter(): void {
    this.filterChanged.emit({
      type: 'price',
      min: this.priceMin,
      max: this.priceMax
    });
  }

  clearAllFilters(): void {
    this.selectedFilters = { category: [], metal: [], weight: [] };
    this.priceMin = null;
    this.priceMax = null;
    this.inStockOnly = false;
    this.filterChanged.emit({ type: 'clear' });
  }
}
