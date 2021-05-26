import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersChangeStatusDialogComponent } from './change-status-dialog.component';

describe('OrdersChangeStatusDialogComponent', () => {
  let component: OrdersChangeStatusDialogComponent;
  let fixture: ComponentFixture<OrdersChangeStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersChangeStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersChangeStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
