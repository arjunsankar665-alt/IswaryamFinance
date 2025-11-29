import { Component, OnDestroy, OnInit } from '@angular/core';

interface ShowcaseSlide {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-showcase-carousel',
  templateUrl: './showcase-carousel.component.html',
  styleUrls: ['./showcase-carousel.component.css']
})
export class ShowcaseCarouselComponent implements OnInit, OnDestroy {
  slides: ShowcaseSlide[] = [
    {
      image: 'assets/carousel/FirstImage.jpg',
      title: 'Signature Cocktail Rings',
      description: 'Artful silhouettes handset with radiant rubies crafted for evening glamour.'
    },
    {
      image: 'assets/carousel/SecondImage.png',
      title: 'Heritage Necklace Edit',
      description: 'Layered strands finished with kundan motifs inspired by palace architecture.'
    },
    {
      image: 'assets/carousel/ThirdImage.jpg',
      title: 'Everyday Bangles',
      description: 'Lightweight bangles sculpted for ultimate comfort without compromising shine.'
    },
    {
      image: 'assets/carousel/FourthImage.jpg',
      title: 'Limited Edition Highlights',
      description: 'Curated heirloom-worthy pieces captured in ultra-high resolution to spotlight craftsmanship.'
    }
  ];

  activeIndex = 0;
  private autoSlideTimer?: ReturnType<typeof setInterval>;
  private readonly autoSlideDelay = 6500;

  get activeSlide(): ShowcaseSlide {
    return this.slides[this.activeIndex];
  }

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.clearAutoSlide();
  }

  previous(): void {
    this.shiftActiveIndex(-1);
    this.restartAutoSlide();
  }

  next(): void {
    this.shiftActiveIndex(1);
    this.restartAutoSlide();
  }

  goTo(index: number): void {
    this.activeIndex = index;
    this.restartAutoSlide();
  }

  pauseAutoSlide(): void {
    this.clearAutoSlide();
  }

  resumeAutoSlide(): void {
    this.restartAutoSlide();
  }

  private startAutoSlide(): void {
    if (this.autoSlideTimer) {
      return;
    }
    this.autoSlideTimer = setInterval(() => this.shiftActiveIndex(1), this.autoSlideDelay);
  }

  private restartAutoSlide(): void {
    this.clearAutoSlide();
    this.startAutoSlide();
  }

  private clearAutoSlide(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = undefined;
    }
  }

  private shiftActiveIndex(step: number): void {
    const length = this.slides.length;
    this.activeIndex = (this.activeIndex + step + length) % length;
  }
}
