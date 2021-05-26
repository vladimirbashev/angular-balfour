import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { EntityState } from '../../../common';
import { SessionEditService, SessionService } from '../../session';

@Component({
  selector: 'rp-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  public state$: Observable<EntityState>;
  public error$: Observable<any>;

  constructor(
    private _sessionsService: SessionService,
    private _sessionEditService: SessionEditService,
    private router: Router,
    private _snackBar: MatSnackBar
    ) { 
      this.state$ = this._sessionsService.state$;
      this.error$ = this._sessionsService.error$;
    }

  ngOnInit(): void {
  }

  ngOnDestroy(): void { }

  getAccountStateColor(): string {
    return this.router.url.includes("account") ? "#e0e0e0" : "#ffffff";
  }

  getAddressStateColor(): string {
    return this.router.url.includes("shipping_address") ? "#e0e0e0" : "#ffffff";
  }

  save() {
    if (this.router.url.includes("account")) {
      if (this._sessionEditService.profileChanged && this._sessionEditService.profileValid) {
        this._sessionsService.updateUserProfile(this._sessionEditService.profileValue.id, this._sessionEditService.profileValue);
        this.openSnackBar("User account was updated", "Done");
      }

      if (this._sessionEditService.preferenceChanged && this._sessionEditService.preferceValid) {
        this._sessionsService.updateUserPreference(this._sessionEditService.preferenceValue.id, this._sessionEditService.preferenceValue);
        this.openSnackBar("User account was updated", "Done");
      }
    }

    if (this.router.url.includes("shipping_address")) {
      if (!this._sessionEditService.preferenceChanged || !this._sessionEditService.preferceValid) { return; }

      this._sessionsService.updateUserPreference(this._sessionEditService.preferenceValue.id, this._sessionEditService.preferenceValue);
      this.openSnackBar("Shipping information was updated", "Done");
    }
  }

  get hasChanges(): boolean {
    if (this.router.url.includes("account")) {
      return this._sessionEditService.preferenceChanged || this._sessionEditService.profileChanged;
    }
    if (this.router.url.includes("shipping_address")) {
      return this._sessionEditService.preferenceChanged;
    }
  }

  get valid(): boolean {
    if (this.router.url.includes("account")) {
      return this._sessionEditService.profileValid && this._sessionEditService.preferceValid;
    }
    if (this.router.url.includes("shipping_address")) {
      return this._sessionEditService.preferceValid;
    }
  }

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "top"
    });
}

}
