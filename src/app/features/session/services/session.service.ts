import { Account } from 'msal';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { EntityState, UserPreference, UserProfile } from '../../../common/models';
import {
    getGroupUsersState, getSessionAccount, getSessionError, getSessionIsAuthenticated, getSessionState,
    getSessionUserPreference, getSessionUserProfile, SessionState, SetAccountAction,
    UserPreferencesUpdateInitAction, UserProfileUpdateInitAction, GroupUsersReadInitAction, getGroupUsers
} from '../store/index';

@Injectable()
export class SessionService {

    constructor(
        private store: Store<SessionState>
    ) { }

    public get isAuthenticated$(): Observable<boolean> {
        return this.store.select(getSessionIsAuthenticated);
    }

    public get account$(): Observable<Account> {
        return this.store.select(getSessionAccount);
    }

    public get userProfile$(): Observable<UserProfile> {
        return this.store.select(getSessionUserProfile);
    }

    public get userPreference$(): Observable<UserPreference> {
        return this.store.select(getSessionUserPreference);
    }

    public get groupUsers$(): Observable<UserProfile[]> {
        return this.store.select(getGroupUsers);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getSessionState);
    }

    public get groupUsersState$(): Observable<EntityState> {
        return this.store.select(getGroupUsersState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getSessionError);
    }

    public updateUserProfile(id: string, profile: UserProfile): void {
        this.store.dispatch(new UserProfileUpdateInitAction({ id, profile }));
    }

    public updateUserPreference(id: string, preference: UserPreference): void {
        this.store.dispatch(new UserPreferencesUpdateInitAction({ id, preference }));
    }

    public setAccount(account: Account): void {
        this.store.dispatch(new SetAccountAction({ account }));
    }

    public readGroupUsers(group_name: string): void {
        this.store.dispatch(new GroupUsersReadInitAction({ group_name }));
    }
}
