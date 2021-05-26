import { fromJS } from 'immutable';
import clamp from 'lodash-es/clamp';

import { EntityState, Organization } from '../../../common/index';
import { OrganizationsActionType, OrganizationsActionUnion } from './organizations.actions';
import { OrganizationsState } from './organizations.state';
import { sortBy } from 'lodash-es';

export const orgsInitialState: OrganizationsState = {
    organizations: [],
    isComplete: false,
    isLoading: false,
    selectedId: null,
    selectedIdx: -1,
    state: EntityState.Empty,
    error: null
};

export function organizationsReducer(
    state: OrganizationsState = orgsInitialState,
    action: OrganizationsActionUnion
): OrganizationsState {
    switch (action.type) {
        case OrganizationsActionType.OrganizationsRead: {
            let map = fromJS(state);
            if (state.organizations.length > 0) {
                map = map.set('isLoading', true);
            } else {
                map = map.set('state', EntityState.Progress);
            }
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsReadSuccess: {
            let map = fromJS(state);
            let organizations = map.get('organizations').toJS() as Organization[];
            if (action.payload.insert) {
                organizations.push(...action.payload.organizations);
            } else {
                organizations = action.payload.organizations;
            }
            map = map.set('organizations', organizations);
            map = map.set('isComplete', action.payload.isComplete);
            map = map.set('isLoading', false);
            if (organizations.length > 0) {
                map = map.set('selectedId', organizations[0].id);
            }
            // if (state.selectedIdx < 0) {
            //     map = map.set('selectedIdx', 0);
            // }
            map = map.set('state', organizations.length > 0 ? EntityState.Data : EntityState.Empty);
            map = map.set('error', null);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsReadFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsCreateInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsCreateSuccess: {
            let map = fromJS(state);
            const organizations: Organization[] = map.get('organizations').toJS();
            organizations.unshift(action.payload.organization);
            var sortedOrganizations = sortBy(organizations, o => o.name);
            map = map.set('selectedId', action.payload.organization.id);
            map = map.set('organizations', sortedOrganizations);
            map = map.set('state', EntityState.Data);
            map = map.set('loading', false);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsCreateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsUpdateInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsUpdateSuccess: {
            let map = fromJS(state);
            const organizations: Organization[] = map.get('organizations').toJS();
            const idx = organizations.findIndex(s => s.id === action.payload.id);
            if (idx >= 0) {
                organizations[idx] = action.payload.organization;
            }
            map = map.set('organizations', organizations);
            map = map.set('state', organizations && organizations.length ? EntityState.Data : EntityState.Empty);
            map = map.set('loading', false);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsUpdateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsDeleteInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsDeleteSuccess: {
            let map = fromJS(state);
            const organizations: Organization[] = map.get('organizations').toJS();
            const idx = organizations.findIndex(s => s.id === action.payload.id);
            if (idx >= 0) {
                organizations.splice(idx, 1);
                map = map.set('selectedId', organizations.length ? organizations[clamp(idx, 0, organizations.length - 1)].id : null);
            }
            map = map.set('organizations', organizations);
            map = map.set('state', organizations && organizations.length ? EntityState.Data : EntityState.Empty);
            map = map.set('loading', false);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsDeleteFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsSelectId: {
            let map = fromJS(state);
            map = map.set('selectedId', action.payload.id);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsSetState: {
            let map = fromJS(state);
            map = map.set('state', action.payload.state);
            return map.toJS() as OrganizationsState;
        }

        case OrganizationsActionType.OrganizationsSelect: {
            let map = fromJS(state);
            map = map.set('selectedIdx', action.payload.idx);
            return map.toJS() as OrganizationsState;
        }

        default: {
            return state;
        }
    }
}
