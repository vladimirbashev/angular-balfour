import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrderDetailsComponent } from './vendor-order-details.component';

describe('VendorOrderDetailsComponent', () => {
  let component: VendorOrderDetailsComponent;
  let fixture: ComponentFixture<VendorOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
