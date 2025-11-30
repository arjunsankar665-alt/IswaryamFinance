import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminDataService, AdminProduct } from '../../services/admin-data.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  product?: AdminProduct;
  submitting = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(1000)]],
    mrp: [0, [Validators.required, Validators.min(1000)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    heroImage: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(16)]]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly adminData: AdminDataService,
    private readonly notifications: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      await this.router.navigate(['/admin/products']);
      return;
    }
    const cached = this.adminData.getProductFromCache(productId);
    this.product = cached ?? (await this.adminData.fetchProduct(productId)) ?? undefined;

    if (!this.product) {
      await this.router.navigate(['/admin/products']);
      return;
    }

    this.form.patchValue({
      name: this.product.name,
      price: this.product.price,
      mrp: this.product.mrp,
      stock: this.product.stock,
      heroImage: this.product.heroImage,
      description: this.product.description
    });
  }

  async save(): Promise<void> {
    if (!this.product || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    try {
      await this.adminData.updateProduct(this.product.id, this.form.getRawValue());
      this.notifications.success('Product updated', `${this.form.value.name} refreshed successfully.`);
      await this.router.navigate(['/admin/products']);
    } finally {
      this.submitting = false;
    }
  }
}
