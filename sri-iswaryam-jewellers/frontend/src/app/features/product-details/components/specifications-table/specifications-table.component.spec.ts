import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationsTableComponent } from './specifications-table.component';

describe('SpecificationsTableComponent', () => {
  let component: SpecificationsTableComponent;
  let fixture: ComponentFixture<SpecificationsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificationsTableComponent]
    });
    fixture = TestBed.createComponent(SpecificationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
