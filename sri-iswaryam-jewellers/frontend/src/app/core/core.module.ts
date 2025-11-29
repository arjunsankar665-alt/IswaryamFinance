import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { LanguageSwitcherComponent } from './language-switcher/language-switcher.component';
import { LiveChatComponent } from './live-chat/live-chat.component';
import { ToastContainerComponent } from './notifications/toast-container/toast-container.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NotificationsComponent,
    LanguageSwitcherComponent,
    LiveChatComponent,
    ToastContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NotificationsComponent,
    LanguageSwitcherComponent,
    LiveChatComponent,
    ToastContainerComponent
  ]
})
export class CoreModule { }
