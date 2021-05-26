import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonComponentsModule } from '../../common/components/common-components.module';
import { DocumentLayoutModule } from '../../common/layouts/document-layout/document-layout.module';
import { MenuLayoutModule } from '../../common/layouts/menu-layout/menu-layout.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { CustomerContactComponent } from './components/customer-contact/customer-contact.component';
import {
    CustomerListItemComponent
} from './components/customer-list-item/customer-list-item.component';
import { CustomerPickerComponent } from './components/customer-picker/customer-picker.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersScreenComponent } from './screens/customers-screen.component';
import { CustomerEditService } from './services/customer-edit.service';
import { CustomersDataService } from './services/customers.data.service';
import { CustomersService } from './services/customers.service';
import { CustomersEffects, customersReducer } from './store/index';

@NgModule({
    declarations: [CustomersScreenComponent, CustomerListItemComponent, CustomerContactComponent, CustomerPickerComponent],
    exports: [CustomerPickerComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        EffectsModule.forFeature([CustomersEffects]),
        InfiniteScrollModule,
        CustomersRoutingModule,
        StoreModule.forFeature('customers', customersReducer),

        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTabsModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReactiveFormsModule,

        MatExpansionModule,

        MenuLayoutModule,
        DocumentLayoutModule,
        OrganizationsModule,
        CommonComponentsModule
    ],
    providers: [
        CustomersDataService,
        CustomerEditService,
        CustomersService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomersModule { }
