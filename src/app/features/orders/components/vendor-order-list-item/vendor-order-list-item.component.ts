import { Component, Input, OnInit } from '@angular/core';

import { VendorOrder } from '../../../../common/models/VendorOrder';
import { UserGroup } from 'src/app/common';

@Component({
  selector: 'rp-vendor-order-list-item',
  templateUrl: './vendor-order-list-item.component.html',
  styleUrls: ['./vendor-order-list-item.component.scss']
})
export class VendorOrderListItemComponent implements OnInit {

  @Input() order: VendorOrder;
  @Input() groups: UserGroup[];

  constructor() { }

  ngOnInit(): void {
  }

}
