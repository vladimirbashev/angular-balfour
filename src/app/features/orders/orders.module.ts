import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CommonComponentsModule } from '../../common/components/common-components.module';
import { DocumentLayoutModule, MenuLayoutModule } from '../../common/layouts';
import { CustomerOrdersModule } from '../customer-orders/customer-orders.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { StatusChipComponent } from './components/status-chip/status-chip.component';
import { VendorOrderDetailsComponent } from './components/vendor-order-details/vendor-order-details.component';
import { VendorOrderListItemComponent } from './components/vendor-order-list-item/vendor-order-list-item.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersStoreModule } from './orders-store.module';
import { VendorOrderWizardComponent } from './screens/vendor-order-wizard/vendor-order-wizard.component';
import { VendorOrdersComponent } from './screens/vendor-orders/vendor-orders.component';
import { OrdersChangeStatusDialogComponent } from './components/change-status-dialog/change-status-dialog.component';
import { OrdersChangeStatusMultiDialogComponent } from './components/change-status-multi-dialog/change-status-multi-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MarkdownModule } from 'ngx-markdown';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [VendorOrderListItemComponent, VendorOrderDetailsComponent,
        VendorOrderWizardComponent, VendorOrdersComponent, StatusChipComponent, OrdersChangeStatusDialogComponent, OrdersChangeStatusMultiDialogComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        InfiniteScrollModule,
        OrdersRoutingModule,
        FormsModule,
        ReactiveFormsModule,

        CommonComponentsModule,
        CustomerOrdersModule,
        OrdersStoreModule,
        OrganizationsModule,
        DocumentLayoutModule,

        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatExpansionModule,
        MatTabsModule,
        MenuLayoutModule,
        MarkdownModule.forRoot(),
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatBadgeModule,
        MatDialogModule,
        MatSnackBarModule,
        MatRippleModule,
        MatListModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersModule { }
