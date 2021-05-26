import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    CustomerOrdersWizardComponent
} from './screens/customer-orders-wizard/customer-orders-wizard.component';
import {
    CustomerOrdersScreenComponent
} from './screens/customer-orders/customer-orders-screen.component';

const routes: Routes = [
    { path: '', component: CustomerOrdersScreenComponent },
    { path: ':id', component: CustomerOrdersWizardComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerOrdersRoutingModule { }
