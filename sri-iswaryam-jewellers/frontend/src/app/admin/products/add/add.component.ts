import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDataService, ProductStatus } from '../../services/admin-data.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  readonly categoryOptions = ['necklaces', 'earrings', 'bangles', 'rings', 'special'];
  readonly purityOptions = ['22K', '18K', '24K', 'PT950'];
  readonly heroImageOptions = [
    'assets/Necklace/necklace1.webp',
    'assets/Earrings/earrings4.webp',
    'assets/Bangles/bangles3.webp',
    'assets/Rings/ring9.webp',
    'assets/Special/item3.webp'
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', [Validators.required, Validators.minLength(4)]],
    category: ['necklaces', Validators.required],
    price: [25000, [Validators.required, Validators.min(1000)]],
    mrp: [30000, [Validators.required, Validators.min(1000)]],
    stock: [5, [Validators.required, Validators.min(0)]],
    purity: ['22K', Validators.required],
    weight: [12, [Validators.required, Validators.min(1)]],
    heroImage: ['assets/Necklace/necklace1.webp', Validators.required],
    gallery: ['assets/Necklace/necklace2.webp, assets/Necklace/necklace3.webp'],
    tags: ['New Arrival,Wedding'],
    featured: [true],
    status: ['active' as ProductStatus, Validators.required],
    description: ['', [Validators.required, Validators.minLength(16)]]
  });

  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly adminData: AdminDataService,
    private readonly notifications: NotificationService
  ) {}

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    try {
      const value = this.form.getRawValue();
      const { gallery, tags, ...rest } = value;
      await this.adminData.addProduct({
        ...rest,
        gallery: this.splitCsv(gallery),
        tags: this.splitCsv(tags)
      });
      this.notifications.success('Product created', `${value.name} is now live in the catalogue.`);
      await this.router.navigate(['/admin/products']);
    } finally {
      this.submitting = false;
    }
  }

  private splitCsv(value?: string | null): string[] {
    if (!value) {
      return [];
    }
    return value
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean);
  }
}
