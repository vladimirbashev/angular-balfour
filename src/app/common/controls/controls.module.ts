import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { RpControlDirective } from './control-host.directive';
import { InputRadioComponent } from './input-radio/input-radio.component';
import { QuestionComponent } from './question/question.component';
import { TextInputComponent } from './text-input/text-input.component';
import { MatSelectModule } from '@angular/material/select';
import { DropdownComponent } from './dropdown/dropdown.component';

const controls = [
    InputRadioComponent,
    TextInputComponent,
    DropdownComponent
];

@NgModule({
    declarations: [
        QuestionComponent,
        RpControlDirective,
        ...controls
    ],
    exports: [QuestionComponent, RpControlDirective],
    entryComponents: controls,
    imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule
    ]
})
export class RpControlsModule { }
