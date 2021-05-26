import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonComponentsModule } from '../../common/components/common-components.module';
import { DocumentLayoutModule } from '../../common/layouts/document-layout/document-layout.module';
import { MenuLayoutModule } from '../../common/layouts/menu-layout/menu-layout.module';
import {
    UserSettingsAccountComponent
} from './components/settings-account/user-settings-account.component';
import {
    UserSettingsAddressComponent
} from './components/settings-address/user-settings-address.component';
import { UserSettingsComponent } from './screens/user-settings.component';
import { UserSettingsRoutingModule } from './user-settings-routing.module';

@NgModule({
    declarations: [UserSettingsComponent, UserSettingsAccountComponent, UserSettingsAddressComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        UserSettingsRoutingModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatButtonToggleModule,
        MatSnackBarModule,
        ReactiveFormsModule,

        CommonComponentsModule,
        MenuLayoutModule,
        DocumentLayoutModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserSettingsModule { }
