import clamp from 'lodash-es/clamp';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EntityState, Organization } from '../../../common/index';

export interface OrganizationsState {
    organizations: Organization[];
    isComplete: boolean;
    isLoading: boolean;
    selectedId: string;
    selectedIdx: number;
    state: EntityState;
    error: any;
}

export const getOrganizationsStoreState = createFeatureSelector<OrganizationsState>('organizations');

export const getOrganizations = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.organizations);
export const getOrganizationsIsComplete = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.isComplete);
export const getOrganizationsIsLoading = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.isLoading);
export const getOrganizationsSelectedId = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.selectedId);
export const getOrganizationsState = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.state);
export const getOrganizationsError = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => state.error);
export const getOrganizationsSelectedIdx = createSelector(getOrganizationsStoreState, (state: OrganizationsState) => {
    if (!state || !state.organizations || !state.organizations.length) { return -1; }
    const idx = state.organizations.findIndex(s => s.id === state.selectedId);
    return idx >= 0 ? idx : -1;
});
export const getOrganizationsSelectedItem = createSelector(getOrganizationsStoreState, getOrganizationsSelectedIdx, (state, idx) => {
    return idx < 0 ? null : state.organizations[idx];
});
