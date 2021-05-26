import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersChangeStatusMultiDialogComponent } from './change-status-multi-dialog.component';

describe('OrdersChangeStatusMultiDialogComponent', () => {
  let component: OrdersChangeStatusMultiDialogComponent;
  let fixture: ComponentFixture<OrdersChangeStatusMultiDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersChangeStatusMultiDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersChangeStatusMultiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
