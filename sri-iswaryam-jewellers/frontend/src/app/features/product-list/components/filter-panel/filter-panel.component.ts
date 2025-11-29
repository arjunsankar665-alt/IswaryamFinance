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

type FilterKey = 'category' | 'metal' | 'weight';

export interface FilterChangeEvent {
  type: FilterKey | 'price' | 'inStock' | 'clear';
  values?: string[];
  value?: string | boolean;
  min?: number | null;
  max?: number | null;
}

interface ActiveFilterTag {
  type: FilterKey | 'price' | 'inStock';
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css']
})
export class FilterPanelComponent {
  @Output() filterChanged = new EventEmitter<FilterChangeEvent>();
  private static nextId = 0;
  readonly weightGroupName = `weight-${FilterPanelComponent.nextId++}`;
  private readonly numberFormatter = new Intl.NumberFormat('en-IN');

  categories: Category[] = [
    { id: 'necklaces', name: 'Necklaces', count: 10 },
    { id: 'earrings', name: 'Earrings', count: 11 },
    { id: 'bangles', name: 'Bangles', count: 10 },
    { id: 'rings', name: 'Rings', count: 15 },
    { id: 'special', name: 'Special Editions', count: 8 }
  ];

  metalTypes: string[] = ['Gold', 'Silver', 'Platinum', 'Rose Gold', 'Polki'];

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

  selectedFilters: Record<FilterKey, string[]> = {
    category: [],
    metal: [],
    weight: []
  };

  get hasActiveFilters(): boolean {
    return (
      this.selectedFilters.category.length > 0 ||
      this.selectedFilters.metal.length > 0 ||
      this.selectedFilters.weight.length > 0 ||
      this.priceMin !== null ||
      this.priceMax !== null ||
      this.inStockOnly
    );
  }

  get activeFilterTags(): ActiveFilterTag[] {
    const tags: ActiveFilterTag[] = [];

    this.selectedFilters.category.forEach(id => {
      const category = this.categories.find(cat => cat.id === id);
      if (category) {
        tags.push({ type: 'category', value: id, label: category.name });
      }
    });

    this.selectedFilters.metal.forEach(metal => {
      tags.push({ type: 'metal', value: metal, label: metal });
    });

    if (this.selectedFilters.weight[0]) {
      const weight = this.weightRanges.find(range => range.value === this.selectedFilters.weight[0]);
      if (weight) {
        tags.push({ type: 'weight', value: weight.value, label: weight.label });
      }
    }

    if (this.priceMin !== null || this.priceMax !== null) {
      const min = this.priceMin ? `₹${this.formatNumber(this.priceMin)}` : 'Any';
      const max = this.priceMax ? `₹${this.formatNumber(this.priceMax)}` : 'Any';
      tags.push({ type: 'price', value: 'price', label: `${min} - ${max}` });
    }

    if (this.inStockOnly) {
      tags.push({ type: 'inStock', value: 'inStock', label: 'In Stock Only' });
    }

    return tags;
  }

  onFilterChange(filterType: FilterKey, value: string): void {
    const currentList = this.selectedFilters[filterType];
    const index = currentList.indexOf(value);

    if (filterType === 'weight') {
      this.selectedFilters.weight = currentList[0] === value ? [] : [value];
    } else if (index > -1) {
      currentList.splice(index, 1);
    } else {
      currentList.push(value);
    }

    this.filterChanged.emit({ type: filterType, values: [...this.selectedFilters[filterType]] });
  }

  onStockToggle(): void {
    this.filterChanged.emit({ type: 'inStock', value: this.inStockOnly });
  }

  applyPriceFilter(): void {
    if (this.priceMin !== null && this.priceMax !== null && this.priceMin > this.priceMax) {
      const temp = this.priceMin;
      this.priceMin = this.priceMax;
      this.priceMax = temp;
    }
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

  removeFilterTag(tag: ActiveFilterTag): void {
    if (tag.type === 'price') {
      this.priceMin = null;
      this.priceMax = null;
      this.applyPriceFilter();
      return;
    }

    if (tag.type === 'inStock') {
      this.inStockOnly = false;
      this.onStockToggle();
      return;
    }

    this.onFilterChange(tag.type, tag.value);
  }

  isSelected(filterType: FilterKey, value: string): boolean {
    return this.selectedFilters[filterType].includes(value);
  }

  private formatNumber(value: number): string {
    return this.numberFormatter.format(value);
  }
}
