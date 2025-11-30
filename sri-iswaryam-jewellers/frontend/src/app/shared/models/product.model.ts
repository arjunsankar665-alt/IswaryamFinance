export interface ProductImage {
  thumb: string;
  full: string;
  alt?: string;
}

export interface StorefrontProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  gallery?: ProductImage[];
  category: string;
  categorySlug?: string;
  metal?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  weight: number;
  purity: string;
  rating?: number;
  reviews?: number;
  inStock: boolean;
  isNew?: boolean;
  isWishlisted?: boolean;
}
