import { Component, Input, OnInit } from '@angular/core';
import { CustomerOrder } from '../../../../common/models/CustomerOrder';

@Component({
  selector: 'rp-customer-order-list-item',
  templateUrl: './customer-order-list-item.component.html',
  styleUrls: ['./customer-order-list-item.component.scss']
})
export class CustomerOrderListItemComponent implements OnInit {

  @Input() order: CustomerOrder;

  constructor() { }

  ngOnInit(): void {  }

}
