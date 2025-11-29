import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent {
  @Input() type: 'text' | 'circle' | 'rectangle' | 'card' | 'product' = 'text';
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() count = 1;
  @Input() animated = true;

  get items(): number[] {
    return Array(this.count).fill(0);
  }
}
