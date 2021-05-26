import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrdersWizardComponent } from './customer-orders-wizard.component';

describe('CustomerOrdersWizardComponent', () => {
  let component: CustomerOrdersWizardComponent;
  let fixture: ComponentFixture<CustomerOrdersWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrdersWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrdersWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
