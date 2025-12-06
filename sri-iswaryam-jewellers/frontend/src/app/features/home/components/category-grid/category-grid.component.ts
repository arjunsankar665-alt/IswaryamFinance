import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService, StorefrontCategory } from '../../../../core/services/category.service';

interface CategoryCard {
  name: string;
  slug: string;
  count: number;
  gallery: string[];
  accent: string;
  tagline: string;
  description?: string;
}

@Component({
  selector: 'app-category-grid',
  templateUrl: './category-grid.component.html',
  styleUrls: ['./category-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryGridComponent implements OnInit, OnDestroy {
  categories: CategoryCard[] = [];
  private readonly meta: Record<string, Pick<CategoryCard, 'accent' | 'tagline'>> = {
    necklaces: { accent: 'from-amber-400/80 via-rose-300/60 to-emerald-200/80', tagline: 'Temple to contemporary sets' },
    earrings: { accent: 'from-violet-400/80 via-indigo-300/70 to-sky-200/80', tagline: 'Studs, chandeliers & jhumkas' },
    bangles: { accent: 'from-orange-400/85 via-amber-300/70 to-yellow-200/85', tagline: 'Heritage cuffs & daily stacks' },
    rings: { accent: 'from-emerald-500/80 via-teal-300/70 to-cyan-200/80', tagline: 'Solitaire, cocktail & mangalsutra rings' },
    special: { accent: 'from-slate-900/85 via-slate-700/70 to-slate-500/70', tagline: 'Limited-edition bridal heirlooms' },
    bridal: { accent: 'from-rose-500/85 via-pink-300/70 to-amber-200/85', tagline: 'Curated looks for the pheras' }
  };
  private readonly galleryLookup: Record<string, { folder: string; prefix: string; count: number }> = {
    necklaces: { folder: 'Necklace', prefix: 'necklace', count: 10 },
    earrings: { folder: 'Earrings', prefix: 'earrings', count: 11 },
    bangles: { folder: 'Bangles', prefix: 'bangles', count: 10 },
    rings: { folder: 'Rings', prefix: 'ring', count: 15 },
    special: { folder: 'Special', prefix: 'item', count: 8 },
    bridal: { folder: 'Necklace', prefix: 'necklace', count: 6 }
  };

  private readonly frameMap = new Map<string, number>();
  private rotationHandle?: ReturnType<typeof setInterval>;
  private readonly rotationSpeed = 2600;
  private subscriptions = new Subscription();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.categoryService.categories$.subscribe((incoming) => {
        const mapped = incoming.map((category) => this.toCard(category));
        this.categories = mapped;
        mapped.forEach(category => {
          if (!this.frameMap.has(category.slug)) {
            this.frameMap.set(category.slug, 0);
          }
        });
        this.cdr.markForCheck();
      })
    );

    // Kick off load
    this.categoryService.preload().catch(() => undefined);

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
    this.subscriptions.unsubscribe();
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

  private toCard(category: StorefrontCategory): CategoryCard {
    const meta = this.meta[category.slug] || this.meta[category.slug.toLowerCase()] || {
      accent: 'from-slate-800/85 via-slate-600/70 to-slate-400/70',
      tagline: category.description || 'Discover handcrafted fine jewellery'
    };

    const gallery = category.heroImage
      ? [category.heroImage]
      : this.buildGallery(category.slug);

    const existingCount = this.frameMap.get(category.slug);
    if (existingCount === undefined) {
      this.frameMap.set(category.slug, 0);
    }

    return {
      name: category.name,
      slug: category.slug,
      count: (category as any).count ?? gallery.length,
      gallery,
      accent: meta.accent,
      tagline: meta.tagline,
      description: category.description
    };
  }

  private buildGallery(slug: string): string[] {
    const fallback = this.galleryLookup[slug] || { folder: 'Special', prefix: 'item', count: 8 };
    const count = Math.max(fallback.count, 4);
    return Array.from({ length: count }, (_, index) => `assets/${fallback.folder}/${fallback.prefix}${(index % fallback.count) + 1}.webp`);
  }
}
