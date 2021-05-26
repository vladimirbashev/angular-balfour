import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailMarketingScreenComponent } from './screens/email-marketing-screen.component';

const routes: Routes = [
    { path: '', component: EmailMarketingScreenComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailMarketingRoutingModule { }
