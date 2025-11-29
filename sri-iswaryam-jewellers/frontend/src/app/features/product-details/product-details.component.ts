import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImage } from './components/image-gallery/image-gallery.component';
import { ProductDetails } from './components/product-info/product-info.component';
import { Specification, Review } from './components/specifications-table/specifications-table.component';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  loading = true;
  product: ProductDetails | null = null;
  productImages: ProductImage[] = [];
  isWishlisted = false;
  selectedSize: string | null = null;
  
  specifications: Specification[] = [];
  reviews: Review[] = [];
  ratingDistribution: { [key: number]: number } = {};
  
  relatedProducts: { id: string; name: string; image: string; price: number }[] = [];
  private readonly subscriptions = new Subscription();
  private isAuthenticated = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        const productId = params['id'];
        this.loadProduct(productId);
      })
    );

    this.subscriptions.add(
      this.authService.isAuthenticated$.subscribe(isAuthed => {
        this.isAuthenticated = isAuthed;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadProduct(id: string): void {
    this.loading = true;
    
    // Simulate API call with mock data
    setTimeout(() => {
      this.product = {
        id: id,
        name: 'Traditional Gold Temple Necklace',
        category: { name: 'Necklaces', slug: 'necklaces' },
        price: 185000,
        originalPrice: 200000,
        discount: 7,
        rating: 4.7,
        reviewCount: 128,
        inStock: true,
        metal: 'Gold',
        purity: '22K BIS Hallmarked',
        weight: 35,
        description: 'This exquisite temple necklace showcases traditional South Indian craftsmanship with intricate Lakshmi motifs and delicate mango designs. Each piece is handcrafted by skilled artisans, ensuring uniqueness and attention to detail. The necklace features a secure clasp and comfortable fit, making it perfect for special occasions and weddings.',
        sizes: ['14 inches', '16 inches', '18 inches', '20 inches']
      };

      const galleryAssets = ['necklace1', 'necklace3', 'necklace5', 'necklace7'];
      this.productImages = galleryAssets.map((asset, index) => ({
        thumbnail: `assets/Necklace/${asset}.webp`,
        full: `assets/Necklace/${asset}.webp`,
        alt: `Gallery view ${index + 1}`
      }));

      this.specifications = [
        { label: 'Metal', value: 'Gold' },
        { label: 'Purity', value: '22K (916)' },
        { label: 'Gross Weight', value: '35.5 grams' },
        { label: 'Net Weight', value: '35 grams' },
        { label: 'Height', value: '4.5 cm' },
        { label: 'Width', value: '18 cm' },
        { label: 'Clasp Type', value: 'S-Lock with Safety' },
        { label: 'Certification', value: 'BIS Hallmarked' },
        { label: 'Collection', value: 'Temple Jewellery' },
        { label: 'Occasion', value: 'Wedding, Festival, Traditional' }
      ];

      this.reviews = [
        {
          rating: 5, title: 'Beautiful craftsmanship!',
          comment: 'Absolutely stunning piece. The detailing is incredible and it looks even better in person. Very happy with my purchase.',
          author: 'Priya M.', date: '2 weeks ago', verified: true
        },
        {
          rating: 4, title: 'Great quality, minor issue with clasp',
          comment: 'The necklace is gorgeous and true to pictures. The clasp was a bit stiff initially but loosened up after a few uses.',
          author: 'Lakshmi S.', date: '1 month ago', verified: true
        },
        {
          rating: 5, title: 'Perfect for my wedding',
          comment: 'Received so many compliments! The gold quality is excellent and the weight feels substantial.',
          author: 'Anjali R.', date: '1 month ago', verified: true
        }
      ];

      this.ratingDistribution = { 5: 85, 4: 28, 3: 10, 2: 3, 1: 2 };

      this.relatedProducts = [
        { id: '2', name: 'Antique Gold Jhumkas', image: 'assets/Earrings/earrings2.webp', price: 65000 },
        { id: '3', name: 'Temple Bangles Set', image: 'assets/Bangles/bangles4.webp', price: 145000 },
        { id: '4', name: 'Rose Gold Cocktail Ring', image: 'assets/Rings/ring6.webp', price: 52000 },
        { id: '5', name: 'Grand Polki Bridal Set', image: 'assets/Special/item5.webp', price: 345000 }
      ];

      this.loading = false;
    }, 500);
  }

  async toggleWishlist(): Promise<void> {
    if (!this.product) {
      return;
    }
    if (!this.ensureAuthenticated()) {
      return;
    }
    const nextState = !this.isWishlisted;
    try {
      if (nextState) {
        await this.wishlistService.addItem({
          productId: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.productImages[0]?.full,
          slug: this.product.category.slug,
          category: this.product.category.name,
          inStock: this.product.inStock
        });
        this.notificationService.success('Added to wishlist', `${this.product.name} is saved for later.`);
      } else {
        await this.wishlistService.remove(this.product.id);
        this.notificationService.info('Removed from wishlist', `${this.product.name} was removed.`);
      }
      this.isWishlisted = nextState;
    } catch (error) {
      this.notificationService.error('Wishlist update failed', this.extractErrorMessage(error));
    }
  }

  onSizeSelect(size: string): void {
    this.selectedSize = size;
  }

  async addToCart(quantity: number): Promise<boolean> {
    if (!this.product) {
      return false;
    }
    if (!this.ensureAuthenticated()) {
      return false;
    }
    try {
      await this.cartService.addItem({
        productId: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity,
        slug: this.product.category.slug,
        image: this.productImages[0]?.full,
        inStock: this.product.inStock,
        category: this.product.category.name
      });
      this.notificationService.success('Added to cart', `${this.product.name} x${quantity} is ready for checkout.`);
      return true;
    } catch (error) {
      this.notificationService.error('Unable to add item', this.extractErrorMessage(error));
      return false;
    }
  }

  async buyNow(quantity: number): Promise<void> {
    if (!this.product) return;
    const added = await this.addToCart(quantity);
    if (added) {
      this.router.navigate(['/checkout']);
    }
  }

  private ensureAuthenticated(): boolean {
    if (this.isAuthenticated) {
      return true;
    }
    this.notificationService.warning('Sign in required', 'Please sign in to continue.');
    this.authService.promptLogin(this.router.url);
    return false;
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      const httpError = error as { error?: { message?: string }; message?: string };
      return httpError.error?.message || httpError.message || 'Something went wrong. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
