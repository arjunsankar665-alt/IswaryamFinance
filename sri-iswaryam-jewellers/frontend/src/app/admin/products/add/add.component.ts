import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminCategory, AdminDataService, ProductStatus } from '../../services/admin-data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnDestroy {
  readonly categories$ = this.adminData.categories$;
  readonly purityOptions = ['22K', '18K', '24K', 'PT950'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sku: ['', [Validators.required, Validators.minLength(4)]],
    category: ['necklaces', Validators.required],
    price: [25000, [Validators.required, Validators.min(1000)]],
    mrp: [30000, [Validators.required, Validators.min(1000)]],
    stock: [5, [Validators.required, Validators.min(0)]],
    purity: ['22K', Validators.required],
    weight: [12, [Validators.required, Validators.min(1)]],
    heroImage: ['', Validators.required],
    gallery: [''],
    tags: [''],
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
    ) {
      this.subscriptions.add(
        this.categories$.subscribe((categories: AdminCategory[]) => {
          if (!categories.length) {
            return;
          }
          const current = this.form.get('category')?.value;
          if (!current || current === 'necklaces') {
            this.form.patchValue({ category: categories[0].slug }, { emitEvent: false });
          }
        })
      );
    }

    private readonly subscriptions = new Subscription();
    uploadingHero = false;
    uploadingGallery = false;

  get previewTags(): string[] {
    return this.splitCsv(this.form.value.tags);
  }

  get galleryImages(): string[] {
    return this.splitCsv(this.form.value.gallery);
  }

  get heroImageName(): string {
    return this.readableName(this.form.value.heroImage);
  }

  displayName(path?: string | null): string {
    return this.readableName(path);
  }

  async onHeroImageSelected(event: Event): Promise<void> {
    const file = this.extractFirstFile(event);
    if (!file) {
      return;
    }
    this.uploadingHero = true;
    try {
      const asset = await this.adminData.uploadImage(file, this.getSelectedCategory());
      this.form.patchValue({ heroImage: asset.url });
      this.notifications.success('Hero uploaded', 'Preview updated with the new image.');
    } catch (error) {
      console.error(error);
      this.notifications.error('Upload failed', 'Could not upload hero image.');
    } finally {
      this.uploadingHero = false;
      this.resetInput(event.target as HTMLInputElement);
    }
  }

  clearHeroImage(): void {
    this.form.patchValue({ heroImage: '' });
  }

  async onGallerySelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      return;
    }
    this.uploadingGallery = true;
    try {
      const uploads = [] as string[];
      for (const file of Array.from(input.files)) {
        const asset = await this.adminData.uploadImage(file, this.getSelectedCategory());
        uploads.push(asset.url);
      }
      const merged = [...this.splitCsv(this.form.value.gallery), ...uploads];
      this.form.patchValue({ gallery: merged.join(', ') });
      this.notifications.success('Gallery updated', `${uploads.length} image(s) added.`);
    } catch (error) {
      console.error(error);
      this.notifications.error('Upload failed', 'Could not upload gallery images.');
    } finally {
      this.uploadingGallery = false;
      this.resetInput(input);
    }
  }

  removeGalleryImage(image: string): void {
    const filtered = this.galleryImages.filter(item => item !== image);
    this.form.patchValue({ gallery: filtered.join(', ') });
  }

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

  private extractFirstFile(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) {
      return null;
    }
    return input.files[0];
  }

  private getSelectedCategory(): string {
    return this.form.get('category')?.value || 'general';
  }

  private resetInput(input?: HTMLInputElement | null): void {
    if (input) {
      input.value = '';
    }
  }

  private readableName(path?: string | null): string {
    if (!path) {
      return '';
    }
    const segments = path.split('/');
    return segments[segments.length - 1] || path;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
