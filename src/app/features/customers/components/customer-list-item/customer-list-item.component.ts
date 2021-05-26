import { Component, Input, OnInit } from '@angular/core';

import { Customer } from '../../../../common/models/Customer';

@Component({
  selector: 'rp-customer-list-item',
  templateUrl: './customer-list-item.component.html',
  styleUrls: ['./customer-list-item.component.scss']
})
export class CustomerListItemComponent implements OnInit {

  @Input() customer: Customer;

  constructor() { }

  ngOnInit(): void {
  }
  
}
