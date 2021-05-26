import { fromJS } from 'immutable';
import clamp from 'lodash-es/clamp';
import { Customer, EntityState } from '../../../common/index';
import { CustomersActionType, CustomersActionUnion } from './customers.actions';
import { CustomersState } from './customers.state';

export const orgsInitialState: CustomersState = {
    customers: [],
    isComplete: false,
    isLoading: false,
    selectedId: null,
    selectedIdx: -1,
    state: EntityState.Empty,
    error: null
};

export function customersReducer(
    state: CustomersState = orgsInitialState,
    action: CustomersActionUnion
): CustomersState {
    switch (action.type) {
        case CustomersActionType.CustomersRead: {
            let map = fromJS(state);
            if (state.customers.length > 0) {
                map = map.set('isLoading', true);
            } else {
                map = map.set('state', EntityState.Progress);
            }
            return map.toJS() as CustomersState;
        }

        case CustomersActionType.CustomersReadSuccess: {
            let map = fromJS(state);
            let customers = map.get('customers').toJS() as Customer[];
            if (action.payload.insert) {
                customers.push(...action.payload.customers);
            } else {
                customers = action.payload.customers;
            }
            map = map.set('customers', customers);
            map = map.set('isComplete', action.payload.isComplete);
            map = map.set('isLoading', false);
            if (customers.length > 0) {
                map = map.set('selectedId', customers[0].id);
            }

            map = map.set('state', customers.length > 0 ? EntityState.Data : EntityState.Empty);
            // map = map.set('state', EntityState.Progress);
            map = map.set('error', null);
            return map.toJS() as CustomersState;
        }

        case CustomersActionType.CustomersReadFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return map.toJS() as CustomersState;
        }

        case CustomersActionType.CustomersCreateInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersCreateSuccess: {
            let map = fromJS(state);
            const customers: Customer[] = map.get('customers').toJS();
            customers.unshift(action.payload.customer);
            map = map.set('selectedId', action.payload.customer.id);
            map = map.set('customers', customers);
            map = map.set('state', EntityState.Data);
            map = map.set('loading', false);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersCreateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersUpdateInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersUpdateSuccess: {
            let map = fromJS(state);
            const customers: Customer[] = map.get('customers').toJS();
            const idx = customers.findIndex(s => s.id === action.payload.id);
            if (idx >= 0) {
                customers[idx] = action.payload.customer;
            }
            map = map.set('customers', customers);
            map = map.set('state', customers && customers.length ? EntityState.Data : EntityState.Empty);
            map = map.set('loading', false);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersUpdateFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersDeleteInit: {
            let map = fromJS(state);
            map = map.set('loading', true);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersDeleteSuccess: {
            let map = fromJS(state);
            const customers: Customer[] = map.get('customers').toJS();
            const idx = customers.findIndex(s => s.id === action.payload.id);
            if (idx >= 0) {
                customers.splice(idx, 1);
                map = map.set('selectedId', customers.length ? customers[clamp(idx, 0, customers.length - 1)].id : null);
            }
            map = map.set('customers', customers);
            map = map.set('state', customers && customers.length ? EntityState.Data : EntityState.Empty);
            map = map.set('loading', false);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersDeleteFailure: {
            let map = fromJS(state);
            map = map.set('loading', false);
            map = map.set('error', action.payload.error);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersSelectId: {
            let map = fromJS(state);
            map = map.set('selectedId', action.payload.id);
            return map.toJS() as CustomersState;
        }
        case CustomersActionType.CustomersSetState: {
            let map = fromJS(state);
            map = map.set('state', action.payload.state);
            return map.toJS() as CustomersState;
        }

        case CustomersActionType.CustomersSelect: {
            let map = fromJS(state);
            map = map.set('selectedIdx', action.payload.idx);
            return map.toJS() as CustomersState;
        }

        default: {
            return state;
        }
    }
}
