import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonComponentsModule } from '../../common/components/common-components.module';
import { RpControlsModule } from '../../common/controls/controls.module';
import { DocumentLayoutModule, MenuLayoutModule } from '../../common/layouts';
import { CustomersModule } from '../customers/customers.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ProductsModule } from '../products/products.module';
import { OrdersStoreModule } from './../orders/orders-store.module';
import { CustomerOrderDetailsComponent } from './components/customer-order-details/customer-order-details.component';
import { CustomerOrderListItemComponent } from './components/customer-order-list-item/customer-order-list-item.component';
import { CustomerOrdersRoutingModule } from './customer-orders-routing.module';
import { CustomerOrdersWizardComponent } from './screens/customer-orders-wizard/customer-orders-wizard.component';
import { CustomerOrdersScreenComponent } from './screens/customer-orders/customer-orders-screen.component';
import { CustomerOrdersDataService, CustomerOrdersService } from './services';
import { CustomerOrdersEffects, customerOrdersReducer } from './store';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormlyModule.forChild(),
        FormlyMaterialModule,
        InfiniteScrollModule,
        CustomerOrdersRoutingModule,
        StoreModule.forFeature('customer-orders', customerOrdersReducer),
        EffectsModule.forFeature([CustomerOrdersEffects]),

        ReactiveFormsModule,

        DocumentLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatExpansionModule,
        MatStepperModule,
        MatNativeDateModule,
        MenuLayoutModule,

        CommonComponentsModule,
        CustomersModule,
        OrganizationsModule,
        OrdersStoreModule,
        ProductsModule,
        RpControlsModule
    ],
    providers: [
        CustomerOrdersDataService,
        CustomerOrdersService
    ],
    declarations: [
        CustomerOrdersScreenComponent,
        CustomerOrderDetailsComponent,
        CustomerOrderListItemComponent,
        CustomerOrdersWizardComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerOrdersModule { }
