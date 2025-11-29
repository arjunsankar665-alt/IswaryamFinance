import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private siteName = 'Sri Iswaryam Jewellers';
  private defaultDescription = 'Premium gold and diamond jewellery store. BIS Hallmarked gold, certified diamonds, lifetime exchange policy.';

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateSeo(config: SeoConfig): void {
    const pageTitle = config.title 
      ? `${config.title} | ${this.siteName}` 
      : this.siteName;
    
    this.title.setTitle(pageTitle);
    
    // Basic meta tags
    this.updateMetaTag('description', config.description || this.defaultDescription);
    if (config.keywords) {
      this.updateMetaTag('keywords', config.keywords);
    }

    // Open Graph tags
    this.updateMetaTag('og:title', pageTitle, 'property');
    this.updateMetaTag('og:description', config.description || this.defaultDescription, 'property');
    this.updateMetaTag('og:type', config.type || 'website', 'property');
    if (config.url) {
      this.updateMetaTag('og:url', config.url, 'property');
    }
    if (config.image) {
      this.updateMetaTag('og:image', config.image, 'property');
    }

    // Twitter Card tags
    this.updateMetaTag('twitter:card', 'summary_large_image');
    this.updateMetaTag('twitter:title', pageTitle);
    this.updateMetaTag('twitter:description', config.description || this.defaultDescription);
    if (config.image) {
      this.updateMetaTag('twitter:image', config.image);
    }
  }

  updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  addStructuredData(data: object): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  addProductStructuredData(product: any): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images?.[0]?.full,
      description: product.description,
      brand: { '@type': 'Brand', name: 'Sri Iswaryam Jewellers' },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'INR',
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      } : undefined
    };
    this.addStructuredData(structuredData);
  }

  private updateMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
    const selector = attr === 'property' ? `property="${name}"` : `name="${name}"`;
    this.meta.updateTag({ [attr]: name, content }, selector);
  }
}
