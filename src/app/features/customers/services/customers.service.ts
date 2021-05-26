import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { EntityState, Filter } from '../../../common/models';
import { Customer } from '../../../common/models/index';
import {
    CustomersCreateInitAction, CustomersDeleteInitAction, CustomersReadAction,
    CustomersSelectAction, CustomersSelectIdAction, CustomersSetStateAction,
    CustomersUpdateInitAction
} from '../store/customers.actions';
import {
    getCustomers, getCustomersError, getCustomersIsComplete, getCustomersIsLoading,
    getCustomersSelectedId, getCustomersSelectedIdx, getCustomersSelectedItem, getCustomersState,
    getCustomersStoreState
} from '../store/customers.state';

@Injectable()
export class CustomersService {

    private _disposed$ = new Subject();

    constructor(
        private store: Store
    ) { }

    public dispose(): void {
        this._disposed$.next();
        this._disposed$.complete();
    }

    public get customers$(): Observable<Customer[]> {
        return this.store.select(getCustomers);
    }

    public get isComplete$(): Observable<boolean> {
        return this.store.select(getCustomersIsComplete);
    }

    public get isLoading$(): Observable<boolean> {
        return this.store.select(getCustomersIsLoading);
    }

    public get selectedId$(): Observable<string> {
        return this.store.select(getCustomersSelectedId);
    }

    public get selectedIdx$(): Observable<number> {
        return this.store.select(getCustomersSelectedIdx);
    }

    public get selectedItem$(): Observable<Customer> {
        return this.store.select(getCustomersSelectedItem)
            .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getCustomersState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getCustomersError);
    }

    public read(filter: Filter = null, skip: number = 0, customTake?: number): void {
        this.store.dispatch(new CustomersReadAction({ filter, skip, take: customTake }));
    }

    public readMore(filter: Filter = null): void {
        this.store.select(getCustomersStoreState).pipe(
            takeUntil(this._disposed$),
            take(1),
            map(state => {
                if (!state.isComplete && !state.isLoading) {
                    this.store.dispatch(new CustomersReadAction({ filter, skip: state.customers.length }));
                }
            })
        ).subscribe();
    }

    public selectById(id: string): void {
        this.store.dispatch(new CustomersSelectIdAction({ id }));
    }

    public selectByIdx(idx: number): void {
        this.store.dispatch(new CustomersSelectAction({ idx }));
    }


    public createCustomer(customer: Customer): void {
        this.store.dispatch(new CustomersCreateInitAction({ customer }));
    }

    public updateCustomer(id: string, customer: Customer): void {
        this.store.dispatch(new CustomersUpdateInitAction({ id, customer }));
    }

    public deleteCustomer(id: string): void {
        this.store.dispatch(new CustomersDeleteInitAction({ id }));
    }

    public resetState(): void {
        this.customers$
            .pipe(take(1))
            .subscribe(rs => {
                this.setState(!rs || !rs.length ? EntityState.Empty : EntityState.Data);
            });
    }

    public setState(state: EntityState): void {
        this.store.dispatch(new CustomersSetStateAction({ state }));
    }
}
