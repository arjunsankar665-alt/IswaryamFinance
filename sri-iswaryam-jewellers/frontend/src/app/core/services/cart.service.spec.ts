import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

class AuthServiceStub {
  user$ = new BehaviorSubject(null);
  getToken(): string | null {
    return null;
  }
  promptLogin(): void {}
}

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }]
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
