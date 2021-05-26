import get from 'lodash-es/get';
import assign from 'lodash-es/assign';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import cloneDeep from 'lodash-es/cloneDeep';
import { empty, from, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import {Location } from '@angular/common';

import { Filter } from '../../../common/models/Filter';
import { AppSettingsService } from '../../../common/services/appsettings.service';
import { CustomerOrdersDataService } from '../services/customer-orders.data.service';
import { OrdersService } from './../../orders/services/orders.service';
import { OrdersActionType, OrdersUpdateFailureAction, OrdersUpdateSuccessAction } from './../../orders/store/orders.actions';
import * as fromOrdersActions from './orders.actions';



@Injectable()
export class CustomerOrdersEffects implements OnInitEffects {
    constructor(
        private actions$: Actions,
        private ass: AppSettingsService,
        private ds: CustomerOrdersDataService,
        private route: ActivatedRoute,
        private router: Router,
        private vendorOrdersService: OrdersService,
        private location: Location
    ) { }

    @Effect() readOrders$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.CustomerOrdersActionType.OrdersRead),
        switchMap((action: fromOrdersActions.CustomerOrdersReadAction) => {
            const insert: boolean = action?.payload?.skip !== 0;
            let f: Filter = action?.payload?.filter ?? null;
            if (action?.payload?.ids) {
                if (f) {
                    f.ids = action?.payload?.ids;
                } else {
                    f = new Filter({
                        ids: action?.payload?.ids
                    });
                }

            }
            return this.ds.readOrders(action?.payload?.skip ?? 0, null, f).pipe(
                switchMap(dp => {
                    const actions: Action[] = [new fromOrdersActions.CustomerOrdersReadSuccessAction({
                        orders: dp.data,
                        insert,
                        isComplete: dp?.data?.length !== this.ass.getProperty(['services', 'orders.data', 'defaults', 'take'], 10)
                            || !dp?.data?.length,
                        apart: action.payload.ids?.length > 0
                    })];
                    const id = this.route.snapshot.queryParamMap.get('id');
                    if (id) {
                        actions.push(new fromOrdersActions.CustomerOrdersSelectAction({ id }));
                    }
                    return actions;
                }),
                catchError(error => of(new fromOrdersActions.CustomerOrdersReadFailureAction({ error })))
            );
        })
    );

    @Effect() readOrderOne$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.CustomerOrdersActionType.OrderReadOne),
        switchMap((action: fromOrdersActions.CustomerOrderReadOneAction) => {
            return this.ds.readOrder(action.payload.id).pipe(
                map(od => new fromOrdersActions.CustomerOrderReadOneSuccessAction({
                    orderDetails: od
                })),
                catchError(error => of(new fromOrdersActions.CustomerOrderReadOneFailureAction({ error })))
            );
        })
    );

    @Effect() createOrder$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.CustomerOrdersActionType.OrderCreate),
        switchMap((action: fromOrdersActions.CustomerOrdersCreateAction) => {
            return this.ds.createOrder(action.payload.order).pipe(
                map(details => new fromOrdersActions.CustomerOrdersCreateSuccessAction({
                    order: details.order,
                    vendorOrderId: action.payload.vendorOrderId, preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.CustomerOrdersCreateFailureAction({ error })))
            );
        })
    );

    @Effect() updateOrder$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.CustomerOrdersActionType.OrderUpdate),
        switchMap((action: fromOrdersActions.CustomerOrdersUpdateAction) => {
            return this.ds.updateOrder(action.payload.order).pipe(
                map(order => new fromOrdersActions.CustomerOrdersUpdateSuccessAction({ order, vendorOrderId: action.payload.vendorOrderId, preventNavigation: action.payload.preventNavigation })),
                catchError(error => of(new fromOrdersActions.CustomerOrdersUpdateFailureAction({ error })))
            );
        })
    );

    @Effect() deleteOrder$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.CustomerOrdersActionType.OrderDelete),
        switchMap((action: fromOrdersActions.CustomerOrdersDeleteAction) => {
            return this.ds.deleteOrder(action.payload.id).pipe(
                map(() => new fromOrdersActions.CustomerOrdersDeleteSuccessAction({ id: action.payload.id, preventNavigation: action.payload.preventNavigation })),
                catchError(error => of(new fromOrdersActions.CustomerOrdersDeleteFailureAction({ error })))
            );
        })
    );

    @Effect({ dispatch: false }) updateVendorOrder$: Observable<boolean> = this.actions$.pipe(
        ofType(
            fromOrdersActions.CustomerOrdersActionType.OrderCreateSuccess,
            fromOrdersActions.CustomerOrdersActionType.OrderUpdateSuccess
        ),
        switchMap((action: fromOrdersActions.CustomerOrdersCreateSuccessAction) => {
            if (action.payload.vendorOrderId) {
                return this.vendorOrdersService.ordersByIds([action.payload.vendorOrderId]).pipe(
                    filter(orders => orders && orders.length > 0),
                    switchMap(orders => {
                        const order = cloneDeep(orders[0]);
                        this.vendorOrdersService.updateInStore(order);
                        return this.actions$.pipe(
                            ofType(
                                OrdersActionType.OrdersUpdateSuccess,
                                OrdersActionType.OrdersUpdateFailure
                            ),
                            take(1),
                            switchMap((act2: OrdersUpdateSuccessAction | OrdersUpdateFailureAction) => {
                                if (act2 instanceof OrdersUpdateSuccessAction) {
                                    return from(this.router.navigate(['envelopes'], {queryParams: {id: action.payload.vendorOrderId}}));
                                } else {
                                    // TODO: show something?
                                    return empty();
                                }
                            })
                        );
                    })
                );
            } else {
                return from(this.router.navigate(['customer_orders']));
            }
        })
    );

    @Effect() printPdf$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.CustomerOrdersActionType.OrdersPrintPdf),
        switchMap((action: fromOrdersActions.CustomerOrdersPrintPdfAction) => {
            return this.ds.printPdf(action.payload.id, action.payload.version).pipe(
                map(blob => new fromOrdersActions.CustomerOrdersPrintPdfSuccessAction({
                    blob,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.CustomerOrdersPrintPdfFailureAction({ error })))
            );
        })
    );

    @Effect({ dispatch: false }) navigateToList$: Observable<boolean> = this.actions$.pipe(
        ofType(
            fromOrdersActions.CustomerOrdersActionType.OrderUpdateSuccess,
            fromOrdersActions.CustomerOrdersActionType.OrderDeleteSuccess,
            fromOrdersActions.CustomerOrdersActionType.OrdersPrintPdfSuccess
        ),
        filter((action: fromOrdersActions.CustomerOrdersUpdateSuccessAction | fromOrdersActions.CustomerOrdersDeleteSuccessAction | fromOrdersActions.CustomerOrdersPrintPdfSuccessAction) => !action.payload.preventNavigation),
        switchMap(() => from(this.router.navigate(['customer_orders'])))
    );

    ngrxOnInitEffects(): Action {
        const locationPath = this.location.path() || '';
        const filterString = decodeURIComponent(locationPath.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('filter').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        let ft: Filter;
        if (filterString) {
            ft = new Filter(filterString);
        }

        return new fromOrdersActions.CustomerOrdersReadAction({ filter: ft });
    }
}
