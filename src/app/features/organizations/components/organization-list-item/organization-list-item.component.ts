import { Component, Input, OnInit } from '@angular/core';

import { Organization } from '../../../../common/models/Organization';

@Component({
  selector: 'rp-organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.scss']
})
export class OrganizationListItemComponent implements OnInit {

  @Input() organization: Organization;

  constructor() { }

  ngOnInit(): void {
  }
  
}
