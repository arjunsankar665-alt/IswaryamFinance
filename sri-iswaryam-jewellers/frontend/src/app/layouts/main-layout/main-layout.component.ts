import { Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnDestroy {
  isMobileNavOpen = false;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(
        filter((event): event is NavigationStart => event instanceof NavigationStart),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isMobileNavOpen = false;
        this.setBodyScrollLock(false);
      });
  }

  onToggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
    this.setBodyScrollLock(this.isMobileNavOpen);
  }

  closeMobileNav(): void {
    this.isMobileNavOpen = false;
    this.setBodyScrollLock(false);
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setBodyScrollLock(lock: boolean): void {
    const body = document.body;
    if (lock) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  }

}
