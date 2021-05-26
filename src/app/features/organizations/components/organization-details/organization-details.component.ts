import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, debounceTime, filter, tap, switchMap, map, finalize, retry } from 'rxjs/operators';

import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Organization } from '../../../../common/models/Organization';
import { OrganizationEditService } from '../../services/organization-edit.service';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { sortBy } from 'lodash-es';
import { Filter } from '../../../../common/models';
import { OrganizationsDataService } from '../../services/organizations.data.service';

@Component({
  selector: 'rp-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private _resetValue: object;
  private _disposed$ = new Subject();
  private _onChangeNull = true;
  private _organization: Organization;
  public placeholder: string = "Enter three characters to start searching";

  get empty(): boolean { return !this.orgCtrl.value; }
  focused = false;
  orgCtrl: FormControl;
  searching = false;
  searchResults$: Observable<Organization[]>;

  onChange: any = (_: any) => { };
  onTouched: any = () => { };

  @HostBinding('class.scrolled-block') get klassScrolledBlock(): boolean { return true; }
  @Input() set organization(val: Organization) {
    this.orgCtrl.setValue(val);
    this.form.patchValue({
      id: val && val.id || '',
      name: val && val.name || '',
      address: val && val.address || '',
      number: val && val.number || '',
      city: val && val.city || '',
      state: val && val.state || '',
      zip: val && val.zip || '',
      taxe_rate: val && val.taxe_rate || '',
      handling_fee: val && val.handling_fee || ''
    }, { emitEvent: false });
    this._resetValue = this.form.getRawValue();
    this.form.markAsUntouched();
    this._organizationEditService.valid = this.form.valid;
    this._organizationEditService.changed = false;
    this._organizationEditService.value = this._getValue();
    this._organization = val;
  }

  constructor(
    private _fb: FormBuilder,
    private _organizationEditService: OrganizationEditService,
    private ds: OrganizationsDataService
  ) {
    this.orgCtrl = new FormControl();

    this.searchResults$ = this.orgCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      filter(name => {
          const res = typeof name === 'string' && name.length > 2;
          if (!res) {
              this.onChange(name);
              this._onChangeNull = false;
          } else {
              if (!this._onChangeNull) {
                  this.onChange(null);
                  this._onChangeNull = true;
              }
          }
          return res;
      }),
      tap(() => this.searching = true),
      switchMap((name) => this.ds.searchSchools(name)),
      tap(() => this.searching = false),
      map(dp => dp.schools.map((o) => this._convertToOrganization(o))),
      finalize(() => this.searching = false),
      retry()
  );

  this.orgCtrl.valueChanges.subscribe(name => this.form.patchValue({name: name}));

    this.form = this._fb.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      address: [''],
      number: ['', Validators.required],
      city: [''],
      state: [''],
      zip: ['', Validators.pattern('^[0-9]{5}(-[0-9]{4})?$')],
      taxe_rate: [''],
      handling_fee: ['']
    });

    this._organizationEditService.reset
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this.form.reset(this._resetValue, { emitEvent: false });
        this._organizationEditService.changed = false;
        this._organizationEditService.valid = this.form.valid;
        this._organizationEditService.value = this._getValue();
      });
    this.form.valueChanges
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this._organizationEditService.changed = true;
        this._organizationEditService.valid = this.form.valid;
        if (!this.form.valid) { return; }
        this._organizationEditService.value = this._getValue();
      });
  }

  private _convertToOrganization(object: any): Organization {
    var org = new Organization();
    org.name = object.school_name;
    org.address = object.address1;
    org.zip = object.postal_code && object.postal_code.length == 9 ? 
      (object.postal_code.substring(0,5) + '-' + object.postal_code.substring(5)) : object.postal_code.substring(0,5);
    org.city = object.city;
    org.state = object.state;
    var number = object.school_code == 'nodata' ? object.smi : object.school_code;
    org.number = number;
    org.id = this._organization?.id ?? number;

    return org;
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._disposed$.next();
    this._disposed$.complete();
  }

  private _getValue(): Organization {
    const value = this.form.getRawValue();
    return value;
  }

  public hasError(field: string, error: string): boolean {
    return this.form.get(field).getError(error) && this.form.get(field).touched;
  }

  displayOrg(org: any): string {
    return org && org.name ? org.name : '';
  }

  setOrganization(val: any): void {
    this.orgCtrl.setValue(val, { emitEvent: false });
    this.form.patchValue({
      id: val && val.id || '',
      name: val && val.name || '',
      address: val && val.address || '',
      number: val && val.number || '',
      city: val && val.city || '',
      state: val && val.state || '',
      zip: val && val.zip || '',
      taxe_rate: val && val.taxe_rate || '',
      handling_fee: val && val.handling_fee || ''
    }, { emitEvent: true });
    this.form.markAllAsTouched();
  }



}
