import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ReportsComponent } from './reports/reports.component';
import { AddComponent } from './products/add/add.component';
import { EditComponent } from './products/edit/edit.component';
import { BannersComponent } from './marketing/banners/banners.component';
import { CouponsComponent } from './marketing/coupons/coupons.component';
import { MenuManagerComponent } from './navigation/menu-manager/menu-manager.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    InventoryComponent,
    ReportsComponent,
    AddComponent,
    EditComponent,
    BannersComponent,
    CouponsComponent,
    MenuManagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
