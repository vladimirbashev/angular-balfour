import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EntityState, VendorOrder, VendorOrderStatistics } from '../../../common/index';

export interface OrdersState {
    orders: VendorOrder[];
    apartOrders: VendorOrder[];
    isComplete: boolean;
    isLoading: boolean;
    selectedId: string;
    state: EntityState;
    statistics: VendorOrderStatistics;
    statisticsState: EntityState;
    printState: EntityState;
    printExcelSummaryState: EntityState;
    attachmentsState: EntityState;
    error: any;
}

export const getOrdersStoreState = createFeatureSelector<OrdersState>('orders');

export const getOrders = createSelector(getOrdersStoreState, (state: OrdersState) => state.orders);
export const getApartOrders = createSelector(getOrdersStoreState, (state: OrdersState) => state.apartOrders);
export const getAllOrders = createSelector(getOrdersStoreState, (state: OrdersState) => ([...state.orders, ...state.apartOrders]));
export const getOrdersIsComplete = createSelector(getOrdersStoreState, (state: OrdersState) => state.isComplete);
export const getOrdersIsLoading = createSelector(getOrdersStoreState, (state: OrdersState) => state.isLoading);
export const getOrdersSelectedId = createSelector(getOrdersStoreState, (state: OrdersState) => state.selectedId);
export const getOrdersState = createSelector(getOrdersStoreState, (state: OrdersState) => state.state);
export const getOrdersStatistics = createSelector(getOrdersStoreState, (state: OrdersState) => state.statistics);
export const getOrdersStatisticsState = createSelector(getOrdersStoreState, (state: OrdersState) => state.statisticsState);
export const getOrdersPrintState = createSelector(getOrdersStoreState, (state: OrdersState) => state.printState);
export const getOrdersPrintExcelSummaryState = createSelector(getOrdersStoreState, (state: OrdersState) => state.printExcelSummaryState);
export const getOrdersAttachmentsState = createSelector(getOrdersStoreState, (state: OrdersState) => state.attachmentsState);
export const getOrdersError = createSelector(getOrdersStoreState, (state: OrdersState) => state.error);
export const getOrdersSelectedItem = createSelector(getOrdersStoreState, (state: OrdersState) => {
    if (state.orders.length < 1) { return null; }
    const idx = state.orders.findIndex(o => o.id === state.selectedId);
    return idx >= 0 ? state.orders[idx] : null;
});
