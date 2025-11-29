import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { AddressSelectionComponent } from './components/address-selection/address-selection.component';
import { DeliveryOptionsComponent } from './components/delivery-options/delivery-options.component';
import { PaymentMethodsComponent } from './components/payment-methods/payment-methods.component';
import { OrderReviewComponent } from './components/order-review/order-review.component';


@NgModule({
  declarations: [
    CheckoutComponent,
    AddressSelectionComponent,
    DeliveryOptionsComponent,
    PaymentMethodsComponent,
    OrderReviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
