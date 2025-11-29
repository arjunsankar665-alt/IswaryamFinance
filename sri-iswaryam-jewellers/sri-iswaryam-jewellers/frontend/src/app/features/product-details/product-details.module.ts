import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { AddToCartSectionComponent } from './components/add-to-cart-section/add-to-cart-section.component';
import { SpecificationsTableComponent } from './components/specifications-table/specifications-table.component';


@NgModule({
  declarations: [
    ProductDetailsComponent,
    ImageGalleryComponent,
    ProductInfoComponent,
    AddToCartSectionComponent,
    SpecificationsTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductDetailsRoutingModule
  ]
})
export class ProductDetailsModule { }
