import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminAccessComponent } from './admin-access.component';
import { AdminAccessService } from '../../core/services/admin-access.service';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('AdminAccessComponent', () => {
  let component: AdminAccessComponent;
  let fixture: ComponentFixture<AdminAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAccessComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: AdminAccessService,
          useValue: {
            verifyPassword: jasmine.createSpy('verifyPassword'),
            consumeRedirect: jasmine.createSpy('consumeRedirect'),
            rememberRedirect: jasmine.createSpy('rememberRedirect')
          }
        },
        {
          provide: NotificationService,
          useValue: {
            success: jasmine.createSpy('success'),
            error: jasmine.createSpy('error')
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
