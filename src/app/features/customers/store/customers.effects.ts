import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EntityState } from 'src/app/common';

import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { AppSettingsService } from '../../../common/services/appsettings.service';
import { CustomersDataService } from '../services/customers.data.service';
import * as fromCustomersActions from './customers.actions';

@Injectable()
export class CustomersEffects {
    constructor(
        private actions$: Actions,
        private ass: AppSettingsService,
        private ds: CustomersDataService,
        private route: ActivatedRoute
    ) { }

    @Effect() readCustomers$: Observable<Action> = this.actions$.pipe(
        ofType(fromCustomersActions.CustomersActionType.CustomersRead),
        switchMap((action: fromCustomersActions.CustomersReadAction) => {
            const insert: boolean = action?.payload?.skip !== 0;
            return this.ds.readCustomers(action?.payload?.skip ?? 0, action?.payload?.take ?? 0, action?.payload?.filter ?? null).pipe(
                map(dp => new fromCustomersActions.CustomersReadSuccessAction({
                    customers: dp.data,
                    insert,
                    isComplete: dp?.data?.length !== this.ass.getProperty(['services', 'customers.data', 'defaults', 'take'], 10)
                        || !dp?.data?.length
                })),
                catchError(error => of(new fromCustomersActions.CustomersReadFailureAction({ error })))
            );
        })
    );

    @Effect() readCustomersSuccess$: Observable<Action> = this.actions$.pipe(
        ofType(fromCustomersActions.CustomersActionType.CustomersReadSuccess),
        map((action: fromCustomersActions.CustomersReadSuccessAction) => {
            const urlState = this.route.snapshot.queryParamMap.get('entity_state');
            if (urlState === EntityState.Create) {
                return new fromCustomersActions.CustomersSetStateAction({ state: EntityState.Create });
            } else {
                const customers = action?.payload?.customers || [];
                return new fromCustomersActions.CustomersSetStateAction(
                    { state: customers.length > 0 ? EntityState.Data : EntityState.Empty }
                );
            }
        })
    );
 
    @Effect()
    customersCreate$: Observable<Action> = this.actions$.pipe(
        ofType(fromCustomersActions.CustomersActionType.CustomersCreateInit),
        switchMap((action: fromCustomersActions.CustomersCreateInitAction) => {
            return this.ds.createCustomer(action.payload.customer).pipe(
                map(customer => new fromCustomersActions.CustomersCreateSuccessAction({ customer })),
                catchError(error => of(new fromCustomersActions.CustomersCreateFailureAction({ error })))
            );
        })
    );
    @Effect()
    customersUpdate$: Observable<Action> = this.actions$.pipe(
        ofType(fromCustomersActions.CustomersActionType.CustomersUpdateInit),
        switchMap((action: fromCustomersActions.CustomersUpdateInitAction) => {
            return this.ds.updateCustomer(action.payload.id, action.payload.customer).pipe(
                map(customer => new fromCustomersActions.CustomersUpdateSuccessAction({ id: action.payload.id, customer })),
                catchError(error => of(new fromCustomersActions.CustomersUpdateFailureAction({ error })))
            );
        })
    );
    @Effect()
    customersDelete$: Observable<Action> = this.actions$.pipe(
        ofType(fromCustomersActions.CustomersActionType.CustomersDeleteInit),
        switchMap((action: fromCustomersActions.CustomersDeleteInitAction) => {
            return this.ds.deleteCustomer(action.payload.id).pipe(
                map(customer => new fromCustomersActions.CustomersDeleteSuccessAction({ id: action.payload.id })),
                catchError(error => of(new fromCustomersActions.CustomersDeleteFailureAction({ error })))
            );
        })
    );
}
