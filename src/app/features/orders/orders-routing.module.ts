import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    VendorOrderWizardComponent
} from './screens/vendor-order-wizard/vendor-order-wizard.component';
import { VendorOrdersComponent } from './screens/vendor-orders/vendor-orders.component';

const routes: Routes = [
    { path: '', component: VendorOrdersComponent },
    { path: ':id', component: VendorOrderWizardComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule { }
