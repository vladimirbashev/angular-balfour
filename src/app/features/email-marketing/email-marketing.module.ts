import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EmailMarketingRoutingModule } from './email-marketing-routing.module';
import { EmailMarketingScreenComponent } from './screens/email-marketing-screen.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from '@angular/flex-layout';

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
import { DocumentLayoutModule } from 'src/app/common';

@NgModule({
    declarations: [EmailMarketingScreenComponent],
    imports: [
      EmailMarketingRoutingModule,

      FormsModule,
      ReactiveFormsModule,
      FlexLayoutModule,

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

      CommonModule,
      DocumentLayoutModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmailMarketingModule {}
