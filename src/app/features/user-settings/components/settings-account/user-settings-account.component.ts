import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import defaultsDeep from 'lodash-es/defaultsDeep';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserProfile, UserPreference } from '../../../../common';
import { SessionEditService, SessionService } from '../../../session';

@Component({
  selector: 'rp-user-settings-account',
  templateUrl: './user-settings-account.component.html',
  styleUrls: ['./user-settings-account.component.scss']
})
export class UserSettingsAccountComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public languages: string[] = Object.keys(Languages).map(key => Languages[key]);
  private _disposed$ = new Subject();
  private _resetValue: object;
  private _actualProfile: UserProfile;
  private _actualPrefs: UserPreference;

  constructor(
    private _sessionsService: SessionService,
    private _sessionEditService: SessionEditService,
    private _fb: FormBuilder
  ) {
    this.form = this._fb.group({
      profile: this._fb.group({
        id: [''],
        full_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]$')]]
      }),
      preference: this._fb.group({
        office_number: ['', Validators.pattern('[0-9]{4}')]
      })
    });

    this.form.get('profile').valueChanges
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this._sessionEditService.profileChanged = true;
        this.form.get('profile').markAllAsTouched();
        this._sessionEditService.profileValid = this.form.get('profile').valid;
        if (!this.form.get('profile').valid) { return; }
        this._sessionEditService.profileValue = defaultsDeep(this._getProfileValue(), this._actualProfile);
      });
    
    this.form.get('preference').valueChanges
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this._sessionEditService.preferenceChanged = true;
        this.form.get('preference').markAllAsTouched();
        this._sessionEditService.preferceValid = this.form.get('preference').valid;
        if (!this.form.get('preference').valid) { return; }
        this._sessionEditService.preferenceValue = defaultsDeep(this._getPreferenceValue(), this._actualPrefs);
      });

    this._sessionsService.userProfile$
      .pipe(takeUntil(this._disposed$))
      .subscribe((up) => {
        this.form.patchValue({
          profile: {
            id: up?.id,
            full_name: up?.full_name,
            // position: up?.position,
            // department: up?.department,
            email: up?.email,
            // phone: up?.phone
          }
        }, { emitEvent: true });

        this._resetValue = this.form.getRawValue();
        this.form.markAsUntouched();
        this._sessionEditService.profileChanged = false;
        this._sessionEditService.profileValid = this.form.get('profile').valid;
        this._sessionEditService.profileValue = defaultsDeep(this._getProfileValue(), up);

        this._actualProfile = up;
      });

      this._sessionsService.userPreference$
      .pipe(takeUntil(this._disposed$))
      .subscribe((up) => {
        this.form.patchValue({
          preference: {
            office_number: up?.office_number
          }
        }, { emitEvent: true });

        this._resetValue = this.form.getRawValue();
        this.form.markAsUntouched();
        this._sessionEditService.preferenceChanged = false;
        this._sessionEditService.preferceValid = this.form.valid;
        this._sessionEditService.preferenceValue = defaultsDeep(this._getPreferenceValue(), up);

        this._actualPrefs = up;
      });

    this._sessionEditService.reset
      .pipe(takeUntil(this._disposed$))
      .subscribe(() => {
        this.form.reset(this._resetValue, { emitEvent: false });
        this._sessionEditService.profileChanged = false;
        this._sessionEditService.profileValid = this.form.get('profile').valid;
        this._sessionEditService.profileValue = this._getProfileValue();
        this._sessionEditService.preferenceChanged = false;
        this._sessionEditService.preferceValid = this.form.get('preference').valid;
        this._sessionEditService.preferenceValue = this._getPreferenceValue();
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this._disposed$.next();
    this._disposed$.complete();
  }

  public hasProfileError(field: string, error: string): boolean {
    return this.form.get('profile').get(field).getError(error);
  }

  public hasPreferenceError(field: string, error: string): boolean {
    return this.form.get('preference').get(field).getError(error);
  }

  private _getProfileValue(): UserProfile {
    const value = this.form.getRawValue();
    return value.profile;
  }

  private _getPreferenceValue(): UserPreference {
    const value = this.form.getRawValue();
    return value.preference;
  }

}

export enum Languages {
  ENGLISH = 'English',
  SPANISH = 'Spanish'
}

