import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CustomerOrder, CustomerOrderDetails, EntityState } from '../../../common/index';

// TODO: Separete by two store??
export interface CustomerOrdersState {
    orders: CustomerOrder[];
    orderDetails: CustomerOrderDetails;
    apartOrders: CustomerOrder[];
    isComplete: boolean;
    isLoading: boolean;
    selectedId: string;
    state: EntityState;
    stateDetails: EntityState;
    printState: EntityState;
    error: any;
    errorDetails: any;
}

export const getCustomerOrdersStoreState = createFeatureSelector<CustomerOrdersState>('customer-orders');

export const getCustomerOrders = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.orders);
export const getCustomerOrderDetails = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.orderDetails);
export const getCustomerApartOrders = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.apartOrders);
export const getCustomerAllOrders = createSelector(getCustomerOrdersStoreState,
    (state: CustomerOrdersState) => [...state.orders, ...state.apartOrders]);
export const getCustomerOrdersIsComplete = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.isComplete);
export const getCustomerOrdersIsLoading = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.isLoading);
export const getCustomerOrdersSelectedId = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.selectedId);
export const getCustomerOrdersState = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.state);
export const getCustomerOrdersPrintState = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.printState);
export const getCustomerOrderStateDetails = createSelector(getCustomerOrdersStoreState,
    (state: CustomerOrdersState) => state.stateDetails);
export const getCustomerOrdersError = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => state.error);
export const getCustomerOrderErrorDetails = createSelector(getCustomerOrdersStoreState,
    (state: CustomerOrdersState) => state.errorDetails);
export const getCustomerOrdersSelectedItem = createSelector(getCustomerOrdersStoreState, (state: CustomerOrdersState) => {
    if (state.orders.length < 1) { return null; }
    const idx = state.orders.findIndex(o => o.id === state.selectedId);
    return idx >= 0 ? state.orders[idx] : null;
});
