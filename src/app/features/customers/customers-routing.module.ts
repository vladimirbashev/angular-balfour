import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomersScreenComponent } from './screens/customers-screen.component';

const routes: Routes = [
    { path: '', component: CustomersScreenComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }
