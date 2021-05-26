import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, first, map, switchMap } from 'rxjs/operators';
import {Location } from '@angular/common';

import { Filter } from '../../../common/models/Filter';
import { AppSettingsService } from '../../../common/services/appsettings.service';
import { OrdersDataService } from '../services/orders.data.service';
import * as fromOrdersActions from './orders.actions';

@Injectable()
export class OrdersEffects implements OnInitEffects {
    constructor(
        private actions$: Actions,
        private ass: AppSettingsService,
        private ds: OrdersDataService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location
    ) { }

    // @Effect() readInit$: Observable<Action> = this.actions$.pipe(
    //     first(),
    //     map(() => new fromOrdersActions.OrdersReadAction())
    // );

    @Effect() readOrders$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersRead),
        switchMap((action: fromOrdersActions.OrdersReadAction) => {
            const insert: boolean = action?.payload?.skip > 0;
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
                    const actions: Action[] = [new fromOrdersActions.OrdersReadSuccessAction({
                        orders: dp.data,
                        insert,
                        isComplete: dp?.data?.length !== this.ass.getProperty(['services', 'orders.data', 'defaults', 'take'], 10)
                            || !dp?.data?.length,
                        apart: action?.payload?.ids?.length > 0
                    })];
                    const id = this.route.snapshot.queryParamMap.get('id');
                    if (id) {
                        actions.push(new fromOrdersActions.OrdersSelectAction({ id }));
                    }
                    return actions;
                }),
                catchError(error => of(new fromOrdersActions.OrdersReadFailureAction({ error })))
            );
        })
    );

    @Effect() readStatistics$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersReadStatistics),
        switchMap(action => this.ds.readStatistics().pipe(
            map(statistics => new fromOrdersActions.OrdersReadStatisticsSuccessAction({ statistics })),
            catchError(error => of(new fromOrdersActions.OrdersReadStatisticsFailureAction({ error })))
        ))
    );

    @Effect() createOrder$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersCreate),
        switchMap((action: fromOrdersActions.OrdersCreateAction) => {
            return this.ds.createOrder(action.payload.order).pipe(
                map(order => new fromOrdersActions.OrdersCreateSuccessAction({
                    order,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersCreateFailureAction({ error })))
            );
        })
    );

    @Effect() updateOrder$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersUpdate),
        switchMap((action: fromOrdersActions.OrdersUpdateAction) => {
            return this.ds.updateOrder(action.payload.order).pipe(
                map(order => new fromOrdersActions.OrdersUpdateSuccessAction({
                    order,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersUpdateFailureAction({ error })))
            );
        })
    );

    @Effect() updateOrders$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersUpdateBatch),
        switchMap((action: fromOrdersActions.OrdersUpdateBatchAction) => {
            return this.ds.updateOrders(action.payload.ids, action.payload.status, action.payload.assignee_id).pipe(
                map(ids => new fromOrdersActions.OrdersUpdateBatchSuccessAction({
                    ids,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersUpdateBatchFailureAction({ error })))
            );
        })
    );    

    @Effect() deleteOrder$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersDelete),
        switchMap((action: fromOrdersActions.OrdersDeleteAction) => {
            return this.ds.deleteOrder(action.payload.id).pipe(
                map(() => new fromOrdersActions.OrdersDeleteSuccessAction({
                    id: action.payload.id,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersDeleteFailureAction({ error })))
            );
        })
    );

    @Effect() printPdf$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersPrintPdf),
        switchMap((action: fromOrdersActions.OrdersPrintPdfAction) => {
            return this.ds.printPdf(action.payload.id, action.payload.version).pipe(
                map(blob => new fromOrdersActions.OrdersPrintPdfSuccessAction({
                    blob,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersPrintPdfFailureAction({ error })))
            );
        })
    );

    @Effect() printExcelSummary$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersPrintExcelSummary),
        switchMap((action: fromOrdersActions.OrdersPrintExcelSummaryAction) => {
            return this.ds.printExcelSummary(action.payload.status).pipe(
                map(blob => new fromOrdersActions.OrdersPrintExcelSummarySuccessAction({
                    blob,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersPrintExcelSummaryFailureAction({ error })))
            );
        })
    );    

    @Effect() downloadAttachment$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersDownloadAttachment),
        switchMap((action: fromOrdersActions.OrdersDownloadAttachmentAction) => {
            return this.ds.downloadAttachment(action.payload.id).pipe(
                map(blob => new fromOrdersActions.OrdersDownloadAttachmentSuccessAction({
                    blob,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersDownloadAttachmentFailureAction({ error })))
            );
        })
    );

    @Effect() uploadAttachments$: Observable<Action> = this.actions$.pipe(
        ofType(fromOrdersActions.OrdersActionType.OrdersUploadAttachments),
        switchMap((action: fromOrdersActions.OrdersUploadAttachmentsAction) => {
            return this.ds.uploadAttachments(action.payload.order).pipe(
                map(order => new fromOrdersActions.OrdersUploadAttachmentsSuccessAction({
                    order,
                    preventNavigation: action.payload.preventNavigation
                })),
                catchError(error => of(new fromOrdersActions.OrdersUploadAttachmentsFailureAction({ error })))
            );
        })
    );

    @Effect({ dispatch: false }) navigateToList$: Observable<boolean> = this.actions$.pipe(
        ofType(
            fromOrdersActions.OrdersActionType.OrdersCreateSuccess,
            fromOrdersActions.OrdersActionType.OrdersUpdateSuccess,
            fromOrdersActions.OrdersActionType.OrdersDeleteSuccess,
            fromOrdersActions.OrdersActionType.OrdersPrintPdfSuccess,
            fromOrdersActions.OrdersActionType.OrdersUploadAttachmentsSuccess,
            fromOrdersActions.OrdersActionType.OrdersDownloadAttachmentSuccess
        ),
        filter((action: fromOrdersActions.OrdersCreateSuccessAction
            | fromOrdersActions.OrdersUpdateSuccessAction
            | fromOrdersActions.OrdersDeleteSuccessAction
            | fromOrdersActions.OrdersPrintPdfSuccessAction
            | fromOrdersActions.OrdersUploadAttachmentsSuccessAction
            | fromOrdersActions.OrdersDownloadAttachmentSuccessAction) => !action.payload.preventNavigation),
        switchMap(() => from(this.router.navigate(['envelopes'])))
    );

    ngrxOnInitEffects(): Action {
        const locationPath = this.location.path() || '';
        const filterString = decodeURIComponent(locationPath.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('filter').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        let ft: Filter;
        if (filterString) {
            ft = new Filter(filterString);
        }

        return new fromOrdersActions.OrdersReadAction({ filter: ft });
    }
}

