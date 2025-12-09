import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { ContactUsComponent } from './pages/support/contact-us/contact-us.component';
import { FaqComponent } from './pages/support/faq/faq.component';
import { AdminAccessComponent } from './pages/admin-access/admin-access.component';

const routes: Routes = [
  // Main Layout Routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { 
        path: 'home', 
        loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) 
      },
      { 
        path: 'collections', 
        loadChildren: () => import('./features/collections/collections.module').then(m => m.CollectionsModule) 
      },
      { 
        path: 'products', 
        loadChildren: () => import('./features/product-list/product-list.module').then(m => m.ProductListModule) 
      },
      { 
        path: 'product/:id', 
        loadChildren: () => import('./features/product-details/product-details.module').then(m => m.ProductDetailsModule) 
      },
      { 
        path: 'cart', 
        loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule) 
      },
      { 
        path: 'checkout', 
        loadChildren: () => import('./features/checkout/checkout.module').then(m => m.CheckoutModule),
        canActivate: [authGuard]
      },
      { 
        path: 'account', 
        loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule),
        canActivate: [authGuard]
      },
      { 
        path: 'wishlist', 
        loadChildren: () => import('./features/wishlist/wishlist.module').then(m => m.WishlistModule),
        canActivate: [authGuard]
      },
      { 
        path: 'offers', 
        loadChildren: () => import('./features/offers/offers.module').then(m => m.OffersModule) 
      },
      { 
        path: 'gold-rate', 
        loadChildren: () => import('./pages/gold-rate/gold-rate.module').then(m => m.GoldRateModule) 
      },
      { 
        path: 'loyalty', 
        loadChildren: () => import('./features/loyalty/loyalty.module').then(m => m.LoyaltyModule),
        canActivate: [authGuard]
      },
      { 
        path: 'store-locator', 
        loadChildren: () => import('./features/store-locator/store-locator.module').then(m => m.StoreLocatorModule) 
      },
      { 
        path: 'feedback', 
        loadChildren: () => import('./features/feedback/feedback.module').then(m => m.FeedbackModule) 
      },
      {
        path: 'support/contact-us',
        component: ContactUsComponent
      },
      {
        path: 'contact',
        component: ContactUsComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      },
      {
        path: 'admin-access',
        component: AdminAccessComponent,
        canActivate: [authGuard]
      }
    ]
  },

  // Auth Layout Routes
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule) },
      { path: 'register', loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule) }
    ]
  },

  // Admin Layout Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },

  // Wildcard Route
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
