import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { NavLayoutComponent } from './common/layouts/index';

const routes: Routes = [
  {
    path: '', component: NavLayoutComponent, children: [
      { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
      { path: 'envelopes', loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule) },
      { path: 'organizations', loadChildren: () => import('./features/organizations/organizations.module')
        .then(m => m.OrganizationsModule) },
      { path: 'customers', loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule) },
      { path: 'customer_orders', loadChildren: () => import('./features/customer-orders/customer-orders.module')
        .then(m => m.CustomerOrdersModule) },
      {
        path: 'user_settings', loadChildren: () =>
          import('./features/user-settings/user-settings.module').then(m => m.UserSettingsModule)
      },
      { path: 'email_marketing', loadChildren: () => import('./features/email-marketing/email-marketing.module').then(m => m.EmailMarketingModule) },
      { path: '**', redirectTo: 'envelopes', pathMatch: 'full' },
      { path: '', redirectTo: 'envelopes', pathMatch: 'full' }
    ],
    canActivate: [MsalGuard]
  },
  { path: '**', redirectTo: 'envelopes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
