import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import uniqBy from 'lodash-es/uniqBy';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { EntityState, Filter, VendorOrder, VendorOrderStatistics } from '../../../common/models';
import {
    OrdersCreateAction, OrdersDeleteAction, OrdersReadAction, OrdersReadStatisticsAction,
    OrdersSelectAction, OrdersUpdateAction, OrdersUpdateSuccessAction, OrdersPrintPdfAction, OrdersUploadAttachmentsSuccessAction, OrdersUploadAttachmentsAction, OrdersDownloadAttachmentAction, OrdersPrintExcelSummaryAction, OrdersUpdateBatchAction
} from '../store/orders.actions';
import {
    getAllOrders, getApartOrders, getOrders, getOrdersError, getOrdersIsComplete,
    getOrdersIsLoading, getOrdersSelectedId, getOrdersSelectedItem, getOrdersState,
    getOrdersStatistics, getOrdersStatisticsState, getOrdersStoreState, getOrdersPrintState, getOrdersAttachmentsState, getOrdersPrintExcelSummaryState
} from '../store/orders.state';



@Injectable()
export class OrdersService {

    private _disposed$ = new Subject();

    constructor(
        private store: Store
    ) { }

    public dispose(): void {
        this._disposed$.next();
        this._disposed$.complete();
    }

    public get orders$(): Observable<VendorOrder[]> {
        return this.store.select(getOrders);
    }

    public get apartOrders$(): Observable<VendorOrder[]> {
        return this.store.select(getApartOrders);
    }

    public get isComplete$(): Observable<boolean> {
        return this.store.select(getOrdersIsComplete);
    }

    public get isLoading$(): Observable<boolean> {
        return this.store.select(getOrdersIsLoading);
    }

    public get selectedId$(): Observable<string> {
        return this.store.select(getOrdersSelectedId);
    }

    public get selectedItem$(): Observable<VendorOrder> {
        return this.store.select(getOrdersSelectedItem);
    }

    public get state$(): Observable<EntityState> {
        return this.store.select(getOrdersState);
    }

    public get statistics$(): Observable<VendorOrderStatistics> {
        return this.store.select(getOrdersStatistics);
    }

    public get statisticsState$(): Observable<EntityState> {
        return this.store.select(getOrdersStatisticsState);
    }

    public get printState$(): Observable<EntityState> {
        return this.store.select(getOrdersPrintState);
    }

    public get printExcelSummaryState$(): Observable<EntityState> {
        return this.store.select(getOrdersPrintExcelSummaryState);
    }

    public get attachmentsState$(): Observable<EntityState> {
        return this.store.select(getOrdersAttachmentsState);
    }

    public get error$(): Observable<any> {
        return this.store.select(getOrdersError);
    }

    // public initOnce(): Observable<void> {
    //     return this.store.select(getOrdersState).pipe(
    //         takeUntil(this._disposed$),
    //         take(1),
    //         map(state => {
    //             if (state === null) {
    //                 this.store.dispatch(new OrdersReadAction({}));
    //             }
    //         })
    //     );
    // }

    public ordersByIds(vendorOrdersIds: string[] = []): Observable<VendorOrder[]> {
        return this.store.select(getAllOrders).pipe(
            distinctUntilChanged((a, b) => a.length === b.length),
            map(orders => {
                let res = [];
                res.push(...orders.filter(o => vendorOrdersIds.includes(o.id)));
                res = uniqBy(res, 'id');
                if (res.length !== vendorOrdersIds.length) {
                    const ids = vendorOrdersIds.filter(id => !res.some(o => o.id === id));
                    this.store.dispatch(new OrdersReadAction({ ids }));
                }
                return res;
            })
        );
    }

    public read(filter: Filter = null, skip: number = 0, customTake?: number): void {
        this.store.dispatch(new OrdersReadAction({ filter, skip, take: customTake }));
    }

    public readMore(filter: Filter = null): void {
        this.store.select(getOrdersStoreState).pipe(
            takeUntil(this._disposed$),
            take(1),
            map(state => {
                if (!state.isComplete && !state.isLoading) {
                    this.store.dispatch(new OrdersReadAction({ filter, skip: state.orders.length }));
                }
            })
        ).subscribe();
    }

    public readStatistics(): void {
        this.store.dispatch(new OrdersReadStatisticsAction());
    }

    public create(order: VendorOrder): void {
        this.store.dispatch(new OrdersCreateAction({ order }));
    }

    public update(order: VendorOrder): void {
        this.store.dispatch(new OrdersUpdateAction({ order }));
    }

    public updateInStore(order: VendorOrder): void {
        this.store.dispatch(new OrdersUpdateSuccessAction({ order }));
    }

    public updateOrders(ids: string[], status: string, assignee_id?: string): void {
        this.store.dispatch(new OrdersUpdateBatchAction({ ids, status, assignee_id }));
    }    

    public delete(id: string): void {
        this.store.dispatch(new OrdersDeleteAction({ id }));
    }

    public selectById(id: string): void {
        this.store.dispatch(new OrdersSelectAction({ id }));
    }

    public printPdf(id: string, version: string): void {
        this.store.dispatch(new OrdersPrintPdfAction({ id, version }));
    }

    public printExcelSummary(status: string): void {
        this.store.dispatch(new OrdersPrintExcelSummaryAction({ status }));
    }

    public uploadAttachments(order: VendorOrder):void {
        this.store.dispatch(new OrdersUploadAttachmentsAction({ order }));
    }

    public downloadAttachment(blobId: string):void {
        this.store.dispatch(new OrdersDownloadAttachmentAction({ id: blobId }));
    }
}
