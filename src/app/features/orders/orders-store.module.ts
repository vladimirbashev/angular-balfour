import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { OrdersDataService, OrdersService } from './services';
import { OrdersEffects, ordersReducer } from './store';

@NgModule({
    imports: [
        EffectsModule.forFeature([OrdersEffects]),
        StoreModule.forFeature('orders', ordersReducer),
    ],
    providers: [
        OrdersDataService,
        OrdersService
    ]
})
export class OrdersStoreModule { }
