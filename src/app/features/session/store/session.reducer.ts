import { fromJS } from 'immutable';

import { EntityState } from '../../../common';
import { SessionAction, SessionActionTypes } from './session.actions';
import { SessionState } from './session.state';

export const sessionInitialState: SessionState = {
    account: null,
    profile: null,
    preference: null,
    groupUsers: null,
    state: EntityState.Empty,
    groupUsersState: EntityState.Empty,
    error: null
};

export function sessionReducer(
    state: SessionState = sessionInitialState,
    action: SessionAction
): SessionState {
    let map = fromJS(state);
    switch (action.type) {
        case SessionActionTypes.SetAccount: {
            map = map.set('account', action.payload.account);
            map = map.set('error', null);
            map = map.set('state', EntityState.Progress);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserInfoReadSuccess: {
            map = map.set('profile', action.payload.profile);
            map = map.set('preference', action.payload.preference);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return map.toJS() as SessionState;
        }


        case SessionActionTypes.UserInfoReadFailure: {
            map = map.set('profile', null);
            map = map.set('preference', null);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload.error);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserProfileUpdateInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserProfileUpdateSuccess: {
            let map = fromJS(state);
            map = map.set('profile', action.payload.profile);
            map = map.set('loading', false);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserProfileUpdateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserPreferencesUpdateInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserPreferencesUpdateSuccess: {
            let map = fromJS(state);
            map = map.set('preference', action.payload.preference);
            map = map.set('loading', false);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.UserPreferencesUpdateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.GroupUsersReadInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            map = map.set('groupUsersState', EntityState.Progress);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.GroupUsersReadInitSuccess: {
            let map = fromJS(state);
            map = map.set('groupUsers', action.payload.profiles);
            map = map.set('loading', false);
            map = map.set('groupUsersState', EntityState.Data);
            return map.toJS() as SessionState;
        }

        case SessionActionTypes.GroupUsersReadInitFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('groupUsersState', EntityState.Error);
            map = map.set('error', action.payload.error);
            return map.toJS() as SessionState;
        }

        default:
            return state;

    }
}
