import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrderWizardComponent } from './vendor-order-wizard.component';

describe('VendorOrderWizardComponent', () => {
  let component: VendorOrderWizardComponent;
  let fixture: ComponentFixture<VendorOrderWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorOrderWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrderWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
