import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartSectionComponent } from './add-to-cart-section.component';

describe('AddToCartSectionComponent', () => {
  let component: AddToCartSectionComponent;
  let fixture: ComponentFixture<AddToCartSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToCartSectionComponent]
    });
    fixture = TestBed.createComponent(AddToCartSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
