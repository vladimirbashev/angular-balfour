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

import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CommonComponentsModule } from '../../common/components/common-components.module';
import { DocumentLayoutModule } from '../../common/layouts/document-layout/document-layout.module';
import { MenuLayoutModule } from '../../common/layouts/menu-layout/menu-layout.module';
import {
    OrganizationDetailsComponent
} from './components/organization-details/organization-details.component';
import {
    OrganizationListItemComponent
} from './components/organization-list-item/organization-list-item.component';
import {
    OrganizationPickerComponent
} from './components/organization-picker/organization-picker.component';
import { OrganizationsAddDialogComponent } from './components/organizations-add-dialog/organizations-add-dialog.component';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationsScreenComponent } from './screens/organizations-screen.component';
import { OrganizationEditService } from './services/organization-edit.service';
import { OrganizationsDataService } from './services/organizations.data.service';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationsEffects, organizationsReducer } from './store/index';

@NgModule({
    declarations: [
        OrganizationsScreenComponent,
        OrganizationListItemComponent,
        OrganizationDetailsComponent,
        OrganizationPickerComponent,
        OrganizationsAddDialogComponent],
    exports: [OrganizationPickerComponent, OrganizationsAddDialogComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        EffectsModule.forFeature([OrganizationsEffects]),
        InfiniteScrollModule,
        OrganizationsRoutingModule,
        StoreModule.forFeature('organizations', organizationsReducer),
        CommonComponentsModule,

        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatExpansionModule,
        MatDialogModule,
        MatListModule,
        MatProgressBarModule,

        MenuLayoutModule,
        DocumentLayoutModule
    ],
    providers: [
        OrganizationsDataService,
        OrganizationEditService,
        OrganizationsService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizationsModule { }
