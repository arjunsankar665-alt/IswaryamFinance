import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { OrdersComponent } from '../../pages/account/orders/orders.component';
import { OrderTrackingComponent } from '../../pages/account/order-tracking/order-tracking.component';
import { ProfileComponent } from '../../pages/account/profile/profile.component';
import { SettingsComponent } from '../../pages/account/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrdersComponent },
      { path: 'order-tracking', component: OrderTrackingComponent },
      { path: 'order-tracking/:orderId', component: OrderTrackingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
