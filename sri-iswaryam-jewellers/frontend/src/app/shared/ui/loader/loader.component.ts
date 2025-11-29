import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'white' | 'gray' = 'primary';
  @Input() fullScreen = false;
  @Input() message = '';

  get sizeClasses(): string {
    const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return sizes[this.size];
  }

  get colorClasses(): string {
    const colors = { primary: 'border-yellow-600', white: 'border-white', gray: 'border-gray-400' };
    return colors[this.color];
  }
}
