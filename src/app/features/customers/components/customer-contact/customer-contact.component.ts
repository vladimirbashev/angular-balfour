import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, HostBinding, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { Customer } from '../../../../common/models/Customer';
import { CustomerEditService } from '../../services/customer-edit.service';
import { Organization } from '../../../../common';
import { OrganizationsAddDialogComponent } from '../../../organizations/components/organizations-add-dialog/organizations-add-dialog.component';

@Component({
  selector: 'rp-customer-contact',
  templateUrl: './customer-contact.component.html',
  styleUrls: ['./customer-contact.component.scss']
})
export class CustomerContactComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public tabIndex = 0;
  private _resetValue: object;
  private _disposed$ = new Subject();

  @ViewChild('tabGroup') tabGroup;

  @HostBinding('class.scrolled-block') get klassScrolledBlock(): boolean { return true; }
  @Input() set customer(val: Customer) {
    let org = new Organization();

    org.id = val && val.organization_id;
    org.name = val && val.organization_name;
    org.number = val && val.organization_number;

    this.form.patchValue({
      id: val && val.id || '',
      first_name: val && val.first_name || '',
      last_name: val && val.last_name || '',
      address: val && val.address || '',
      apt_num: val && val.apt_num || '',
      org,
      city: val && val.city || '',
      state: val && val.state || '',
      zip: val && val.zip || '',
      phone: val && val.phone || '',
      email: val && val.email || '',
      additional_phone: val && val.additional_phone || '',
      additional_email: val && val.additional_email || ''
    }, { emitEvent: false });
    this._resetValue = this.form.getRawValue();
    this.form.markAsUntouched();
    this._customerEditService.valid = this.form.valid;
    this._customerEditService.changed = false;
    this._customerEditService.value = this._getValue();
  }

  constructor(
    private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _customerEditService: CustomerEditService
  ) {
    this.form = this._fb.group({
      id: [{ value: '', disabled: true }],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      org: [null, Validators.required],
      address: [''],
      apt_num: [''],
      city: [''],
      state: [''],
      zip: ['', [Validators.pattern('[0-9]{3,6}')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10,13}')]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]$')]],
      additional_phone: ['', [Validators.pattern('[0-9]{10,13}')]],
      additional_email: ['', [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]$')]]
    });

    this._customerEditService.reset
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this.form.reset(this._resetValue, { emitEvent: false });
        this._customerEditService.changed = false;
        this._customerEditService.valid = this.form.valid;
        this._customerEditService.value = this._getValue();
      });
    this.form.valueChanges
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this._customerEditService.changed = this.form.touched;
        this._customerEditService.valid = this.form.valid;
        if (!this.form.valid) { return; }
        this._customerEditService.value = this._getValue();
        this._customerEditService.value.organization_name = this.form.get('org').value.name;
        this._customerEditService.value.organization_number = this.form.get('org').value.number;
        this._customerEditService.value.organization_id = this.form.get('org').value.id;
      });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._disposed$.next();
    this._disposed$.complete();
  }
  private _getValue(): Customer {
    const value = this.form.getRawValue();
    return value;
  }

  public hasError(field: string, error: string): boolean {
    return this.form.get(field).getError(error) && this.form.get(field).touched;
  }

  public onTabChange(index: number): void {
    this.tabIndex = index;
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this._customerEditService.index = tabChangeEvent.index;
  }

  public onSelectOrganization() {
    this._dialog.open(OrganizationsAddDialogComponent, {
      minWidth: '50vw',
      panelClass: 'rp-relative-dialog'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.form.patchValue({
          org: result
        }, { emitEvent: false });
        this.form.markAsTouched();
        this._customerEditService.valid = this.form.valid;
        this._customerEditService.changed = true;
      }
    });
  }

}
