import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { OrdersComponent } from '../../pages/account/orders/orders.component';
import { ProfileComponent } from '../../pages/account/profile/profile.component';
import { SettingsComponent } from '../../pages/account/settings/settings.component';
import { OrderTrackingComponent } from '../../pages/account/order-tracking/order-tracking.component';

@NgModule({
  declarations: [
    AccountComponent,
    OrdersComponent,
    ProfileComponent,
    SettingsComponent,
    OrderTrackingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
