import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrganizationsScreenComponent } from './screens/organizations-screen.component';

const routes: Routes = [
    { path: '', component: OrganizationsScreenComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationsRoutingModule { }
