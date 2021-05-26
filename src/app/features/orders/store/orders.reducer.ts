import { fromJS } from 'immutable';
import uniqBy from 'lodash-es/uniqBy';
import { EntityState, VendorOrder } from '../../../common/index';
import { OrdersActionType, OrdersActionUnion } from './orders.actions';
import { OrdersState } from './orders.state';

export const orgsInitialState: OrdersState = {
    orders: [],
    apartOrders: [],
    isComplete: false,
    isLoading: false,
    selectedId: null,
    state: null,
    statistics: null,
    statisticsState: null,
    printState: null,
    printExcelSummaryState: null,
    attachmentsState: null,
    error: null
};

export function ordersReducer(
    state: OrdersState = orgsInitialState,
    action: OrdersActionUnion
): OrdersState {
    switch (action.type) {
        case OrdersActionType.OrdersRead: {
            let map = fromJS(state);
            if (action?.payload?.ids || state?.orders?.length > 0) {
                map = map.set('isLoading', true);
            } else {
                map = map.set('state', EntityState.Progress);
            }
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersReadSuccess: {
            let map = fromJS(state);
            let orders = map.get('orders').toJS() as VendorOrder[];
            let apartOrders = map.get('apartOrders').toJS() as VendorOrder[];
            let ordersIds = orders.map(o => o.id);
            if (action.payload.apart) {
                apartOrders.push(...action.payload.orders.filter(o => !ordersIds.includes(o.id)));
                apartOrders = uniqBy(apartOrders, 'id');
                map = map.set('apartOrders', apartOrders);
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
            }
            map = map.set('isLoading', false);
            if (!state.selectedId && orders.length > 0) {
                map = map.set('selectedId', orders[0].id);
            }
            map = map.set('state', orders.length > 0 ? EntityState.Data : EntityState.Empty);
            map = map.set('error', null);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersReadFailure:
        case OrdersActionType.OrdersCreateFailure:
        case OrdersActionType.OrdersUpdateFailure:
        case OrdersActionType.OrdersUpdateBatchFailure:
        case OrdersActionType.OrdersDeleteFailure: {
            let map = fromJS(state);
            map = map.set('state', EntityState.Error);
            map = map.set('error', action.payload);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersCreate:
        case OrdersActionType.OrdersUpdate:
        case OrdersActionType.OrdersUpdateBatch:
        case OrdersActionType.OrdersDelete: {
            let map = fromJS(state);
            map = map.set('isLoading', true);
            map = map.set('error', null);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersCreateSuccess: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as VendorOrder[];
            orders.splice(0, 0, action.payload.order);
            map = map.set('orders', orders);
            map = map.set('selectedId', orders[0].id);
            map = map.set('isLoading', false);
            map = map.set('state', EntityState.Data);
            map = map.set('error', null);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersUpdateSuccess: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as VendorOrder[];
            const apartOrders = map.get('apartOrders').toJS() as VendorOrder[];
            const oidx = orders.findIndex(o => o.id === action.payload.order.id);
            const aoidx = apartOrders.findIndex(o => o.id === action.payload.order.id);
            if (oidx >= 0) {
                orders[oidx] = action.payload.order;
            }
            if (aoidx >= 0) {
                apartOrders[aoidx] = action.payload.order;
            }
            map = map.set('orders', orders);
            map = map.set('apartOrders', apartOrders);
            map = map.set('isLoading', false);
            map = map.set('error', null);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersUpdateBatchSuccess: {
            let map = fromJS(state);
            return map.toJS() as OrdersState;
        }        

        case OrdersActionType.OrdersDeleteSuccess: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as VendorOrder[];
            const apartOrders = map.get('apartOrders').toJS() as VendorOrder[];
            const oidx = orders.findIndex(o => o.id === action.payload.id);
            const aoidx = apartOrders.findIndex(o => o.id === action.payload.id);
            if (oidx >= 0) {
                orders.splice(oidx, 1);
            }
            if (aoidx >= 0) {
                apartOrders.splice(aoidx, 1);
            }
            if (state.selectedId === action.payload.id && oidx >= 0) {
                if (orders.length > 0) {
                    map = map.set('selectedId', oidx >= orders.length ? orders[orders.length - 1].id : orders[oidx].id);
                } else {
                    map = map.set('state', EntityState.Empty);
                }
            }
            map = map.set('orders', orders);
            map = map.set('apartOrders', apartOrders);
            map = map.set('isLoading', false);
            map = map.set('error', null);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersSelect: {
            let map = fromJS(state);
            const orders = map.get('orders').toJS() as VendorOrder[];
            if (orders.findIndex(o => o.id === action.payload.id) >= 0) {
                map = map.set('selectedId', action.payload.id);
            }
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersReadStatistics: {
            let map = fromJS(state);
            map = map.set('statisticsState', EntityState.Progress);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersReadStatisticsSuccess: {
            let map = fromJS(state);
            map = map.set('statistics', action.payload.statistics);
            map = map.set('statisticsState', EntityState.Data);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersReadStatisticsFailure: {
            let map = fromJS(state);
            map = map.set('statisticsState', EntityState.Error);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersPrintPdf: {
            let map = fromJS(state);
            map = map.set('printState', EntityState.Progress);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersPrintPdfSuccess: {
            let map = fromJS(state);
            map = map.set('printState', EntityState.Data);
            var downloadURL = URL.createObjectURL(action.payload.blob);
            window.open(downloadURL);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersPrintPdfFailure: {
            let map = fromJS(state);
            map = map.set('printState', EntityState.Error);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersPrintExcelSummary: {
            let map = fromJS(state);
            map = map.set('printExcelSummaryState', EntityState.Progress);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersPrintExcelSummarySuccess: {
            let map = fromJS(state);
            map = map.set('printExcelSummaryState', EntityState.Data);
            var downloadURL = URL.createObjectURL(action.payload.blob);
            window.open(downloadURL);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersPrintExcelSummaryFailure: {
            let map = fromJS(state);
            map = map.set('printExcelSummaryState', EntityState.Error);
            return map.toJS() as OrdersState;
        }        

        case OrdersActionType.OrdersUploadAttachments: {
            let map = fromJS(state);
            map = map.set('attachmentsState', EntityState.Progress);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersUploadAttachmentsSuccess: {
            let map = fromJS(state);
            map = map.set('attachmentsState', EntityState.Data);
            const orders = map.get('orders').toJS() as VendorOrder[];
            const apartOrders = map.get('apartOrders').toJS() as VendorOrder[];
            const oidx = orders.findIndex(o => o.id === action.payload.order.id);
            const aoidx = apartOrders.findIndex(o => o.id === action.payload.order.id);
            if (oidx >= 0) {
                orders[oidx] = action.payload.order;
            }
            if (aoidx >= 0) {
                apartOrders[aoidx] = action.payload.order;
            }
            map = map.set('orders', orders);
            map = map.set('apartOrders', apartOrders);
            map = map.set('isLoading', false);
            map = map.set('error', null);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersUploadAttachmentsFailure: {
            let map = fromJS(state);
            map = map.set('attachmentsState', EntityState.Error);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersDownloadAttachment: {
            let map = fromJS(state);
            map = map.set('attachmentsState', EntityState.Progress);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersDownloadAttachmentSuccess: {
            let map = fromJS(state);
            map = map.set('attachmentsState', EntityState.Data);
            var downloadURL = URL.createObjectURL(action.payload.blob);
            window.open(downloadURL);
            return map.toJS() as OrdersState;
        }

        case OrdersActionType.OrdersDownloadAttachmentFailure: {
            let map = fromJS(state);
            map = map.set('attachmentsState', EntityState.Error);
            return map.toJS() as OrdersState;
        }

        default: {
            return state;
        }
    }
}
