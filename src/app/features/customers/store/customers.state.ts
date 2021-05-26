import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Customer, EntityState } from '../../../common/index';

export interface CustomersState {
    customers: Customer[];
    isComplete: boolean;
    isLoading: boolean;
    selectedId: string;
    selectedIdx: number;
    state: EntityState;
    error: any;
}

export const getCustomersStoreState = createFeatureSelector<CustomersState>('customers');

export const getCustomers = createSelector(getCustomersStoreState, (state: CustomersState) => state.customers);
export const getCustomersIsComplete = createSelector(getCustomersStoreState, (state: CustomersState) => state.isComplete);
export const getCustomersIsLoading = createSelector(getCustomersStoreState, (state: CustomersState) => state.isLoading);
export const getCustomersSelectedId = createSelector(getCustomersStoreState, (state: CustomersState) => state.selectedId);
export const getCustomersState = createSelector(getCustomersStoreState, (state: CustomersState) => state.state);
export const getCustomersError = createSelector(getCustomersStoreState, (state: CustomersState) => state.error);
export const getCustomersSelectedIdx = createSelector(getCustomersStoreState, (state: CustomersState) => {
    if (!state || !state.customers || !state.customers.length) { return -1; }
    const idx = state.customers.findIndex(s => s.id === state.selectedId);
    return idx >= 0 ? idx : -1;
});
export const getCustomersSelectedItem = createSelector(getCustomersStoreState, getCustomersSelectedIdx, (state, idx) => {
    return idx < 0 ? null : state.customers[idx];
});
