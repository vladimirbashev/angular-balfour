import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { SessionService } from '../../../../features/session';

import { vendorOrderStatusNamesForRepManagers, VendorOrder, UserProfile, UserGroup, VendorOrderStatus, EntityState } from '../../../../common/models/index';
import { union } from 'lodash-es';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

@Component({
    selector: 'rp-orders-change-status-multi-dialog',
    templateUrl: './change-status-multi-dialog.component.html',
    styleUrls: ['./change-status-multi-dialog.component.scss']
})
export class OrdersChangeStatusMultiDialogComponent implements OnInit, OnDestroy {

    private _subs = new Subscription();

    public statuses = Object.entries(vendorOrderStatusNamesForRepManagers);
    public form: FormGroup;
    public selectedVendorOrders: VendorOrder[] = [];
    public inGroup = UserProfile.inGroup;
    public loading$: Observable<boolean>;
    public searching: boolean = false;
    public users$: BehaviorSubject<UserProfile[]> = new BehaviorSubject([]);
    private _users: UserProfile[] = [];
    public placeholder: string = "Choose assignee...";
    public assigneeCtrl: FormControl;

    constructor(
        private _dialogRef: MatDialogRef<OrdersChangeStatusMultiDialogComponent>,
        private _fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: { selectedVendorOrders: VendorOrder[], groups: UserGroup[], current_user: UserProfile },
        private _sessionService: SessionService
    ) {
        this.assigneeCtrl = new FormControl();
        this.form = this._fb.group({
            status: ['', Validators.required],
            assignee_id: ['', Validators.required]
        });
        if (this.inGroup(this.data.groups, UserGroup.AE)) {
            this.statuses = this.statuses.filter((status) => {
                return status[0] != VendorOrderStatus.InProgress;
            })
        }
        this.selectedVendorOrders = data.selectedVendorOrders;

        this._subs.add(this.form.get('status').valueChanges
            .pipe()
            .subscribe(val => {
                if (val === VendorOrderStatus.Assigned && (!this._users || this._users.length < 2)) {
                    this._sessionService.readGroupUsers(UserGroup.CS);
                    this.form.get('assignee_id').setValidators(Validators.required);
                } else {
                    this.form.get('assignee_id').disable({ emitEvent: false });
                }
            })
        );

        this._subs.add(
            this._sessionService.groupUsers$.subscribe(
                (profiles: UserProfile[]) => {
                    const u = union(profiles, [this.data.current_user]);
                    this.users$.next(u);
                    this._users = u;
                    if (this.form.get('assignee_id').value != null) {
                        var i = this._users.findIndex(u => u.id == this.form.get('assignee_id').value);
                        this.assigneeCtrl.setValue(this._users[i]);
                    }
                }
            )
        );

        this._subs.add(
            this.assigneeCtrl.valueChanges.subscribe(
                (search) => {
                    this.searching = true;
                    var res = this._users.filter(u => u.full_name?.includes(search) || u.email?.includes(search)
                        || u.first_name?.includes(search) || u.last_name?.includes(search));
                    this.users$.next(res);
                    this.searching = false;
                }
            )
        );

        this.loading$ = combineLatest(
            this._sessionService.groupUsersState$
        ).pipe(
            map(([groupUsersState]) => groupUsersState === EntityState.Progress),
            distinctUntilChanged(),
            tap(groupUsersState => {
                if (groupUsersState) {
                    this.form.get('assignee_id').disable({ emitEvent: false });
                } else {
                    this.form.get('assignee_id').enable({ emitEvent: false });
                }
            })
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void { this._subs.unsubscribe(); }

    displayUser(user: UserProfile): string {
        return (user?.last_name != null && user?.first_name != null ?
            (user?.last_name + ', ' + user?.first_name) : user?.full_name) || user?.email;
    }

    public onChange(): void {
        var assignee_id = this.form.get('status').value == VendorOrderStatus.Assigned
            ? this.form.get('assignee_id').value : '';
        const result = { status: this.form.get('status').value, assignee_id: assignee_id }
        this._dialogRef.close(result);
    }

    public onCancel(): void {
        this._dialogRef.close(null);
    }

    public setUser(user: UserProfile) {
        this.assigneeCtrl.setValue(user, { emitEvent: false });
        this.form.patchValue({
            assignee_id: user.id
        });
    }

    public hasError(field: string, error: string): boolean {
        return this.form.get(field).getError(error) && this.form.get(field).touched;
    }
}
