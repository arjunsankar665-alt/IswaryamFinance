import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { SortDropdownComponent } from './components/sort-dropdown/sort-dropdown.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';


@NgModule({
  declarations: [
    ProductListComponent,
    FilterPanelComponent,
    SortDropdownComponent,
    ProductGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductListRoutingModule
  ]
})
export class ProductListModule { }
