import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { CategoryGridComponent } from './components/category-grid/category-grid.component';
import { TrendingProductsComponent } from './components/trending-products/trending-products.component';
import { TrustHighlightsComponent } from './components/trust-highlights/trust-highlights.component';
import { ShowcaseCarouselComponent } from './components/showcase-carousel/showcase-carousel.component';


@NgModule({
  declarations: [
    HomeComponent,
    HeroBannerComponent,
    CategoryGridComponent,
    TrendingProductsComponent,
    TrustHighlightsComponent,
    ShowcaseCarouselComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
