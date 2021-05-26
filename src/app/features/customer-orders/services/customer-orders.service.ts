import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import uniqBy from 'lodash-es/uniqBy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { EntityState, Filter } from '../../../common/models';
import { CustomerOrder, CustomerOrderDetails } from './../../../common/models/index';
import {
    CustomerOrderReadOneAction, CustomerOrdersCreateAction, CustomerOrdersDeleteAction,
    CustomerOrdersReadAction, CustomerOrdersSelectAction, CustomerOrdersUpdateAction, CustomerOrdersPrintPdfAction
} from '../store/orders.actions';
import {
    getCustomerAllOrders, getCustomerApartOrders, getCustomerOrderDetails,
    getCustomerOrderErrorDetails, getCustomerOrders, getCustomerOrdersError,
    getCustomerOrdersIsComplete, getCustomerOrdersIsLoading, getCustomerOrdersSelectedId,
    getCustomerOrdersSelectedItem, getCustomerOrdersState, getCustomerOrdersStoreState,
    getCustomerOrderStateDetails,
    getCustomerOrdersPrintState
} from '../store/orders.state';

@Injectable()
export class CustomerOrdersService {

    private _disposed$ = new Subject();

    constructor(
        private store: Store
    ) { }

    public dispose(): void {
        this._disposed$.next();
        this._disposed$.complete();
    }

    public get customerOrders$(): Observable<CustomerOrder[]> {
        return this.store.select(getCustomerOrders);
    }

    public get apartOrders$(): Observable<CustomerOrder[]> {
        return this.store.select(getCustomerApartOrders);
    }

    public get isComplete$(): Observable<boolean> {
        return this.store.select(getCustomerOrdersIsComplete);
    }

    public get isLoading$(): Observable<boolean> {
        return this.store.select(getCustomerOrdersIsLoading);
    }

    public get selectedItem$(): Observable<CustomerOrder> {
        return this.store.select(getCustomerOrdersSelectedItem);
    }

    public get selectedId$(): Observable<string> {
        return this.store.select(getCustomerOrdersSelectedId);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getCustomerOrdersState);
    }

    public get printState$(): Observable<EntityState> {
        return this.store.select(getCustomerOrdersPrintState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getCustomerOrdersError);
    }

    public get orderDetails$(): Observable<CustomerOrderDetails> {
        return this.store.select(getCustomerOrderDetails);
    }

    public get stateDetails$(): Observable<EntityState> {
        return this.store.select(getCustomerOrderStateDetails);
    }

    public get errorDetails$(): Observable<any> {
        return this.store.select(getCustomerOrderErrorDetails);
    }

    // public initOnce(filter: Filter): Observable<void> {
    //     return this.store.select(getCustomerOrdersState).pipe(
    //         take(1),
    //         map(state => {
    //             if (state === null) {
    //                 this.store.dispatch(new CustomerOrdersReadAction({ filter }));
    //             }
    //         })
    //     );
    // }

    public ordersByIds(customerOrdersIds: string[] = []): Observable<CustomerOrder[]> {
        return this.store.select(getCustomerAllOrders).pipe(
            distinctUntilChanged((a, b) => a.length === b.length),
            map(orders => {
                let res = [];
                res.push(...orders.filter(o => customerOrdersIds.includes(o.id)));
                res = uniqBy(res, 'id');
                if (res.length !== customerOrdersIds.length) {
                    const ids = customerOrdersIds.filter(id => !res.some(o => o.id === id));
                    this.store.dispatch(new CustomerOrdersReadAction({ ids }));
                }
                return res;
            })
        );
    }

    public orderWithDetails(customerOrderId: string): Observable<CustomerOrderDetails> {
        return this.store.select(getCustomerOrderDetails).pipe(
            distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
            map(details => {
                if (!details || !details.order || details.order.id !== customerOrderId) {
                    this.readOne(customerOrderId);
                    return null;
                } else {
                    return details;
                }
            })
        );
    }

    public read(filter: Filter, skip: number = 0, customTake?: number): void {
        this.store.dispatch(new CustomerOrdersReadAction({ filter, skip, take: customTake }));
    }

    public readMore(filter: Filter): void {
        this.store.select(getCustomerOrdersStoreState).pipe(
            takeUntil(this._disposed$),
            take(1),
            map(state => {
                if (!state.isComplete && !state.isLoading) {
                    this.store.dispatch(new CustomerOrdersReadAction({ filter, skip: state.orders.length }));
                }
            })
        ).subscribe();
    }

    public selectById(id: string): void {
        this.store.dispatch(new CustomerOrdersSelectAction({ id }));
    }

    public readOne(id: string): void {
        this.store.dispatch(new CustomerOrderReadOneAction({ id }));
    }

    public create(order: CustomerOrder, vendorOrderId?: string, preventNavigation?: boolean): void {
        this.store.dispatch(new CustomerOrdersCreateAction({ order, vendorOrderId, preventNavigation }));
    }

    public update(order: CustomerOrder, vendorOrderId?: string, preventNavigation?: boolean): void {
        this.store.dispatch(new CustomerOrdersUpdateAction({ order, vendorOrderId, preventNavigation }));
    }

    public delete(id: string, preventNavigation?: boolean): void {
        this.store.dispatch(new CustomerOrdersDeleteAction({ id, preventNavigation }));
    }

    public printPdf(id: string, version: string, preventNavigation?: boolean): void {
        this.store.dispatch(new CustomerOrdersPrintPdfAction({ id, version, preventNavigation }));
    }
}
