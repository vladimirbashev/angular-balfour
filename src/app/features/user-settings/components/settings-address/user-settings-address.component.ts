import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserPreference, VendorOrderShipDestType } from '../../../../common';
import { SessionEditService, SessionService } from '../../../session';

@Component({
  selector: 'rp-user-settings-address',
  templateUrl: './user-settings-address.component.html',
  styleUrls: ['./user-settings-address.component.scss']
})
export class UserSettingsAddressComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public vendorOrderShipDestTypes = Object.entries(VendorOrderShipDestType);
  private _disposed$ = new Subject();
  private _resetValue: object;
  private _actualPreference: UserPreference;

  constructor(
    private _sessionsService: SessionService,
    private _sessionEditService: SessionEditService,
    private _fb: FormBuilder
    ) {
    this.form = this._fb.group({
      // ship_dest_type: [null, Validators.required],
      ship_name: [''],
      ship_address: [''],
      ship_city: [''],
      ship_state: [''],
      ship_zip: [''],
      ship_attention: [''],
      ship_phone: ['', [Validators.pattern('[0-9]{10,13}')]]
  });

    this.form.valueChanges
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this._sessionEditService.preferenceChanged = true;
        this.form.markAllAsTouched();
        this._sessionEditService.preferceValid = this.form.valid;
        if (!this.form.valid) { return; }
        this._sessionEditService.preferenceValue = defaultsDeep(this._getValue(), this._actualPreference);
      });

    this._sessionsService.userPreference$
        .pipe(takeUntil(this._disposed$))
        .subscribe((up) => {
        this.form.patchValue({
          id: up?.id,
          // ship_dest_type: up?.ship_dest_type,
          ship_name: up?.ship_name,
          ship_address: up?.ship_address,
          ship_city: up?.ship_city,
          ship_state: up?.ship_state,
          ship_zip: up?.ship_zip,
          ship_attention: up?.ship_attention,
          ship_phone: up?.ship_phone
        }, { emitEvent: true });

        this._resetValue = this.form.getRawValue();
        this.form.markAsUntouched();
        this._sessionEditService.preferenceChanged = false;
        this._sessionEditService.preferceValid = this.form.valid;
        this._sessionEditService.preferenceValue = defaultsDeep(this._getValue(), up);

        this._actualPreference = up;
      });
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._disposed$.next();
    this._disposed$.complete();
  }

  public hasError(field: string, error: string): boolean {
    return this.form.get(field).getError(error);
  }

  private _getValue(): UserPreference {
    const value = this.form.getRawValue();
    return value;
  }
}
