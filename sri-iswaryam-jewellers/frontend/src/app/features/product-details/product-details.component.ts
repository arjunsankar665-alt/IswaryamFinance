import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImage } from './components/image-gallery/image-gallery.component';
import { ProductDetails } from './components/product-info/product-info.component';
import { Specification, Review } from './components/specifications-table/specifications-table.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  loading = true;
  product: ProductDetails | null = null;
  productImages: ProductImage[] = [];
  isWishlisted = false;
  selectedSize: string | null = null;
  
  specifications: Specification[] = [];
  reviews: Review[] = [];
  ratingDistribution: { [key: number]: number } = {};
  
  relatedProducts: { id: string; name: string; image: string; price: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
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

      this.productImages = [
        { thumbnail: 'assets/images/products/necklace-1-thumb.jpg', full: 'assets/images/products/necklace-1.jpg', alt: 'Front view' },
        { thumbnail: 'assets/images/products/necklace-1-side-thumb.jpg', full: 'assets/images/products/necklace-1-side.jpg', alt: 'Side view' },
        { thumbnail: 'assets/images/products/necklace-1-detail-thumb.jpg', full: 'assets/images/products/necklace-1-detail.jpg', alt: 'Detail view' },
        { thumbnail: 'assets/images/products/necklace-1-back-thumb.jpg', full: 'assets/images/products/necklace-1-back.jpg', alt: 'Back view' }
      ];

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
        { id: '2', name: 'Antique Gold Jhumkas', image: 'assets/images/products/earring-1.jpg', price: 45000 },
        { id: '3', name: 'Temple Bangles Set', image: 'assets/images/products/bangle-1.jpg', price: 125000 },
        { id: '4', name: 'Gold Chain Necklace', image: 'assets/images/products/chain-1.jpg', price: 65000 },
        { id: '5', name: 'Lakshmi Pendant', image: 'assets/images/products/pendant-1.jpg', price: 28000 }
      ];

      this.loading = false;
    }, 500);
  }

  toggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
    // Call wishlist service
  }

  onSizeSelect(size: string): void {
    this.selectedSize = size;
  }

  addToCart(quantity: number): void {
    if (!this.product) return;
    console.log(`Adding ${quantity} of ${this.product.name} to cart`);
    // Call cart service
  }

  buyNow(quantity: number): void {
    if (!this.product) return;
    this.addToCart(quantity);
    this.router.navigate(['/checkout']);
  }
}
