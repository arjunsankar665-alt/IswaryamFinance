import { Component, Input } from '@angular/core';

export type SkeletonType = 'text' | 'circle' | 'rect' | 'card' | 'product' | 'avatar' | 'button';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'rect';
  @Input() width = '100%';
  @Input() height = '20px';
  @Input() count = 1;
  @Input() animated = true;

  get skeletonItems(): number[] {
    return Array(this.count).fill(0).map((_, i) => i);
  }

  getStyles(): { [key: string]: string } {
    if (this.type === 'circle' || this.type === 'avatar') {
      return {
        width: this.width,
        height: this.width,
        'border-radius': '50%'
      };
    }
    return {
      width: this.width,
      height: this.height
    };
  }
}
