import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPickerComponent } from './customer-picker.component';

describe('CustomerPickerComponent', () => {
  let component: CustomerPickerComponent;
  let fixture: ComponentFixture<CustomerPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
