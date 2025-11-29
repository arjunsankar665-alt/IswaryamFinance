import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { PriceSummaryComponent } from './components/price-summary/price-summary.component';


@NgModule({
  declarations: [
    CartComponent,
    CartItemComponent,
    PriceSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CartRoutingModule
  ]
})
export class CartModule { }
