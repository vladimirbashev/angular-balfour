import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { SessionDataService } from '../services/session.data.service';
import * as fromSessionActions from './session.actions';

@Injectable()
export class SessionEffects {
    constructor(
        private actions$: Actions,
        private ds: SessionDataService,
    ) { }

    @Effect() readUserInfo$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionTypes.SetAccount),
        switchMap((action: fromSessionActions.SetAccountAction) => {
            return forkJoin(
                this.ds.readUserProfile('current'),
                this.ds.readUserPreference('current')
                ).pipe(
                    map(([profile, preference]) => new fromSessionActions.UserInfoReadSuccessAction({ profile, preference})),
                    catchError(error => of(new fromSessionActions.UserInfoReadFailureAction({ error })))
                );
        })
    );

    @Effect()
    userProfileUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionTypes.UserProfileUpdateInit),
        switchMap((action: fromSessionActions.UserProfileUpdateInitAction) => {
            return this.ds.updateUserProfile(action.payload.id, action.payload.profile).pipe(
                map(profile => new fromSessionActions.UserProfileUpdateSuccessAction({ id: action.payload.id, profile })),
                catchError(error => of(new fromSessionActions.UserProfileUpdateFailureAction({ error })))
            );
        })
    );

    @Effect()
    userPreferenceUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionTypes.UserPreferencesUpdateInit),
        switchMap((action: fromSessionActions.UserPreferencesUpdateInitAction) => {
            return this.ds.updateUserPreference(action.payload.id, action.payload.preference).pipe(
                map(preference => new fromSessionActions.UserPreferencesUpdateSuccessAction({ id: action.payload.id, preference })),
                catchError(error => of(new fromSessionActions.UserPreferencesUpdateFailureAction({ error })))
            );
        })
    );

    @Effect()
    groupUsersRead$: Observable<Action> = this.actions$.pipe(
        ofType(fromSessionActions.SessionActionTypes.GroupUsersReadInit),
        switchMap((action: fromSessionActions.GroupUsersReadInitAction) => {
            return this.ds.getGroupUsersByGroupName(action.payload.group_name).pipe(
                map(profiles => new fromSessionActions.GroupUsersReadSuccessAction({ profiles })),
                catchError(error => of(new fromSessionActions.GroupUsersReadFailureAction({ error })))
            );
        })
    );
}
