import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustHighlightsComponent } from './trust-highlights.component';

describe('TrustHighlightsComponent', () => {
  let component: TrustHighlightsComponent;
  let fixture: ComponentFixture<TrustHighlightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrustHighlightsComponent]
    });
    fixture = TestBed.createComponent(TrustHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
