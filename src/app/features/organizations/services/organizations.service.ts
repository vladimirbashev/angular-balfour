import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { EntityState, Filter } from '../../../common/models';
import { Organization } from '../../../common/models/index';
import {
    OrganizationsCreateInitAction, OrganizationsDeleteInitAction, OrganizationsReadAction,
    OrganizationsSelectAction, OrganizationsSelectIdAction, OrganizationsSetStateAction,
    OrganizationsUpdateInitAction
} from '../store/organizations.actions';
import {
    getOrganizations, getOrganizationsError, getOrganizationsIsComplete, getOrganizationsIsLoading,
    getOrganizationsSelectedId, getOrganizationsSelectedIdx, getOrganizationsSelectedItem,
    getOrganizationsState, getOrganizationsStoreState
} from '../store/organizations.state';

@Injectable()
export class OrganizationsService {

    private _disposed$ = new Subject();

    constructor(
        private store: Store
    ) { }

    public dispose(): void {
        this._disposed$.next();
        this._disposed$.complete();
    }

    public get organizations$(): Observable<Organization[]> {
        return this.store.select(getOrganizations);
    }

    public get isComplete$(): Observable<boolean> {
        return this.store.select(getOrganizationsIsComplete);
    }

    public get isLoading$(): Observable<boolean> {
        return this.store.select(getOrganizationsIsLoading);
    }

    public get selectedId$(): Observable<string> {
        return this.store.select(getOrganizationsSelectedId);
    }

    public get selectedIdx$(): Observable<number> {
        return this.store.select(getOrganizationsSelectedIdx);
    }

    public get selectedItem$(): Observable<Organization> {
        return this.store.select(getOrganizationsSelectedItem)
            .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getOrganizationsState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getOrganizationsError);
    }

    public read(filter: Filter = null, skip: number = 0, customTake?: number, params?: any): void {
        this.store.dispatch(new OrganizationsReadAction({ filter, skip, take: customTake, params }));
    }

    public readMore(filter: Filter = null, params?: any): void {
        this.store.select(getOrganizationsStoreState).pipe(
            takeUntil(this._disposed$),
            take(1),
            map(state => {
                if (!state.isComplete && !state.isLoading) {
                    this.store.dispatch(new OrganizationsReadAction({ filter, skip: state.organizations.length, params }));
                }
            })
        ).subscribe();
    }

    public selectById(id: string): void {
        this.store.dispatch(new OrganizationsSelectIdAction({ id }));
    }

    public selectByIdx(idx: number): void {
        this.store.dispatch(new OrganizationsSelectAction({ idx }));
    }

    public createOrganization(organization: Organization): void {
        this.store.dispatch(new OrganizationsCreateInitAction({ organization }));
    }

    public updateOrganization(id: string, organization: Organization): void {
        this.store.dispatch(new OrganizationsUpdateInitAction({ id, organization }));
    }

    public deleteOrganization(id: string): void {
        this.store.dispatch(new OrganizationsDeleteInitAction({ id }));
    }

    public resetState(): void {
        this.organizations$
            .pipe(take(1))
            .subscribe(rs => {
                this.setState(!rs || !rs.length ? EntityState.Empty : EntityState.Data);
            });
    }

    public setState(state: EntityState): void {
        this.store.dispatch(new OrganizationsSetStateAction({ state }));
    }
}
