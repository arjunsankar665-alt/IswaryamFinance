import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { WishlistService } from './wishlist.service';

class AuthServiceStub {
  user$ = new BehaviorSubject(null);
  getToken(): string | null {
    return null;
  }
  promptLogin(): void {}
}

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }]
    });
    service = TestBed.inject(WishlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
