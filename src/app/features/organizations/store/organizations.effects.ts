import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EntityState } from 'src/app/common';

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { AppSettingsService } from '../../../common/services/appsettings.service';
import { OrganizationsDataService } from '../services/organizations.data.service';
import * as fromOrganizationsActions from './organizations.actions';

@Injectable()
export class OrganizationsEffects {
    constructor(
        private actions$: Actions,
        private ass: AppSettingsService,
        private ds: OrganizationsDataService,
        private route: ActivatedRoute
    ) { }

    @Effect() readOrganizations$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsRead),
        switchMap((action: fromOrganizationsActions.OrganizationsReadAction) => {
            const insert: boolean = action?.payload?.skip !== 0;
            return this.ds.readOrganizations(action?.payload?.skip ?? 0, action?.payload?.take ?? 0,
                    action?.payload?.filter ?? null, action?.payload?.params ?? null).pipe(
                map(dp => new fromOrganizationsActions.OrganizationsReadSuccessAction({
                    organizations: dp.data,
                    insert,
                    isComplete: dp?.data?.length !== this.ass.getProperty(['services', 'organizations.data', 'defaults', 'take'], 10)
                        || !dp?.data?.length
                })),
                catchError(error => of(new fromOrganizationsActions.OrganizationsReadFailureAction({ error })))
            );
        })
    );

    @Effect() readOrganizationsSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsReadSuccess),
        map((action: fromOrganizationsActions.OrganizationsReadSuccessAction) => {
            const urlState = this.route.snapshot.queryParamMap.get('entity_state');
            if (urlState === EntityState.Create) {
                return new fromOrganizationsActions.OrganizationsSetStateAction({ state: EntityState.Create });
            } else {
                const organizations = action?.payload?.organizations || [];
                return new fromOrganizationsActions.OrganizationsSetStateAction(
                    { state: organizations.length > 0 ? EntityState.Data : EntityState.Empty }
                );
            }
        })
    );

    @Effect()
    organizationsCreate$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsCreateInit),
        switchMap((action: fromOrganizationsActions.OrganizationsCreateInitAction) => {
            return this.ds.createOrganization(action.payload.organization).pipe(
                map(organization => new fromOrganizationsActions.OrganizationsCreateSuccessAction({ organization })),
                catchError(error => of(new fromOrganizationsActions.OrganizationsCreateFailureAction({ error })))
            );
        })
    );

    @Effect()
    organizationsUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsUpdateInit),
        switchMap((action: fromOrganizationsActions.OrganizationsUpdateInitAction) => {
            return this.ds.updateOrganization(action.payload.id, action.payload.organization).pipe(
                map(organization => new fromOrganizationsActions.OrganizationsUpdateSuccessAction({ id: action.payload.id, organization })),
                catchError(error => of(new fromOrganizationsActions.OrganizationsUpdateFailureAction({ error })))
            );
        })
    );

    @Effect()
    organizationsDelete$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrganizationsActions.OrganizationsActionType.OrganizationsDeleteInit),
        switchMap((action: fromOrganizationsActions.OrganizationsDeleteInitAction) => {
            return this.ds.deleteOrganization(action.payload.id).pipe(
                map(organization => new fromOrganizationsActions.OrganizationsDeleteSuccessAction({ id: action.payload.id })),
                catchError(error => of(new fromOrganizationsActions.OrganizationsDeleteFailureAction({ error })))
            );
        })
    );
}
