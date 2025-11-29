import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent {
  errorCode = '500';
  errorMessage = 'Internal Server Error';

  constructor(private router: Router) {}

  retry(): void {
    window.location.reload();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  contactSupport(): void {
    this.router.navigate(['/support/contact-us']);
  }
}
