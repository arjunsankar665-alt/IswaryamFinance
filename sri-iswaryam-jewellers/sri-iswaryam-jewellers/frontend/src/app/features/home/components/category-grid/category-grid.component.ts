import { Component } from '@angular/core';

interface Category {
  name: string;
  slug: string;
  image: string;
  count: number;
}

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css']
})
export class CategoryGridComponent {
  categories: Category[] = [
    { name: 'Necklaces', slug: 'necklaces', image: 'assets/images/categories/necklaces.jpg', count: 120 },
    { name: 'Earrings', slug: 'earrings', image: 'assets/images/categories/earrings.jpg', count: 85 },
    { name: 'Bangles', slug: 'bangles', image: 'assets/images/categories/bangles.jpg', count: 64 },
    { name: 'Rings', slug: 'rings', image: 'assets/images/categories/rings.jpg', count: 92 },
    { name: 'Chains', slug: 'chains', image: 'assets/images/categories/chains.jpg', count: 45 },
    { name: 'Pendants', slug: 'pendants', image: 'assets/images/categories/pendants.jpg', count: 58 }
  ];
}
