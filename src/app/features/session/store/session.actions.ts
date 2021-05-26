import { Account } from 'msal';

import { Action } from '@ngrx/store';

import { UserPreference, UserProfile } from '../../../common/models';

export enum SessionActionTypes {
    SetAccount = '[Session] Set account',
    UserInfoReadSuccess = '[Session] UserInfo Read success',
    UserInfoReadFailure = '[Session] UserInfo Read failure',
    UserProfileUpdateInit = '[Session UserProfile Update init]',
    UserProfileUpdateSuccess = '[Session UserProfile Update success]',
    UserProfileUpdateFailure = '[Session UserProfile Update failure]',
    UserPreferencesUpdateInit = '[Session UserPreferences Update init]',
    UserPreferencesUpdateSuccess = '[Session UserPreferences Update success]',
    UserPreferencesUpdateFailure = '[Session UserPreferences Update failure]',
    GroupUsersReadInit = '[Session Group Users Read init]',
    GroupUsersReadInitSuccess = '[Session Group Users Read success]',
    GroupUsersReadInitFailure = '[Session Group Users Read failure]'
}

export class SetAccountAction implements Action {
    readonly type = SessionActionTypes.SetAccount;
    constructor(public payload: { account: Account }) { }
}

export class UserInfoReadSuccessAction implements Action {
    readonly type = SessionActionTypes.UserInfoReadSuccess;
    constructor(public payload: { profile: UserProfile, preference: UserPreference }) { }
}

export class UserInfoReadFailureAction implements Action {
    readonly type = SessionActionTypes.UserInfoReadFailure;
    constructor(public payload: { error: any }) { }
}

export class UserProfileUpdateInitAction implements Action {
    public readonly type = SessionActionTypes.UserProfileUpdateInit;
    constructor(public payload: { id: string, profile: UserProfile }) { }
}

export class UserProfileUpdateSuccessAction implements Action {
    public readonly type = SessionActionTypes.UserProfileUpdateSuccess;
    constructor(public payload: { id: string, profile: UserProfile }) { }
}

export class UserProfileUpdateFailureAction implements Action {
    public readonly type = SessionActionTypes.UserProfileUpdateFailure;
    constructor(public payload: { error: Error }) { }
}

export class UserPreferencesUpdateInitAction implements Action {
    public readonly type = SessionActionTypes.UserPreferencesUpdateInit;
    constructor(public payload: { id: string, preference: UserPreference }) { }
}

export class UserPreferencesUpdateSuccessAction implements Action {
    public readonly type = SessionActionTypes.UserPreferencesUpdateSuccess;
    constructor(public payload: { id: string, preference: UserPreference }) { }
}

export class UserPreferencesUpdateFailureAction implements Action {
    public readonly type = SessionActionTypes.UserPreferencesUpdateFailure;
    constructor(public payload: { error: Error }) { }
}

export class GroupUsersReadInitAction implements Action {
    public readonly type = SessionActionTypes.GroupUsersReadInit;
    constructor(public payload: { group_name: string }) { }
}

export class GroupUsersReadSuccessAction implements Action {
    public readonly type = SessionActionTypes.GroupUsersReadInitSuccess;
    constructor(public payload: { profiles: UserProfile[] }) { }
}

export class GroupUsersReadFailureAction implements Action {
    public readonly type = SessionActionTypes.GroupUsersReadInitFailure;
    constructor(public payload: { error: Error }) { }
}

export type SessionAction =
    SetAccountAction
    | UserInfoReadSuccessAction
    | UserInfoReadFailureAction
    | UserProfileUpdateInitAction
    | UserProfileUpdateSuccessAction
    | UserProfileUpdateFailureAction
    | UserPreferencesUpdateInitAction
    | UserPreferencesUpdateSuccessAction
    | UserPreferencesUpdateFailureAction
    | GroupUsersReadInitAction
    | GroupUsersReadSuccessAction
    | GroupUsersReadFailureAction;
