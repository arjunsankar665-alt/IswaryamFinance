import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

interface CategoryCard {
  name: string;
  slug: string;
  count: number;
  gallery: string[];
  accent: string;
  tagline: string;
}

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryGridComponent implements OnInit, OnDestroy {
  readonly categories: CategoryCard[] = [
    {
      name: 'Necklaces',
      slug: 'necklaces',
      count: 10,
      gallery: this.buildGallery('Necklace', 'necklace', 10),
      accent: 'from-pink-500/80 to-yellow-400/80',
      tagline: 'Temple to contemporary sets'
    },
    {
      name: 'Earrings',
      slug: 'earrings',
      count: 11,
      gallery: this.buildGallery('Earrings', 'earrings', 11),
      accent: 'from-purple-500/80 to-rose-400/80',
      tagline: 'Studs, chandeliers & jhumkas'
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      count: 10,
      gallery: this.buildGallery('Bangles', 'bangles', 10),
      accent: 'from-amber-500/80 to-red-400/80',
      tagline: 'Heritage cuffs & daily stacks'
    },
    {
      name: 'Rings',
      slug: 'rings',
      count: 15,
      gallery: this.buildGallery('Rings', 'ring', 15),
      accent: 'from-emerald-500/80 to-cyan-400/80',
      tagline: 'Solitaire, cocktail & mangalsutra rings'
    },
    {
      name: 'Special Editions',
      slug: 'special',
      count: 8,
      gallery: this.buildGallery('Special', 'item', 8),
      accent: 'from-slate-900/80 to-slate-600/80',
      tagline: 'Limited-edition bridal heirlooms'
    },
    {
      name: 'Bridal Suites',
      slug: 'bridal',
      count: 6,
      gallery: this.buildGallery('Necklace', 'necklace', 6).map((src, idx) =>
        idx % 2 === 0 ? src : `assets/Special/item${(idx % 8) + 1}.webp`
      ),
      accent: 'from-red-600/80 to-fuchsia-500/80',
      tagline: 'Curated looks for the pheras'
    }
  ];

  private readonly frameMap = new Map<string, number>();
  private rotationHandle?: ReturnType<typeof setInterval>;
  private readonly rotationSpeed = 2600;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.categories.forEach(category => this.frameMap.set(category.slug, 0));
    this.rotationHandle = setInterval(() => {
      this.categories.forEach(category => {
        const gallery = category.gallery;
        if (!gallery.length) {
          return;
        }
        const current = this.frameMap.get(category.slug) ?? 0;
        this.frameMap.set(category.slug, (current + 1) % gallery.length);
      });
      this.cdr.markForCheck();
    }, this.rotationSpeed);
  }

  ngOnDestroy(): void {
    if (this.rotationHandle) {
      clearInterval(this.rotationHandle);
    }
  }

  trackBySlug(_: number, category: CategoryCard): string {
    return category.slug;
  }

  activeImage(category: CategoryCard): string {
    const gallery = category.gallery;
    if (!gallery.length) {
      return '';
    }
    const frame = this.frameMap.get(category.slug) ?? 0;
    return gallery[frame % gallery.length];
  }

  private buildGallery(folder: string, prefix: string, count: number): string[] {
    return Array.from({ length: count }, (_, index) => `assets/${folder}/${prefix}${index + 1}.webp`);
  }
}
