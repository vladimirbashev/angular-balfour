import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';
import { ApplicationsSidenavComponent } from './applications-sidenav/applications-sidenav.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { LoadingStateComponent } from './loading-state/loading-state.component';
import { StateComponent } from './state/state.component';
import { ExcelSummaryDialogComponent } from './excel-summary-dialog/excel-summary-dialog.component';
import { StepperScrollUpDirective } from './stepper-scroll-up/stepper-scroll-up.directive';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

const components = [ApplicationsSidenavComponent, StateComponent, EmptyStateComponent, LoadingStateComponent, StepperScrollUpDirective, ExcelSummaryDialogComponent];

@NgModule({
    declarations: components,
    exports: components,
    imports: [
        CommonModule,
        FlexLayoutModule,
        RouterModule,

        MatStepperModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatDialogModule,
        MatRadioModule,
        FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonComponentsModule { }
