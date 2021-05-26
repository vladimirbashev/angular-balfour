import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersScreenComponent } from './customer-orders-screen.component';

describe('CustomerOrdersScreenComponent', () => {
  let component: CustomerOrdersScreenComponent;
  let fixture: ComponentFixture<CustomerOrdersScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrdersScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrdersScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
