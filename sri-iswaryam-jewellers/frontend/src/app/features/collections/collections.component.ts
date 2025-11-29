import { Component } from '@angular/core';

interface CollectionCategory {
  name: string;
  description: string;
  image: string;
  slug: string;
  pieces: number;
  accent: string;
}

interface SpotlightSet {
  title: string;
  summary: string;
  image: string;
  tags: string[];
}

interface ServiceHighlight {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent {
  readonly heroStats = [
    { label: 'Heritage Designs', value: '350+' },
    { label: 'Artisans', value: '120' },
    { label: 'Cities Served', value: '40' }
  ];

  readonly categories: CollectionCategory[] = [
    {
      name: 'Necklaces',
      description: 'Temple inspired collars, harams and daily layers.',
      image: 'assets/Necklace/necklace2.webp',
      slug: 'necklaces',
      pieces: 45,
      accent: '#fbbf24'
    },
    {
      name: 'Earrings',
      description: 'Statement studs, chandbalis and kundan dazzlers.',
      image: 'assets/Earrings/earrings3.webp',
      slug: 'earrings',
      pieces: 78,
      accent: '#fb7185'
    },
    {
      name: 'Bangles',
      description: 'Stackable kada sets and ornate bridal pairs.',
      image: 'assets/Bangles/bangles3.webp',
      slug: 'bangles',
      pieces: 56,
      accent: '#c084fc'
    },
    {
      name: 'Rings',
      description: 'Solitaire statements and daily essentials.',
      image: 'assets/Rings/ring2.webp',
      slug: 'rings',
      pieces: 92,
      accent: '#38bdf8'
    },
    {
      name: 'Pendants',
      description: 'Minimal charms with gemstone pops.',
      image: 'assets/Necklace/necklace7.webp',
      slug: 'pendants',
      pieces: 34,
      accent: '#34d399'
    },
    {
      name: 'Bridal Sets',
      description: 'Grand ensembles curated for pheras & muhurtham.',
      image: 'assets/Special/item4.webp',
      slug: 'bridal',
      pieces: 24,
      accent: '#f97316'
    }
  ];

  readonly spotlightSets: SpotlightSet[] = [
    {
      title: 'The Temple Muse Capsule',
      summary: 'Hand-carved Lakshmi motifs with antique gold accents for heirloom weddings.',
      image: 'assets/Special/item6.webp',
      tags: ['Limited', 'BIS 916', 'Made to order']
    },
    {
      title: 'Urban Diamond Edit',
      summary: 'Lightweight diamond jewellery for boardrooms to brunch.',
      image: 'assets/Earrings/earrings6.webp',
      tags: ['18K', 'VVS diamonds', 'Ready to ship']
    }
  ];

  readonly services: ServiceHighlight[] = [
    { title: 'Virtual Try-ons', description: 'Experience collections over a secure concierge video session.', icon: '🖥️' },
    { title: 'Custom Atelier', description: 'Co-create bespoke pieces with sketches delivered in 48 hours.', icon: '🖋️' },
    { title: 'Lifetime Care', description: 'Free polishing and resizing for all online purchases.', icon: '💎' }
  ];

  trackByCategory(_: number, item: CollectionCategory): string {
    return item.slug;
  }

  trackBySpotlight(_: number, item: SpotlightSet): string {
    return item.title;
  }

  trackByService(_: number, item: ServiceHighlight): string {
    return item.title;
  }

}
