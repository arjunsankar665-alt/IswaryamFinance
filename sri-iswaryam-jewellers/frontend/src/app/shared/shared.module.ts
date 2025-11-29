import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './ui/button/button.component';
import { InputComponent } from './ui/input/input.component';
import { CardComponent } from './ui/card/card.component';
import { ModalComponent } from './ui/modal/modal.component';
import { BadgeComponent } from './ui/badge/badge.component';
import { SkeletonLoaderComponent } from './ui/skeleton-loader/skeleton-loader.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MobileNavComponent } from './layout/mobile-nav/mobile-nav.component';
import { MainContainerComponent } from './layout/main-container/main-container.component';
import { SectionHeadingComponent } from './ui/section-heading/section-heading.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { EmptyStateComponent } from './ui/empty-state/empty-state.component';
import { ProductCardComponent } from './ui/product-card/product-card.component';
import { FilterSidebarComponent } from './ui/filter-sidebar/filter-sidebar.component';
import { ImageGalleryComponent } from './ui/image-gallery/image-gallery.component';
import { OrderSummaryComponent } from './ui/order-summary/order-summary.component';
import { InvoicePreviewComponent } from './ui/invoice-preview/invoice-preview.component';
import { AddressFormComponent } from './ui/address-form/address-form.component';
import { ProductReviewsComponent } from './ui/product-reviews/product-reviews.component';
import { ToastComponent } from './ui/toast/toast.component';
import { SkeletonComponent } from './ui/skeleton/skeleton.component';
import { SearchSuggestionsComponent } from './ui/search-suggestions/search-suggestions.component';
import { NewsletterComponent } from './ui/newsletter/newsletter.component';



@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    CardComponent,
    ModalComponent,
    BadgeComponent,
    SkeletonLoaderComponent,
    HeaderComponent,
    FooterComponent,
    MobileNavComponent,
    MainContainerComponent,
    SectionHeadingComponent,
    LoaderComponent,
    EmptyStateComponent,
    ProductCardComponent,
    FilterSidebarComponent,
    ImageGalleryComponent,
    OrderSummaryComponent,
    InvoicePreviewComponent,
    AddressFormComponent,
    ProductReviewsComponent,
    ToastComponent,
    SkeletonComponent,
    SearchSuggestionsComponent,
    NewsletterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    ModalComponent,
    BadgeComponent,
    SkeletonLoaderComponent,
    HeaderComponent,
    FooterComponent,
    MobileNavComponent,
    MainContainerComponent,
    SectionHeadingComponent,
    LoaderComponent,
    EmptyStateComponent,
    ProductCardComponent,
    FilterSidebarComponent,
    ImageGalleryComponent,
    OrderSummaryComponent,
    InvoicePreviewComponent,
    AddressFormComponent,
    ProductReviewsComponent,
    ToastComponent,
    SkeletonComponent,
    SearchSuggestionsComponent,
    NewsletterComponent
  ]
})
export class SharedModule { }
