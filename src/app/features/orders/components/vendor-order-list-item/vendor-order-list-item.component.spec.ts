import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorOrderListItemComponent } from './vendor-order-list-item.component';

describe('VendorOrderListItemComponent', () => {
  let component: VendorOrderListItemComponent;
  let fixture: ComponentFixture<VendorOrderListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorOrderListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorOrderListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
