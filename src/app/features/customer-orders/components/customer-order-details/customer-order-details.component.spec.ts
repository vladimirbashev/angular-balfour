import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderDetailsComponent } from './customer-order-details.component';

describe('CustomerOrderDetailsComponent', () => {
  let component: CustomerOrderDetailsComponent;
  let fixture: ComponentFixture<CustomerOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
