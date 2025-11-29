import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SharedModule } from './shared/shared.module';
import { HeroBannerComponent } from './pages/home/components/hero-banner/hero-banner.component';
import { CategoryGridComponent } from './pages/home/components/category-grid/category-grid.component';
import { TrendingProductsComponent } from './pages/home/components/trending-products/trending-products.component';
import { ProductListingComponent } from './pages/products/product-listing/product-listing.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CartComponent } from './pages/cart/cart.component';
import { AddressComponent } from './pages/checkout/address/address.component';
import { PaymentComponent } from './pages/checkout/payment/payment.component';
import { ReviewComponent } from './pages/checkout/review/review.component';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { OrdersComponent } from './pages/account/orders/orders.component';
import { SettingsComponent } from './pages/account/settings/settings.component';
import { OrderTrackingComponent } from './pages/account/order-tracking/order-tracking.component';
import { FaqComponent } from './pages/support/faq/faq.component';
import { ContactUsComponent } from './pages/support/contact-us/contact-us.component';
import { StoreLocatorComponent } from './pages/support/store-locator/store-locator.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { ServerErrorComponent } from './pages/error/server-error/server-error.component';
import { CompareComponent } from './pages/compare/compare.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    AdminLayoutComponent,
    HeroBannerComponent,
    CategoryGridComponent,
    TrendingProductsComponent,
    ProductListingComponent,
    ProductDetailsComponent,
    WishlistComponent,
    CartComponent,
    AddressComponent,
    PaymentComponent,
    ReviewComponent,
    ProfileComponent,
    OrdersComponent,
    SettingsComponent,
    OrderTrackingComponent,
    FaqComponent,
    ContactUsComponent,
    StoreLocatorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    CompareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
