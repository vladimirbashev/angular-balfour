import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    UserSettingsAccountComponent
} from './components/settings-account/user-settings-account.component';
import {
    UserSettingsAddressComponent
} from './components/settings-address/user-settings-address.component';
import { UserSettingsComponent } from './screens/user-settings.component';

const routes: Routes = [
    {
        path: '', component: UserSettingsComponent,
        children: [
            {
                path: 'account',
                component: UserSettingsAccountComponent
            },
            {
                path: 'shipping_address',
                component: UserSettingsAddressComponent
            }
        ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
