import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProductImage {
  thumbnail: string;
  full: string;
  alt: string;
}

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent {
  @Input() images: ProductImage[] = [];
  @Input() isWishlisted = false;
  @Output() wishlistToggle = new EventEmitter<void>();

  selectedIndex = 0;
  isZoomed = false;
  zoomOrigin = '50% 50%';

  selectImage(index: number): void {
    this.selectedIndex = index;
    this.isZoomed = false;
  }

  prevImage(): void {
    this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : this.images.length - 1;
    this.isZoomed = false;
  }

  nextImage(): void {
    this.selectedIndex = this.selectedIndex < this.images.length - 1 ? this.selectedIndex + 1 : 0;
    this.isZoomed = false;
  }

  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isZoomed) return;
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomOrigin = `${x}% ${y}%`;
  }

  onMouseLeave(): void {
    this.isZoomed = false;
    this.zoomOrigin = '50% 50%';
  }

  toggleWishlist(): void {
    this.wishlistToggle.emit();
  }
}
