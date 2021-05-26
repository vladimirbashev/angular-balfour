import { fromJS } from 'immutable';
import uniqBy from 'lodash-es/uniqBy';
import { CustomerOrder, EntityState } from '../../../common/index';
import { CustomerOrdersActionType, CustomerOrdersActionUnion } from './orders.actions';
import { CustomerOrdersState } from './orders.state';

export const customerOrdersInitialState: CustomerOrdersState = {
    orders: [],
    orderDetails: null,
    apartOrders: [],
    isComplete: false,
    isLoading: false,
    selectedId: null,
    state: null,
    stateDetails: EntityState.Empty,
    printState: null,
    error: null,
    errorDetails: null
};

export function customerOrdersReducer(
    state: CustomerOrdersState = customerOrdersInitialState,
    action: CustomerOrdersActionUnion
): CustomerOrdersState {
    switch (action.type) {
        case CustomerOrdersActionType.OrdersRead: {
            let map = fromJS(state);
            const src = action.payload.ids ? state.apartOrders : state.orders;
            if (src.length > 0 || action.payload.ids) {
                map = map.set('isLoading', true);
            } else {
                map = map.set('state', EntityState.Progress);
            }
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrdersReadSuccess: {
            let map = fromJS(state);
            let orders = map.get('orders').toJS() as CustomerOrder[];
            let apartOrders = map.get('apartOrders').toJS() as CustomerOrder[];
            let ordersIds = orders.map(o => o.id);
            if (action.payload.apart) {
                apartOrders.push(...action.payload.orders.filter(o => !ordersIds.includes(o.id)));
                apartOrders = uniqBy(apartOrders, 'id');
                map = map.set('apartOrders', apartOrders);
                map = map.set('state', apartOrders.length > 0 ? EntityState.Data : EntityState.Empty);
            } else {
                if (action.payload.insert) {
                    orders.push(...action.payload.orders);
                } else {
                    orders = action.payload.orders;
                }
                map = map.set('orders', orders);
                ordersIds = orders.map(o => o.id);
                map = map.set('isComplete', action.payload.isComplete);
                map = map.set('apartOrders', apartOrders.filter(o => !ordersIds.includes(o.id)));
                map = map.set('state', orders.length > 0 ? EntityState.Data : EntityState.Empty);
            }
            map = map.set('isLoading', false);
            if (!state.selectedId && orders.length > 0) {
                map = map.set('selectedId', orders[0].id);
            } else {
                map = map.set('selectedId', null);
            }
            map = map.set('error', null);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrdersReadFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('isLoading', false);
            map = map.set('error', action.payload);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrdersSelect: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as CustomerOrder[];
            if (orders.findIndex(o => o.id === action.payload.id) >= 0) {
                map = map.set('selectedId', action.payload.id);
            }
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderReadOne: {
            let map = fromJS(state);
            map = map.set('stateDetails', EntityState.Progress);
            map = map.set('isLoading', true);
            map = map.set('orderDetails', null);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderReadOneSuccess: {
            let map = fromJS(state);
            // If not empty
            if (action.payload.orderDetails && action.payload.orderDetails.order
                && action.payload.orderDetails.product) {
                map = map.set('stateDetails', EntityState.Data);
            } else {
                map = map.set('stateDetails', EntityState.Empty);
            }
            map = map.set('isLoading', false);
            map = map.set('orderDetails', action.payload.orderDetails);
            map = map.set('errorDetails', null);

            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderReadOneFailure: {
            let map = fromJS(state);
            map = map.set('isLoading', false);
            map = map.set('stateDetails', EntityState.Error);
            map = map.set('errorDetails', action.payload);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderCreate:
        case CustomerOrdersActionType.OrderUpdate:
        case CustomerOrdersActionType.OrderDelete: {
            let map = fromJS(state);
            map = map.set('isLoading', true);
            map = map.set('error', null);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderCreateSuccess: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as CustomerOrder[];
            orders.splice(0, 0, action.payload.order);
            map = map.set('orders', orders);
            map = map.set('orderDetails', null);
            map = map.set('selectedId', action.payload.order.id);
            map = map.set('isLoading', false);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderUpdateSuccess: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as CustomerOrder[];
            const idx = orders.findIndex(o => o.id === action.payload.order.id);
            if (idx >= 0) {
                orders[idx] = action.payload.order;
            }
            const apartOrders = map.get('apartOrders').toJS() as CustomerOrder[];
            const idax = orders.findIndex(o => o.id === action.payload.order.id);
            if (idax >= 0) {
                apartOrders[idx] = action.payload.order;
            }
            map = map.set('orderDetails', null);
            map = map.set('apartOrders', apartOrders);
            map = map.set('orders', orders);
            map = map.set('isLoading', false);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderDeleteSuccess: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as CustomerOrder[];
            const oidx = orders.findIndex(o => o.id === action.payload.id);
            if (oidx >= 0) {
                orders.splice(oidx, 1);
            }
            if (state.selectedId === action.payload.id && oidx >= 0) {
                if (orders.length > 0) {
                    map = map.set('selectedId', oidx >= orders.length ? orders[orders.length - 1].id : orders[oidx].id);
                } else {
                    map = map.set('state', EntityState.Empty);
                }
            }
            map = map.set('orders', orders);
            map = map.set('isLoading', false);
            map = map.set('error', null);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrdersPrintPdf: {
            let map = fromJS(state);
            map = map.set('printState', EntityState.Progress);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrdersPrintPdfSuccess: {
            let map = fromJS(state);
            map = map.set('printState', EntityState.Data);
            var downloadURL = URL.createObjectURL(action.payload.blob);
            window.open(downloadURL);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrdersPrintPdfFailure: {
            let map = fromJS(state);
            map = map.set('printState', EntityState.Error);
            return map.toJS() as CustomerOrdersState;
        }

        case CustomerOrdersActionType.OrderCreateFailure:
        case CustomerOrdersActionType.OrderUpdateFailure:
        case CustomerOrdersActionType.OrderDeleteFailure: {
            let map = fromJS(state);
            map = map.set('isLoading', false);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return map.toJS() as CustomerOrdersState;
        }

        default: {
            return state;
        }
    }
}
