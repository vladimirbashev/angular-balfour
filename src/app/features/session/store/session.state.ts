import { Account } from 'msal';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EntityState, UserPreference, UserProfile } from '../../../common/models';

export class SessionState {
    account: Account;
    profile: UserProfile;
    preference: UserPreference;
    groupUsers: UserProfile[];
    state: EntityState;
    groupUsersState: EntityState;
    error: any;
}

export const getSessionStoreState = createFeatureSelector<SessionState>('auth');

export const getSessionAccount = createSelector(getSessionStoreState, (state: SessionState) => state.account);
export const getSessionUserProfile = createSelector(getSessionStoreState, (state: SessionState) => state.profile);
export const getSessionUserPreference = createSelector(getSessionStoreState, (state: SessionState) => state.preference);
export const getGroupUsers = createSelector(getSessionStoreState, (state: SessionState) => state.groupUsers);
export const getSessionState = createSelector(getSessionStoreState, (state: SessionState) => state.state);
export const getGroupUsersState = createSelector(getSessionStoreState, (state: SessionState) => state.groupUsersState);
export const getSessionError = createSelector(getSessionStoreState, (state: SessionState) => state.error);
export const getSessionIsAuthenticated = createSelector(getSessionStoreState, (state: SessionState) => state.account !== null);
