import { Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';

import { VendorOrderStatus, vendorOrderStatusNamesForReps, vendorOrderStatusNamesForRepManagers } from '../../../../common/models/VendorOrder';
import { UserProfile, UserGroup, EntityState } from 'src/app/common';
import { SessionService } from 'src/app/features/session';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { union } from 'lodash-es';

@Component({
    selector: 'rp-vendor-order-status-chip',
    templateUrl: './status-chip.component.html'
})
export class StatusChipComponent implements OnDestroy, OnInit {

    @HostBinding('class') get klass(): string[] {
        return ['rp-vendor-order-status-chip', 'rp-vendor-order-status-chip-' + this.status];
    }
    @Input() status: VendorOrderStatus;
    @Input() set assigneeId (value: string) {
        this._assigneeId = value;
    }
    @Input() groups: UserGroup[];
    @Input() currentUser: UserProfile;

    get assigneeId() {
        return this._assigneeId;
    }

    get showAssignee() {
        return this._assigneeId && this.status === VendorOrderStatus.Assigned;
    }

    private _subs = new Subscription();
    private _users: UserProfile[] = [];

    public inGroup = UserProfile.inGroup;
    public groupUserState$: Observable<EntityState>;
    private _assigneeId: string = null;

    get text(): string {
        return this.groups ?
            this.inGroup(this.groups, [UserGroup.AE, UserGroup.Administrators, UserGroup.OE, UserGroup.OETL, UserGroup.CS]) ?
                vendorOrderStatusNamesForRepManagers[this.status] : vendorOrderStatusNamesForReps[this.status] : 'Loading...';
    }

    constructor(
        private _sessionService: SessionService
    ) {
        this._subs.add(
            this._sessionService.groupUsers$.subscribe(
            (profiles) => {
                if (profiles) {
                    if (this.currentUser) 
                    {
                        const u = union(profiles, [this.currentUser]);
                        this._users = u;
                    } else {
                        this._users = profiles;
                    }
                }
            }
        ));

        this.groupUserState$ = this._sessionService.groupUsersState$;
    }

    ngOnInit(): void { 
        if (this.assigneeId) {
            this._sessionService.readGroupUsers(UserGroup.CS);
        }
    }

    get assigneeName() {
        if (this.assigneeId && this._users) {
            var p = this._users.find(u => u.id === this.assigneeId);

            return (p?.last_name != null && p?.first_name != null ?
                (p?.last_name + ', ' + p?.first_name) : p?.full_name) || p?.email;
        } else
            return null;
    }

    ngOnDestroy(): void {
        this._subs.unsubscribe();
    }

}
